package com.tomas.note.category.service;

import com.tomas.note.category.domain.Category;
import com.tomas.note.category.dto.CategoryRequest;
import com.tomas.note.category.repository.CategoryRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category create(CategoryRequest categoryRequest) {
        categoryRepository.findByNameIgnoreCase(categoryRequest.getName()).ifPresent(category -> {
            throw new IllegalArgumentException("Category with name " + categoryRequest.getName() + " already exists");
        });

        Category category = new Category();
        category.setName(categoryRequest.getName().trim());
        return categoryRepository.save(category);
    }

    @Transactional(readOnly = true)
    public List<Category> list() {
        return categoryRepository.findAll();
    }

    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new CategoryNotFoundException(id);
        }
        categoryRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Category get(Long id) {
        return categoryRepository.findById(id).orElseThrow(() -> new CategoryNotFoundException(id));
    }
}
