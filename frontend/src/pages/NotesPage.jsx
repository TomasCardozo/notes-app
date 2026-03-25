import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/authApi";
import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";
import { listCategories } from "../api/categoryApi";
import {
  createNote,
  updateNote,
  deleteNote,
  archivedNote,
  unarchivedNote,
  listNotes,
  addCategoryToNote,
  removeCategoryFromNote,
} from "../api/noteApi";

export default function NotesPage() {
  const [tab, setTab] = useState("active");
  const archived = tab === "archived";

  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const formRef = useRef(null);

  const [deletingId, setDeletingId] = useState(null);

  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const categoriesRes = await listCategories();
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    })();
  }, []);

  useEffect(() => {
    setEditingNote(null);
    load();
  }, [tab]);

  useEffect(() => {
    load();
  }, [selectedCategoryIds]);

  async function load() {
    try {
      setLoading(true);
      setError("");
      const res = await listNotes({
        archived,
        categoryIds: selectedCategoryIds,
        page: 0,
        size: 50,
      });
      setNotes(res.data?.content ?? []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setError(
        error?.response?.data?.message ??
          error?.message ??
          "Failed to fetch notes. Please try again later.",
      );
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(note) {
    try {
      await createNote(note);
      await load();
    } catch (error) {
      console.error(error);
      setError(
        error?.message ?? "Failed to create note. Please try again later.",
      );
    }
  }

  async function handleUpdate(note) {
    try {
      await updateNote(editingNote.id, note);
      setEditingNote(null);
      await load();
    } catch (error) {
      console.error(error);
      setError(
        error?.message ?? "Failed to update note. Please try again later.",
      );
    }
  }

  function handleDeleteRequest(note) {
    setNoteToDelete(note);
  }

  async function handleConfirmDelete() {
    if (!noteToDelete) return;

    try {
      setIsDeleting(true);
      await deleteNote(noteToDelete.id);
      await load();
      setNoteToDelete(null);
    } catch (error) {
      console.error(error);
      setError(
        error?.message ?? "Failed to delete note. Please try again later.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleCancelDelete() {
    if (isDeleting) return;
    setNoteToDelete(null);
  }

  async function handleArchiveToggle(id, isArchived) {
    try {
      if (isArchived) {
        await unarchivedNote(id);
      } else {
        await archivedNote(id);
      }
      await load();
    } catch (error) {
      console.error(error);
      setError(
        error?.message ??
          "Failed to archive/unarchive note. Please try again later.",
      );
    }
  }

  async function handleCategoryToggle(noteId, categoryId, isAdded) {
    try {
      if (isAdded) {
        await addCategoryToNote(noteId, categoryId);
      } else {
        await removeCategoryFromNote(noteId, categoryId);
      }
      await load();
    } catch (error) {
      console.error(error);
      setError(
        error?.message ??
          "Failed to update note categories. Please try again later.",
      );
    }
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-shell">
      <div className="app-container page-section">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="section-title">Notes</h1>
            <p className="section-subtitle">
              Create, organize, filter, and manage your notes.
            </p>
          </div>

          <button onClick={handleLogout} className="btn-secondary-sm">
            Logout
          </button>
        </div>

        <div className="space-y-4">
          <div ref={formRef} className="card-ui p-5 sm:p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white-soft">
                {editingNote ? "Edit note" : "Create note"}
              </h2>
              <p className="helper-ui">
                {editingNote
                  ? "Update your note details below."
                  : "Write a new note and save it instantly."}
              </p>
            </div>

            <NoteForm
              key={editingNote?.id ?? "new"}
              value={editingNote}
              categories={categories}
              onSubmit={editingNote ? handleUpdate : handleCreate}
              onCancel={() => setEditingNote(null)}
            />
          </div>

          <div className="card-ui-soft px-4 py-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="w-full lg:w-auto">
                <div className="tabs-ui w-full lg:w-[340px]">
                  <button
                    className={`w-full ${tab === "active" ? "tab-ui-active" : "tab-ui"}`}
                    onClick={() => setTab("active")}
                  >
                    Active Notes
                  </button>
                  <button
                    className={`w-full ${tab === "archived" ? "tab-ui-active" : "tab-ui"}`}
                    onClick={() => setTab("archived")}
                  >
                    Archived Notes
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wide text-brand-4">
                  Categories
                </span>

                {categories.length === 0 ? (
                  <span className="text-xs text-brand-4">No categories</span>
                ) : (
                  categories.map((category) => {
                    const checked =
                      Array.isArray(selectedCategoryIds) &&
                      selectedCategoryIds.includes(category.id);

                    return (
                      <label
                        key={category.id}
                        htmlFor={`cat-${category.id}`}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs transition ${
                          checked
                            ? "border-brand bg-brand text-white-soft"
                            : "border-brand-4/20 bg-white-soft/5 text-surface-soft hover:bg-white-soft/10"
                        }`}
                      >
                        <input
                          className="hidden"
                          type="checkbox"
                          id={`cat-${category.id}`}
                          checked={checked}
                          onChange={(e) => {
                            setSelectedCategoryIds((prev) => {
                              const safePrev = Array.isArray(prev) ? prev : [];
                              return e.target.checked
                                ? [...safePrev, category.id]
                                : safePrev.filter((id) => id !== category.id);
                            });
                          }}
                        />
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            checked ? "bg-white-soft" : "bg-brand-3"
                          }`}
                        />
                        {category.name}
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {error && <div className="alert-error">{error}</div>}

          {loading && (
            <div className="panel-ui flex items-center gap-3 px-4 py-3">
              <span className="loader-ring" />
              <span className="text-sm text-surface-soft">
                Loading notes...
              </span>
            </div>
          )}
        </div>

        <div className="mt-6">
          <NoteList
            notes={notes}
            categories={categories}
            onEdit={(note) => {
              setEditingNote(note);
              formRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            deleting={deletingId === notes.id}
            onDelete={handleDeleteRequest}
            onArchiveToggle={handleArchiveToggle}
            onCategoryToggle={handleCategoryToggle}
          />
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-brand-4/10 pt-4">
          <p className="text-sm text-brand-4">
            Total Notes: <span className="text-white-soft">{notes.length}</span>
          </p>

          <span className="badge-ui">
            {archived ? "Archived view" : "Active view"}
          </span>
        </div>
      </div>

      {noteToDelete && (
        <div className="modal-overlay flex items-center justify-center p-4">
          <div className="modal-ui w-full max-w-md p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white-soft">
                  Delete note
                </h3>
                <p className="mt-2 text-sm text-brand-4">
                  Are you sure you want to delete{" "}
                  <span className="font-medium text-white-soft">
                    {noteToDelete.title}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="btn-secondary-sm"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="btn-danger-sm"
              >
                {isDeleting ? "Deleting..." : "Delete note"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
