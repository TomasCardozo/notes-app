package com.tomas.note.auth.service;

import com.tomas.note.auth.domain.AppUser;
import com.tomas.note.auth.repository.AppUserRepository;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service
public class DbUserDetailsService implements UserDetailsService {
    private final AppUserRepository appUserRepo;

    public DbUserDetailsService(AppUserRepository appUserRepo) {
        this.appUserRepo = appUserRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = appUserRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("The credentials were not found."));

        return new User(
                user.getUsername(),
                user.getPassword(),
                user.getRoles().stream().map(SimpleGrantedAuthority::new).collect(Collectors.toSet())
        );
    }
}
