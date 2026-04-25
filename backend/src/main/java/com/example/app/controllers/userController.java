//Mahika Bagri 
//24 April 2026
package com.example.app.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.app.services.userServices;
import com.example.app.models.user;
import java.util.List;
import org.springframework.security.core.Authentication;

@RequestMapping("/users")
@RestController
public class userController {
    private final userServices userService;
    public userController(userServices userService){
        this.userService = userService;
    }

@GetMapping("/me")
    public ResponseEntity<user> authenticatedUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user currentUser = (user) authentication.getPrincipal();
        return ResponseEntity.ok(currentUser);
    }

    @GetMapping("/")
    public ResponseEntity<List<user>> allUsers(){
        List<user> users = userService.allUsers();
        return ResponseEntity.ok(users);
    }
}
