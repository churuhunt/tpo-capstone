package tpo.capstone.config;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.PropertiesPropertySource;

import java.util.Properties;

@Configuration
@PropertySource("classpath:application.properties")
public class ConfigLoader {

    private final Dotenv dotenv = Dotenv.configure().filename(".env").load();
    private final ConfigurableEnvironment environment;

    public ConfigLoader(ConfigurableEnvironment environment) {
        this.environment = environment;
    }

    @PostConstruct
    public void loadEnvProperties() {
        Properties properties = new Properties();
        dotenv.entries().forEach(entry -> properties.setProperty(entry.getKey(), entry.getValue()));
        dotenv.entries().forEach(entry -> System.out.println(entry.getKey() + ": " + entry.getValue()));
        PropertiesPropertySource propertySource = new PropertiesPropertySource("dotenvProperties", properties);
        environment.getPropertySources().addLast(propertySource);
    }
}