package com.saas.saas_boilerplate.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
    	

    	System.out.println("===== JWT FILTER EXECUTED =====");

    	String authHeader = request.getHeader("Authorization");

    	System.out.println("Request URI: " + request.getRequestURI());
    	System.out.println("Authorization Header: " + authHeader);

//        if (authHeader != null && authHeader.startsWith("Bearer ")) {
//            String token = authHeader.substring(7); // remove "Bearer "
//
//            if (jwtUtil.isTokenValid(token)) {
//                String email = jwtUtil.extractEmail(token);
//                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
//
//                // Tell Spring Security this user is logged in
//                UsernamePasswordAuthenticationToken authToken =
//                        new UsernamePasswordAuthenticationToken(
//                                userDetails, null, userDetails.getAuthorities());
//
//                SecurityContextHolder.getContext().setAuthentication(authToken);
//            }
//        }
//
//        filterChain.doFilter(request, response);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            boolean valid = jwtUtil.isTokenValid(token);
            System.out.println("Token Valid: " + valid);

            if (valid) {
                String email = jwtUtil.extractEmail(token);
                System.out.println("Email from token: " + email);

                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(email);

                System.out.println("User loaded: " + userDetails.getUsername());

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authToken);

                System.out.println("Authentication set successfully.");
            }
        }

        filterChain.doFilter(request, response);
    }
}