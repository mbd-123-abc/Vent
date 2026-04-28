//Mahika Bagri 
//27 April 2026

package com.example.app.services;

import org.springframework.stereotype.Service;
import com.example.app.repositories.userRepository;
import com.example.app.models.user;

import java.util.ArrayList;
import java.util.List;

@Service
public class userServices {
    private final userRepository UserRepository;
    public userServices(userRepository UserRepository, emailServices EmailService){
        this.UserRepository = UserRepository;  
    }

    public List<user> allUsers(){
        List<user> users = new ArrayList<>();
        UserRepository.findAll().forEach(users::add);
        return users;
    }

    public user updateUser(user existingUser) {
        if (existingUser.getBio() != null && existingUser.getBio().length() > 500) {
            throw new RuntimeException("Bio too long!");
        }
        return this.UserRepository.save(existingUser);
    }
}
