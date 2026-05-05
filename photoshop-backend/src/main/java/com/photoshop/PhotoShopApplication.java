package com.photoshop;

import com.photoshop.config.BootstrapAdminProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
@EnableConfigurationProperties(BootstrapAdminProperties.class)
public class PhotoShopApplication {
    public static void main(String[] args) {
        SpringApplication.run(PhotoShopApplication.class, args);
    }
}
