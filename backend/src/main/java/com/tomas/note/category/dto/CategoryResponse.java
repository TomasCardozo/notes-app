package com.tomas.note.category.dto;

import com.tomas.note.category.domain.Category;

public class CategoryResponse {

    private Long id;
    private String name;

    public static CategoryResponse from(Category category) {
        CategoryResponse categoryResponse = new CategoryResponse();
        categoryResponse.id = category.getId();
        categoryResponse.name = category.getName();
        return categoryResponse;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
