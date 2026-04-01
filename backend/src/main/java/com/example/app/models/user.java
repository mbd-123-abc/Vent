//Mahika Bagri 
//30 March 2026

package com.example.app.models;
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
@Table(name = "auth")
@Getter
@Setter

public class user implements UserDetails{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id; 

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "verified")
    private boolean verified;

    @Column(name = "banned")
    private boolean banned;

    public user(String username, String email, String password){
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public user(){
        //
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