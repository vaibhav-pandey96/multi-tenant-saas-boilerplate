package com.saas.saas_boilerplate.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String token) {
        String verificationLink = "http://localhost:8080/api/auth/verify?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Verify Your Email - SaaS Boilerplate");
        message.setText("Hi! \n\nClick this link to verify your email:\n\n"
                + verificationLink
                + "\n\nThis link expires in 24 hours.\n\nThanks!");

        mailSender.send(message);
    }
}