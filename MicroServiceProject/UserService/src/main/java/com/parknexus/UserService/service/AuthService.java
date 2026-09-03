package com.parknexus.UserService.service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.parknexus.UserService.config.RabbitMQProperties;
import com.parknexus.UserService.dto.TokenPairDto;
import com.parknexus.UserService.dto.event.ForgotPasswordEmailEvent;
import com.parknexus.UserService.dto.event.RegisterEmailEvent;
import com.parknexus.UserService.entity.Account;
import com.parknexus.UserService.form.ForgotPasswordForm;
import com.parknexus.UserService.form.LoginForm;
import com.parknexus.UserService.form.RegisterForm;
import com.parknexus.UserService.form.ResetPasswordForm;
import com.parknexus.UserService.form.VerifyAccountForm;

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
    private final AccountTokenService accountTokenService;
    private final PasswordUtils passwordUtils;

    private final RabbitTemplate rabbitTemplate;
    private final RabbitMQProperties rabbitMQProperties;

    public Account register(RegisterForm form) {
        Account newAccount = new Account();
        newAccount.setEmail(form.getEmail());
        newAccount.setPassword(passwordUtils.hashPassword(form.getPassword()));
        accountRepository.save(newAccount);

        String rawOtp = emailOtpService.genAndSaveOtp(form.getEmail(), 60);

        RegisterEmailEvent emailEvent = new RegisterEmailEvent(form.getEmail(), rawOtp, 5);
        try {
            rabbitTemplate.convertAndSend(
                    rabbitMQProperties.exchange(),
                    rabbitMQProperties.routingKey().registration(),
                    emailEvent);
            log.info("added to queue -----------");
        } catch (Exception e) {
            log.error("error adding to queue ----------");
        }

        return newAccount;
    }

    public Account verifyAccount(VerifyAccountForm form) {
        Account savedAccount = accountRepository.findOneByEmail(form.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Account not exist"));

        if (savedAccount.isVerified()) {
            return savedAccount;
        }

        Boolean isOtpValid = emailOtpService.verifyOtp(form.getEmail(), form.getOtp());
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

    public void forgotPassword(ForgotPasswordForm form) {
        Account account = accountRepository.findOneByEmail(form.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("No account found"));

        String rawOtp = emailOtpService.genAndSaveOtp(account.getEmail(), 60);

        ForgotPasswordEmailEvent emailEvent = new ForgotPasswordEmailEvent(account.getEmail(), rawOtp, 5);
        try {
            rabbitTemplate.convertAndSend(
                    rabbitMQProperties.exchange(),
                    rabbitMQProperties.routingKey().passwordReset(), emailEvent);
        } catch (Exception e) {
            log.error("error adding to queue ----------");
        }
    }

    public Account resetPassword(ResetPasswordForm form) {
        Account account = accountRepository.findOneByEmail(form.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("No account found"));

        Boolean isOtpValid = emailOtpService.verifyOtp(form.getEmail(), form.getOtp());
        if (isOtpValid) {
            account.setPassword(form.getNewPassword());
            return accountRepository.save(account);
        }

        throw new IllegalArgumentException("Password can't be reset");
    }
}
