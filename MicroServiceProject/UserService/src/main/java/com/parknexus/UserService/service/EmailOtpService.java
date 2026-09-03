package com.parknexus.UserService.service;

import java.security.SecureRandom;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.parknexus.UserService.entity.EmailOtp;
import com.parknexus.UserService.repository.IEmailOtpRepository;
import com.parknexus.UserService.util.OtpUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailOtpService {
    private final IEmailOtpRepository otpRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    private static final long TOTAL_TTL_SECONDS = 300L;

    public String genAndSaveOtp(String email, int delaySeconds) {
        Optional<EmailOtp> existingOtpOpt = otpRepository.findById(email);
        if (existingOtpOpt.isPresent()) {
            EmailOtp existingOtp = existingOtpOpt.get();
            Long currentTtl = existingOtp.getTtlInSeconds();

            long cooldownThreshold = TOTAL_TTL_SECONDS - delaySeconds;

            if (currentTtl != null && currentTtl > cooldownThreshold) {
                long waitSeconds = currentTtl - cooldownThreshold;
                throw new IllegalStateException(
                        String.format("Please wait for %d seconds before requesting a new OTP.", waitSeconds));
            }
        }

        String rawOtp = String.format("%06d", secureRandom.nextInt(1000000));
        String hashedOtp = OtpUtils.hashOtp(rawOtp);

        EmailOtp emailOtp = new EmailOtp();
        emailOtp.setEmail(email);
        emailOtp.setHashedOtp(hashedOtp);
        emailOtp.setTtlInSeconds(TOTAL_TTL_SECONDS);
        otpRepository.save(emailOtp);

        return rawOtp;
    }

    public boolean verifyOtp(String email, String otp) {
        Optional<EmailOtp> optionalOtp = otpRepository.findById((email));
        if (optionalOtp.isEmpty()) {
            return false;
        }

        EmailOtp savedEmailOtp = optionalOtp.get();

        String hashedInputOtp = OtpUtils.hashOtp(otp);
        if (savedEmailOtp.getHashedOtp().equals(hashedInputOtp)) {
            otpRepository.deleteById(email);
            return true;
        }

        return false;
    }
}
