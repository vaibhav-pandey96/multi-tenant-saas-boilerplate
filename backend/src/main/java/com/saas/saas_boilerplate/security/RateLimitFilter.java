package com.saas.saas_boilerplate.security;

import com.saas.saas_boilerplate.model.ApiUsageLog;
import com.saas.saas_boilerplate.repository.ApiUsageLogRepository;
import com.saas.saas_boilerplate.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

@Component
@Order(1)
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS_PER_MINUTE = 30;

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final ApiUsageLogRepository apiUsageLogRepository;

    private final Map<String, Queue<Long>> requestLog = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Skip rate limiting for auth endpoints
        if (path.startsWith("/api/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.isTokenValid(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        String email = jwtUtil.extractEmail(token);

        long now = System.currentTimeMillis();
        long oneMinuteAgo = now - 60_000;

        requestLog.putIfAbsent(email, new ConcurrentLinkedQueue<>());
        Queue<Long> timestamps = requestLog.get(email);

        // Remove timestamps older than 1 minute
        while (!timestamps.isEmpty() && timestamps.peek() < oneMinuteAgo) {
            timestamps.poll();   // ✅ Fixed — was tokens.poll() before
        }

        if (timestamps.size() >= MAX_REQUESTS_PER_MINUTE) {
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write(
                "{\"error\": \"Too Many Requests - Rate limit exceeded. Max " 
                + MAX_REQUESTS_PER_MINUTE + " requests per minute.\"}"
            );
            return;
        }

        timestamps.add(now);

        // Log API usage to DB
        try {
            userRepository.findByEmail(email).ifPresent(user -> {
                ApiUsageLog log = ApiUsageLog.builder()
                        .user(user)
                        .tenant(user.getTenant())
                        .endpoint(path)
                        .build();
                apiUsageLogRepository.save(log);
            });
        } catch (Exception ignored) {
            // Never block a request due to logging failure
        }

        filterChain.doFilter(request, response);
    }
}