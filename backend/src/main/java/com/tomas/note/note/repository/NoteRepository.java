package com.tomas.note.note.repository;

import com.tomas.note.note.domain.Note;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface NoteRepository extends JpaRepository<Note, Long>, JpaSpecificationExecutor<Note> {
    Page<Note> findAll(Specification<Note> spec, Pageable pageable);
}
