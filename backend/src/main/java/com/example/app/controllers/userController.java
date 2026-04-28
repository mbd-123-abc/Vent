//Mahika Bagri 
//27 April 2026
package com.example.app.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    @GetMapping("/me/profile")
    public ResponseEntity<user> getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user currentUser = (user) authentication.getPrincipal(); 
        return ResponseEntity.ok(currentUser);   
    }

    @PutMapping("/me/profile")
    public ResponseEntity<user> putMyProfile(@RequestBody user profileUpdate) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user currentUser = (user) authentication.getPrincipal();

        currentUser.setBio(profileUpdate.getBio());
        currentUser.setChatType(profileUpdate.getChatType());
        currentUser.setRolePreference(profileUpdate.getRolePreference());
        currentUser.setMoods(profileUpdate.getMoods());
        currentUser.setTopics(profileUpdate.getTopics());
        currentUser.setGender(profileUpdate.getGender());
        currentUser.setColor(profileUpdate.getColor());

        return ResponseEntity.ok(userService.updateUser(currentUser));
    }
}
