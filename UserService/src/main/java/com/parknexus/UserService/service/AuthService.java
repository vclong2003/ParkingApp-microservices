package com.parknexus.UserService.service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.parknexus.Common.enums.AccountRole;
import com.parknexus.UserService.config.RabbitMQProperties;
import com.parknexus.UserService.config.SecurityProperties;
import com.parknexus.UserService.dto.TokenPairDto;
import com.parknexus.UserService.dto.event.ForgotPasswordEmailEvent;
import com.parknexus.UserService.dto.event.RegisterEmailEvent;
import com.parknexus.UserService.entity.Account;
import com.parknexus.UserService.entity.User;
import com.parknexus.UserService.form.ForgotPasswordForm;
import com.parknexus.UserService.form.LoginForm;
import com.parknexus.UserService.form.RegisterForm;
import com.parknexus.UserService.form.ResetPasswordForm;
import com.parknexus.UserService.form.VerifyAccountForm;

import com.parknexus.UserService.repository.IAccountRepository;
import com.parknexus.UserService.repository.IUserRepository;
import com.parknexus.UserService.util.PasswordUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    private final SecurityProperties securityProperties;
    private final IAccountRepository accountRepository;
    private final IUserRepository userRepository;
    private final EmailOtpService emailOtpService;
    private final AccountTokenService accountTokenService;
    private final PasswordUtils passwordUtils;

    private final RabbitTemplate rabbitTemplate;
    private final RabbitMQProperties rabbitMQProperties;

    public Account getAccountById(Integer accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
    }

    public void register(RegisterForm form) {
        log.info("registering account with email: {}", form.getEmail());
        String email = "";

        Account existingAccount = accountRepository.findOneByEmail(form.getEmail()).orElse(null);
        if (existingAccount != null && existingAccount.isVerified()) {
            log.info("account already exists with email: {}", form.getEmail());
            throw new IllegalArgumentException("Account already exists");
        }

        if (existingAccount != null) {
            email = existingAccount.getEmail();
        }

        if (existingAccount == null) {
            Account newAccount = new Account();
            newAccount.setEmail(form.getEmail());
            newAccount.setPassword(passwordUtils.hashPassword(form.getPassword()));
            Account savedAccount = accountRepository.save(newAccount);
            email = savedAccount.getEmail();
        }

        String rawOtp = emailOtpService.genAndSaveOtp(email, 60);
        RegisterEmailEvent emailEvent = new RegisterEmailEvent(form.getEmail(), rawOtp, 5);
        try {
            rabbitTemplate.convertAndSend(
                    rabbitMQProperties.exchange().notification(),
                    rabbitMQProperties.routingKey().notification().registration(),
                    emailEvent);
            log.info("added to queue -----------");
        } catch (Exception e) {
            log.error("error adding to queue ----------");
        }
    }

    public void verifyAccount(VerifyAccountForm form) {
        Account savedAccount = accountRepository.findOneByEmail(form.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Account not exist"));

        if (savedAccount.isVerified()) {
            return;
        }

        Boolean isOtpValid = emailOtpService.verifyOtp(form.getEmail(), form.getOtp());
        if (isOtpValid) {
            savedAccount.setVerified(true);
            accountRepository.save(savedAccount);
            return;
        }

        throw new IllegalArgumentException("Account can't be verified");
    }

    @Transactional
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

        User user = userRepository.findByAccountId(account.getId()).orElse(null);
        Integer userId = user != null ? user.getId() : null;

        String refreshToken = accountTokenService.genAndSaveRefreshToken(account.getId(), userId, account.getRole());
        String accessToken = accountTokenService.genAccessToken(account.getId(), userId, account.getRole());

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
                    rabbitMQProperties.exchange().notification(),
                    rabbitMQProperties.routingKey().notification().passwordReset(), emailEvent);
        } catch (Exception e) {
            log.error("error adding to queue ----------");
        }
    }

    public void resetPassword(ResetPasswordForm form) {
        Account account = accountRepository.findOneByEmail(form.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("No account found"));

        Boolean isOtpValid = emailOtpService.verifyOtp(form.getEmail(), form.getOtp());
        if (isOtpValid) {
            account.setPassword(passwordUtils.hashPassword(form.getNewPassword()));
            accountRepository.save(account);
            return;
        }

        throw new IllegalArgumentException("Password can't be reset");
    }

    public void createAdminIfNotExist() {
        String adminEmail = securityProperties.admin().email();
        String adminPassword = securityProperties.admin().password();

        if (accountRepository.findOneByEmail(adminEmail).isEmpty()) {
            Account adminAccount = new Account();
            adminAccount.setEmail(adminEmail);
            adminAccount.setPassword(passwordUtils.hashPassword(adminPassword));
            adminAccount.setRole(AccountRole.Admin);
            adminAccount.setVerified(true);
            accountRepository.save(adminAccount);
            log.info("default admin account created");
        }
    }
}
