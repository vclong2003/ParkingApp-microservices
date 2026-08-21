package com.parknexus.UserService.service;

import java.security.SecureRandom;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.parknexus.UserService.entity.EmailOtp;
import com.parknexus.UserService.form.VerifyEmailOtpForm;
import com.parknexus.UserService.repository.IEmailOtpRepository;
import com.parknexus.UserService.util.OtpUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailOtpService {
    private final IEmailOtpRepository otpRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    public String genAndSaveOtp(String email) {
        String rawOtp = String.format("%06d", secureRandom.nextInt(1000000));
        String hashedOtp = OtpUtils.hashOtp(rawOtp);

        EmailOtp emailOtp = new EmailOtp();
        emailOtp.setEmail(email);
        emailOtp.setHashedOtp(hashedOtp);
        otpRepository.save(emailOtp);

        return rawOtp;
    }

    public boolean verifyOtp(VerifyEmailOtpForm form) {
        Optional<EmailOtp> optionalOtp = otpRepository.findById((form.getEmail()));
        if (optionalOtp.isEmpty()) {
            return false;
        }

        EmailOtp savedEmailOtp = optionalOtp.get();

        String hashedInputOtp = OtpUtils.hashOtp(form.getOtp());
        if (savedEmailOtp.getHashedOtp().equals(hashedInputOtp)) {
            otpRepository.deleteById(form.getEmail());
            return true;
        }

        return false;
    }
}
