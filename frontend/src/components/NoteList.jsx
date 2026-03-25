import NoteItem from "./NoteItem";

export default function NoteList({
  notes,
  categories,
  onEdit,
  onDelete,
  onArchiveToggle,
  onCategoryToggle,
}) {
  if (!notes.length) {
    return (
      <div className="empty-state">
        <h3 className="empty-state-title">No notes available</h3>
        <p className="empty-state-text">
          Create your first note or adjust the selected filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3 items-stretch">
      {notes.map((note) => (
        <div key={note.id}>
          <NoteItem
            note={note}
            categories={categories}
            onEdit={onEdit}
            onDelete={onDelete}
            onArchiveToggle={onArchiveToggle}
            onCategoryToggle={onCategoryToggle}
          />
        </div>
      ))}
    </div>
  );
}
