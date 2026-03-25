package com.tomas.note.category.domain;

import com.tomas.note.note.domain.Note;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "category", uniqueConstraints = {
        @UniqueConstraint(name = "uk_categories_name", columnNames = "name" )
})
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 60)
    @Column(nullable = false, unique = true, length = 60)
    private String name;

    @ManyToMany(mappedBy = "categories")
    private Set<Note> notes = new HashSet<>();

    public Set<Note> getNotes() {
        return notes;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
