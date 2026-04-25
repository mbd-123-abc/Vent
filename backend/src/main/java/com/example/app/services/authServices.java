//Mahika Bagri 
//21 April 2026

package com.example.app.services;

import com.example.app.repositories.userRepository;
import com.example.app.models.user;
import com.example.app.dto.registerationDto;
import com.example.app.dto.verificationDto;
import com.example.app.dto.loginDto;
import jakarta.mail.MessagingException;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.Optional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class authServices {
    private final userRepository UserRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final emailServices EmailService;   

    public authServices(userRepository UserRepository,PasswordEncoder passwordEncoder,AuthenticationManager authenticationManager,emailServices EmailService){
        this.UserRepository = UserRepository;  
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.EmailService = EmailService;
    }     

    public user signup(registerationDto input){
        System.out.println("Signup Hit");
        user User = new user(input.getName(), input.getUsername(), input.getEmail(), passwordEncoder.encode(input.getPassword()));
        User.setVerificationCode(generateVerificationCode());
        User.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
        User.setVerified(false);
        UserRepository.save(User);
        sendVerificationEmail(User);
        return User;
    }

    public user authentication(loginDto input){
        user User = UserRepository.findByUsername(input.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

        if(!User.isEnabled()){
            throw new RuntimeException("Account not verified");
        }
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(User.getUsername(),input.getPassword()));
        return User; 
    }

    public void verifyUser(verificationDto input){
        Optional<user> optionalUser = UserRepository.findByEmail(input.getEmail());
            if(optionalUser.isPresent()){
                user User = optionalUser.get();
                if (User.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
                    throw new RuntimeException("Verification code has expired");
                }
                if(User.getVerificationCode().equals(input.getVerificationCode())){
                    User.setVerified(true);
                    User.setVerificationCode(null);
                    User.setVerificationCodeExpiresAt(null);
                    UserRepository.save(User);
                }else{
                    throw new RuntimeException("Incorrect verification code");
                }
            }else{
                throw new RuntimeException("User not found");
            }
        }

    public void resendVerificationCode(String email){
        Optional<user> optionalUser = UserRepository.findByEmail(email);
        if(optionalUser.isPresent()){
            user User = optionalUser.get();
            if(User.isEnabled()){
                throw new RuntimeException("Account already verified");
            }
            User.setVerificationCode(generateVerificationCode());
            User.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
            sendVerificationEmail(User);
            UserRepository.save(User);
        }else{
            throw new RuntimeException("User not found");
        }
    }

    public void sendVerificationEmail(user User){
        String subject = "Verify your Account";
        String verificationCode = User.getVerificationCode();
        String htmlMessage = "<html>"
            + "<body style=\"font-family: Arial, sans-serif;\">"
            + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
            + "<h2 style=\"color: #333;\">Welcome to our app!</h2>"
            + "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
            + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
            + "<h3 style=\"color: #333;\">Verification Code:</h3>"
            + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + verificationCode + "</p>"
            + "</div>"
            + "</div>"
            + "</body>"
            + "</html>";
        try{
            EmailService.sendVerificationEmail(User.getEmail(), subject, htmlMessage);
        }catch(MessagingException error){
            error.printStackTrace();
        }
    }

    private String generateVerificationCode(){
        Random randy = new Random();
        int code = randy.nextInt(900000) + 100000;
        return String.valueOf(code);
    }
}
