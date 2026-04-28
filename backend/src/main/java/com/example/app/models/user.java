//Mahika Bagri 
//27 April 2026

package com.example.app.models;
import java.time.LocalDateTime;

import org.springframework.security.core.userdetails.UserDetails;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "user_auth")
@Getter
@Setter
public class user implements UserDetails{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id; 

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(name = "verification_code")
    private String verificationCode;

    @Column(name = "verification_expiration")
    private LocalDateTime verificationCodeExpiresAt;

    @Column(name = "verified")
    private boolean verified;

    @Column(name = "banned")
    private boolean banned;

    @Column(name = "Bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "chatType")
    @com.fasterxml.jackson.annotation.JsonProperty("chat_type")
    private String chatType;

    @Column(name = "rolePreference")
    @com.fasterxml.jackson.annotation.JsonProperty("role_preference")
    private String rolePreference;

    @Column(name = "gender")
    private String gender;

    @Column(name = "color")
    private String color;

@Column(name = "Moods")
    @jakarta.persistence.ElementCollection(fetch = jakarta.persistence.FetchType.EAGER)
    @jakarta.persistence.CollectionTable(
        name = "user_moods", 
        joinColumns = @jakarta.persistence.JoinColumn(name = "user_id")
    )
    private java.util.Set<String> moods = new java.util.HashSet<>();
    
    @Column(name = "Topics")
    @jakarta.persistence.ElementCollection(fetch = jakarta.persistence.FetchType.EAGER)
    @jakarta.persistence.CollectionTable(
        name = "user_topics", 
        joinColumns = @jakarta.persistence.JoinColumn(name = "user_id")
    )
    private java.util.Set<String> topics = new java.util.HashSet<>();

    public user(){
        //
    }

    public user(String name, String username, String email, String password){
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    @Override
    public java.util.Collection<? extends org.springframework.security.core.GrantedAuthority> getAuthorities() {
        //Enable for Admin Permissions 
        return java.util.List.of(); 
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !banned;
    }

    @Override
    public boolean isEnabled() {
        return verified; 
    }

    @Override
    public boolean isAccountNonExpired() {
        //Change for Paid Instance
        return true; 
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; 
    }
}