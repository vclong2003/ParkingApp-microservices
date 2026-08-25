package com.parknexus.UserService.service;

import org.springframework.stereotype.Service;

import com.onesignal.client.model.CreateNotificationSuccessResponse;
import com.parknexus.UserService.dto.TokenPairDto;
import com.parknexus.UserService.entity.Account;
import com.parknexus.UserService.form.LoginForm;
import com.parknexus.UserService.form.RegisterForm;
import com.parknexus.UserService.form.VerifyEmailOtpForm;
import com.parknexus.UserService.lib.OneSignal;
import com.parknexus.UserService.repository.IAccountRepository;
import com.parknexus.UserService.util.PasswordUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    private final IAccountRepository accountRepository;
    private final EmailOtpService emailOtpService;
    private final OneSignal oneSignal;
    private final AccountTokenService accountTokenService;
    private final PasswordUtils passwordUtils;

    public Account register(RegisterForm form) {
        Account newAccount = new Account();
        newAccount.setEmail(form.getEmail());
        newAccount.setPassword(passwordUtils.hashPassword(form.getPassword()));
        accountRepository.save(newAccount);

        String newRawOtp = emailOtpService.genAndSaveOtp(form.getEmail());

        CreateNotificationSuccessResponse result = oneSignal.sendRegisterEmail(form.getEmail(), newRawOtp, 5);
        if (result == null) {
            log.warn("Registration email failed to send: " + newAccount.getEmail());
        }

        return newAccount;
    }

    public Account verifyAccount(VerifyEmailOtpForm form) {
        Account savedAccount = accountRepository.findOneByEmail(form.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Account not exist"));

        if (savedAccount.isVerified()) {
            return savedAccount;
        }

        Boolean isOtpValid = emailOtpService.verifyOtp(form);
        if (isOtpValid) {
            savedAccount.setVerified(true);
            accountRepository.save(savedAccount);
            return savedAccount;
        }

        throw new IllegalArgumentException("Account can't be verified");
    }

    public TokenPairDto login(LoginForm form) {
        Account account = accountRepository.findOneByEmail(form.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("No account found"));
        if (!account.isVerified()) {
            throw new IllegalArgumentException("Account not verified");
        }

        Boolean isPasswordValid = passwordUtils.verifyPassword(form.getPassword(), account.getPassword());
        if (!isPasswordValid) {
            throw new IllegalArgumentException("Wrong login credentials");
        }
        String refreshToken = accountTokenService.genAndSaveRefreshToken(account);
        String accessToken = accountTokenService.genAccessToken(account);

        return new TokenPairDto(refreshToken, accessToken);
    }

    public TokenPairDto refreshAccessToken(String refreshToken) {
        String newAccessToken = accountTokenService.refreshAccessToken(refreshToken);
        return new TokenPairDto(null, newAccessToken);
    }
}
