package com.tomas.note.config;

import com.tomas.note.category.domain.Category;
import com.tomas.note.category.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CategorySeeder {

    @Bean
    CommandLineRunner seedCategories(CategoryRepository categoryRepository) {
        return args -> {

            createIfMissing(categoryRepository, "Personal");
            createIfMissing(categoryRepository, "Work");
            createIfMissing(categoryRepository, "Important");

        };
    }

    private void createIfMissing(CategoryRepository repository, String name) {

        repository.findByNameIgnoreCase(name)
                .orElseGet(() -> {
                    Category category = new Category();
                    category.setName(name);
                    return repository.save(category);
                });

    }
}