package com.tomas.note.note.service;

public class NoteNotFoundException extends RuntimeException {
    public NoteNotFoundException(Long id) {
        super("Could not find note with id: " + id);
    }
}
