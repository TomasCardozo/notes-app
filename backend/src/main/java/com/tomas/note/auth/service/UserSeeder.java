package com.tomas.note.auth.service;

import com.tomas.note.auth.domain.AppUser;
import com.tomas.note.auth.repository.AppUserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;
import java.util.Set;

@Configuration
public class UserSeeder {
    @Bean
    CommandLineRunner seedSingleUser(AppUserRepository appUserRepo, PasswordEncoder passEncoder) {
        return args -> {
            if(!appUserRepo.existsByUsername("admin")){
                appUserRepo.save(new AppUser(
                        "admin",
                        passEncoder.encode("admin123"),
                        Set.of("ROLE_ADMIN")
                ));
            }
        };
    }
}
