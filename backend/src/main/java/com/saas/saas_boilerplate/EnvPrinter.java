package com.saas.saas_boilerplate;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class EnvPrinter {

    @Value("${DB_URL}")
    private String dbUrl;

    @Value("${DB_USERNAME}")
    private String dbUsername;

    @PostConstruct
    public void printEnv() {
        System.out.println("DB_URL = " + dbUrl);
        System.out.println("DB_USERNAME = " + dbUsername);
    }
}