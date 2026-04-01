//Mahika Bagri 
//30 March 2026

package com.example.app.repositories;
import com.example.app.models.user;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository;
import java.util.Optional;

@Repository

public interface userRepository extends CrudRepository<user,Long>{
    Optional<user> findByEmail(String email);
    Optional<user> findByVerificationCode(String verificationCode);
}
