package com.hospitalsr.config;

import com.hospitalsr.repositories.UsuarioSistemaRepo;
import com.hospitalsr.entities.UsuarioSistema;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UsuarioSistemaRepo usuarioRepo;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            UsuarioSistema u = usuarioRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
            return User.builder()
                .username(u.getUsername())
                .password(u.getPassword())
                .roles(u.getRol()) // Spring añade automáticamente el prefijo "ROLE_"
                .build();
        };
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                // 1. Recursos estáticos públicos
                .requestMatchers("/css/**", "/js/**", "/img/**", "/webjars/**").permitAll()
                // 2. Autenticación pública
                .requestMatchers("/login", "/login-error").permitAll()
                // 3. ¡IMPORTANTE! Rutas del marcador de asistencia pública para los estudiantes
                .requestMatchers("/asistencia/**", "/api/asistencia/**").permitAll() 
                // 4. Todo lo demás (Dashboard, reportes, creación de mallas) requiere Login
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/dashboard", true)
                .failureUrl("/login?error=true")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login")
                .permitAll()
            )
            .csrf(csrf -> csrf.disable()); // Deshabilitado para facilitar las peticiones AJAX del marcador
            
        return http.build();
    }
}