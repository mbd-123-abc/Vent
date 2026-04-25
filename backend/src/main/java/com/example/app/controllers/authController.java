//Mahika Bagri 
//23 April 2026

package com.example.app.controllers;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.app.models.user;
import com.example.app.responses.loginResponses;
import com.example.app.dto.loginDto;
import com.example.app.dto.registerationDto;
import com.example.app.dto.verificationDto;
import com.example.app.services.authServices;
import com.example.app.services.jwtServices;
import org.springframework.http.ResponseEntity;

@RequestMapping("/auth")
@RestController
public class authController {
    private final jwtServices jwtService;
    private final authServices authService;

    public authController(jwtServices jwtService, authServices authService){
        this.jwtService = jwtService;
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<user> register(@RequestBody registerationDto registerationDto){
        System.out.println("CONTROLLER HIT");
        user registeredUser = authService.signup(registerationDto);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<loginResponses> login(@RequestBody loginDto loginDto){
        user loginUser = authService.authentication(loginDto);
        String jwtToken = jwtService.generateToken(loginUser);
        loginResponses loginResponse = new loginResponses(jwtToken, jwtService.getExpirationTime());
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody verificationDto verificationDto){
        try{
            authService.verifyUser(verificationDto);
            return ResponseEntity.ok("Account Verrified");
        }catch (RuntimeException error){
            return ResponseEntity.badRequest().body(error.getMessage());
        }
    }

    @PostMapping("/resend")
    public ResponseEntity<?> resendVerificationCode(@RequestParam String email){
        try{
            authService.resendVerificationCode(email);
            return ResponseEntity.ok("Verification Code Sent");
        }catch (RuntimeException error){
            return ResponseEntity.badRequest().body(error.getMessage());
        }
    }

}
