package com.tomas.note.note.controller;

import com.tomas.note.note.dto.NoteRequest;
import com.tomas.note.note.dto.NoteResponse;
import com.tomas.note.note.dto.NoteCategoriesRequest;
import com.tomas.note.note.service.NoteService;

import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @PostMapping
    public ResponseEntity<NoteResponse> createNote(@Valid @RequestBody NoteRequest noteRequest) {
        var create = noteService.create(noteRequest);
        return ResponseEntity.created(URI.create("/api/notes/" + create.getId()))
                .body(NoteResponse.from(create));
    }

    @PostMapping("/{id}/categories/{categoryId}")
    public NoteResponse addCategory(@PathVariable Long id, @PathVariable Long categoryId) {
        return NoteResponse.from(noteService.addCategory(id, categoryId));
    }

    @PostMapping("/{id}/categories")
    public NoteResponse addCategories(@PathVariable Long id, @Valid @RequestBody NoteCategoriesRequest noteCategoriesRequest) {
        return NoteResponse.from(noteService.addCategories(id, noteCategoriesRequest.getCategoryIds()));
    }

    @GetMapping
    public Page<NoteResponse> list(
            @RequestParam(required = false) Boolean archived,
            @RequestParam(required = false) String categoryIds,
            @RequestParam(required = false) String match,
            Pageable pageable) {
        Set<Long> ids = null;
        if (categoryIds != null && !categoryIds.isBlank()) {
            ids = Arrays.stream(categoryIds.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .map(Long::valueOf)
                    .collect(Collectors.toSet());
        }
        return noteService.list(archived, ids, match, pageable).map(NoteResponse::from);
    }

    @GetMapping("/{id}")
    public NoteResponse get(@PathVariable Long id) {
        return NoteResponse.from(noteService.get(id));
    }

    @PutMapping("/{id}")
    public NoteResponse update(@PathVariable Long id, @Valid @RequestBody NoteRequest noteRequest) {
        return NoteResponse.from(noteService.update(id, noteRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        noteService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/categories/{categoryId}")
    public NoteResponse removeCategory(@PathVariable Long id, @PathVariable Long categoryId) {
        return NoteResponse.from(noteService.removeCategory(id, categoryId));
    }

    @PatchMapping("/{id}/archive")
    public NoteResponse archive(@PathVariable Long id) {
        return NoteResponse.from(noteService.archive(id));
    }

    @PatchMapping("/{id}/unarchive")
    public NoteResponse unarchive(@PathVariable Long id) {
        return NoteResponse.from(noteService.unArchive(id));
    }
}
