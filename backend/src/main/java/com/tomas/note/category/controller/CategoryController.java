package com.tomas.note.category.controller;

import com.tomas.note.category.dto.CategoryResponse;
import com.tomas.note.category.dto.CategoryRequest;
import com.tomas.note.category.service.CategoryService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.List;
import java.net.URI;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> create(@Valid @RequestBody CategoryRequest categoryRequest) {
        var createdCategory = categoryService.create(categoryRequest);
        return ResponseEntity.created(URI.create("/api/categories/" + createdCategory.getId()))
                .body(CategoryResponse.from(createdCategory));
    }

    @GetMapping
    public List<CategoryResponse> list() {
        return categoryService.list().stream().map(CategoryResponse::from).toList();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
