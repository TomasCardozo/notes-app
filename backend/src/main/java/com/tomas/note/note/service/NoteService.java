package com.tomas.note.note.service;

import com.tomas.note.note.domain.Note;
import com.tomas.note.note.dto.NoteRequest;
import com.tomas.note.note.repository.NoteRepository;
import com.tomas.note.category.service.CategoryNotFoundException;
import com.tomas.note.category.repository.CategoryRepository;
import com.tomas.note.category.domain.Category;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.HashSet;
import java.util.Set;

import static com.tomas.note.note.repository.NoteSpecifications.*;

@Service
@Transactional
public class NoteService {
    private final NoteRepository noteRepository;
    private final CategoryRepository categoryRepository;

    public NoteService(NoteRepository noteRepository, CategoryRepository categoryRepository) {
        this.noteRepository = noteRepository;
        this.categoryRepository = categoryRepository;
    }

    public Note create(NoteRequest noteRequest) {
        Note note = new Note();
        note.setTitle(noteRequest.getTitle());
        note.setContent(noteRequest.getContent());
        note.setCategories(resolveCategories(noteRequest.getCategoryIds()));
        return noteRepository.save(note);
    }

    public Note update(Long id, NoteRequest noteRequest) {
        Note note = noteRepository.findById(id).orElseThrow(() -> new NoteNotFoundException(id));
        note.setTitle(noteRequest.getTitle());
        note.setContent(noteRequest.getContent());
        note.setCategories(resolveCategories(noteRequest.getCategoryIds()));
        return noteRepository.save(note);
    }

    private Set<Category> resolveCategories(List<Long> categoryIds) {
        if (categoryIds == null || categoryIds.isEmpty()) {
            return new HashSet<>();
        }

        List<Category> categories = categoryRepository.findAllById(categoryIds);

        if (categories.size() != categoryIds.size()) {
            throw new RuntimeException("One or more categories do not exist");
        }

        return new HashSet<>(categories);
    }

    public Note archive(Long id) {
        Note note = noteRepository.findById(id).orElseThrow(() -> new NoteNotFoundException(id));
        note.setArchived(true);
        return noteRepository.save(note);
    }

    public Note unArchive(Long id) {
        Note note = noteRepository.findById(id).orElseThrow(() -> new NoteNotFoundException(id));
        note.setArchived(false);
        return noteRepository.save(note);
    }

    public void delete(Long id) {
        if(!noteRepository.existsById(id)) {
            throw new NoteNotFoundException(id);
        }
        noteRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Page<Note> list(Boolean archived, Set<Long> categoryIds, String match, Pageable pageable) {
        Specification<Note> specification = Specification.where(archivedEquals(archived));

        if (categoryIds != null && !categoryIds.isEmpty()) {
            boolean all = "all".equalsIgnoreCase(match);
            specification = specification.and(all ? hasAllCategoryIds(categoryIds) : hasAnyCategoryIds(categoryIds));
        }
        return noteRepository.findAll(specification, pageable);
    }

    @Transactional(readOnly = true)
    public Note get(Long id) {
        return noteRepository.findById(id).orElseThrow(() -> new NoteNotFoundException(id));
    }

    public Note addCategory(Long noteId, Long categoryId)  {
        var note = noteRepository.findById(noteId).orElseThrow(() -> new NoteNotFoundException(noteId));
        var category = categoryRepository.findById(categoryId).orElseThrow(() -> new CategoryNotFoundException(categoryId));

        note.getCategories().add(category);
        return noteRepository.save(note);
    }

    public Note removeCategory(Long noteId, Long categoryId) {
        var note = noteRepository.findById(noteId).orElseThrow(() -> new NoteNotFoundException(noteId));
        var category = categoryRepository.findById(categoryId).orElseThrow(() -> new CategoryNotFoundException(categoryId));

        note.getCategories().remove(category);
        return noteRepository.save(note);
    }

    public Note addCategories(Long noteId, List<Long> categoryIds) {
        var note = noteRepository.findById(noteId).orElseThrow(() -> new NoteNotFoundException(noteId));

        List<Category> categories = categoryRepository.findAllById(categoryIds);
        if(categories.size() != new HashSet<>(categoryIds).size()){
            throw new IllegalArgumentException("One or more categories were not found");
        }

        note.getCategories().addAll(categories);
        return noteRepository.save(note);
    }
}
