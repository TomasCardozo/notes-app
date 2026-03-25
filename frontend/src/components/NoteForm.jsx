import { useEffect, useState } from "react";

export default function NoteForm({
  value,
  categories = [],
  onSubmit,
  onCancel,
}) {
  const isEditing = !!value?.id;

  function getCategoryIds(noteCategories = [], allCategories = []) {
    return noteCategories
      .map((category) => {
        if (typeof category === "object" && category !== null) {
          return category.id;
        }

        if (typeof category === "number") {
          return category;
        }

        if (typeof category === "string") {
          const match = allCategories.find((item) => item.name === category);
          return match?.id;
        }

        return undefined;
      })
      .filter(Boolean);
  }

  const [form, setForm] = useState({
    title: value?.title ?? "",
    content: value?.content ?? "",
    categoryIds: getCategoryIds(value?.categories ?? [], categories),
  });

  useEffect(() => {
    setForm({
      title: value?.title ?? "",
      content: value?.content ?? "",
      categoryIds: getCategoryIds(value?.categories ?? [], categories),
    });
  }, [value, categories]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleToggleCategory(categoryId) {
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const note = {
      title: form.title.trim(),
      content: form.content.trim(),
      categoryIds: form.categoryIds,
    };

    if (!note.title || !note.content) return;

    onSubmit(note);

    if (!isEditing) {
      setForm({
        title: "",
        content: "",
        categoryIds: [],
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_320px] md:items-start py-1">
        <div>
          <label className="label-ui">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Write a short title..."
            className="input-ui"
          />
        </div>

        <div>
          <label className="label-ui">Categories</label>

          <div className="input-ui flex min-h-[48px] flex-wrap items-center gap-2 overflow-hidden px-3">
            {categories.length > 0 ? (
              categories.map((category) => {
                const checked = form.categoryIds.includes(category.id);

                return (
                  <label
                    key={category.id}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-1 text-xs transition ${
                      checked
                        ? "border-brand bg-brand/80 text-white-soft"
                        : "border-white-soft/10 bg-white-soft/5 text-surface-soft hover:bg-white-soft/10"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleCategory(category.id)}
                      className="hidden"
                    />

                    <span
                      className={`h-2 w-2 rounded-full ${
                        checked ? "bg-white-soft" : "bg-brand-3"
                      }`}
                    />

                    {category.name}
                  </label>
                );
              })
            ) : (
              <span className="text-sm text-brand-4">No categories yet.</span>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="label-ui mb-0">Content</label>
          <span className="text-xs text-brand-4">
            {form.content.length} characters
          </span>
        </div>

        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          rows={6}
          placeholder="Write your note here..."
          className="textarea-ui mt-2 resize-none"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" className="btn-primary-sm">
          {isEditing ? "Save Changes" : "Create Note"}
        </button>

        {isEditing && (
          <button type="button" onClick={onCancel} className="btn-secondary-sm">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
