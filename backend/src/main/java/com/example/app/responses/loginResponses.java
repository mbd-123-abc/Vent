//Mahika Bagri 
//21 April 2026

package com.example.app.responses;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class loginResponses {
    private String token;
    private long expiresIn;
    
    public loginResponses(String token, long expiresIn){
        this.token = token;
        this.expiresIn = expiresIn;
    }
}
