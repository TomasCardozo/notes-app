import { api } from "./axios";

export const listNotes = ({ archived, categoryIds, page = 0, size = 10 }) => {
  const params = { page, size };

  if (typeof archived === "boolean") {
    params.archived = archived;
  }

  const hasCategories = Array.isArray(categoryIds) && categoryIds.length > 0;

  if (hasCategories) {
    params.categoryIds = categoryIds.join(",");
    params.match = "ANY";
  }

  return api.get("/notes", { params });
};

export const getNotes = (id) => api.get(`/notes/${id}`);

export const createNote = (note) => api.post("/notes", note);

export const updateNote = (id, note) => api.put(`/notes/${id}`, note);

export const deleteNote = (id) => api.delete(`/notes/${id}`);

export const archivedNote = (id) => api.patch(`/notes/${id}/archive`);

export const unarchivedNote = (id) => api.patch(`/notes/${id}/unarchive`);

export const addCategoryToNote = (noteId, categoryId) =>
  api.post(`/notes/${noteId}/categories/${categoryId}`);

export const removeCategoryFromNote = (noteId, categoryId) =>
  api.delete(`/notes/${noteId}/categories/${categoryId}`);
