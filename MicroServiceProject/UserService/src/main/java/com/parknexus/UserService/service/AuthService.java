package com.parknexus.UserService.service;

import java.util.Optional;

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
            return null;
        }

        return newAccount;
    }

    public Account verifyAccount(VerifyEmailOtpForm form) {
        Optional<Account> optionalSavedAccount = accountRepository.findOneByEmail(form.getEmail());
        if (optionalSavedAccount.isEmpty()) {
            return null;
        }

        Account savedAccount = optionalSavedAccount.get();
        if (savedAccount.isVerified()) {
            return savedAccount;
        }

        Boolean isOtpValid = emailOtpService.verifyOtp(form);
        if (isOtpValid) {
            savedAccount.setVerified(true);
            accountRepository.save(savedAccount);
            return savedAccount;
        }

        return null;
    }

    public TokenPairDto login(LoginForm form) {
        Optional<Account> optionalAccount = accountRepository.findOneByEmail(form.getEmail());
        if (optionalAccount.isEmpty()) {
            throw new IllegalArgumentException("No account found");
        }

        Account account = optionalAccount.get();
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
