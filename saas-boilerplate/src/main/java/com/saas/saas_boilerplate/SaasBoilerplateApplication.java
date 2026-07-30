package com.saas.saas_boilerplate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SaasBoilerplateApplication {

	public static void main(String[] args) {
		SpringApplication.run(SaasBoilerplateApplication.class, args);
	}

}
