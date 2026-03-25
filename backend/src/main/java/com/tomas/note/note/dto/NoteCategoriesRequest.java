package com.tomas.note.note.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class NoteCategoriesRequest {

    @NotEmpty
    private List<Long> categoryIds;

    public List<Long> getCategoryIds() {
        return categoryIds;
    }

    public void setCategoryIds(List<Long> categoryIds) {
        this.categoryIds = categoryIds;
    }
}
