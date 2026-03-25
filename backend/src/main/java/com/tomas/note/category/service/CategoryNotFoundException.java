package com.tomas.note.category.service;

public class CategoryNotFoundException extends RuntimeException {
    public CategoryNotFoundException(Long id) {
        super("Could not find category with id " + id);
    }
}
