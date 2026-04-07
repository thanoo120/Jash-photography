package com.photoshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class PhotoShopApplication {
    public static void main(String[] args) {
        SpringApplication.run(PhotoShopApplication.class, args);
    }
}
