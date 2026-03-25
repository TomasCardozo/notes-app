function getArchived(note) {
  return note.archived ?? note.isArchived ?? note.is_archived ?? false;
}

export default function NoteItem({
  note,
  onEdit,
  deleting,
  onDelete,
  onArchiveToggle,
}) {
  const archived = getArchived(note);

  return (
    <article
      className={`note-card flex h-full flex-col p-5 transition-all duration-300 ${
        deleting ? "opacity-40 scale-[0.97]" : "note-card-hover"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-xl font-semibold text-white-soft">
            {note.title}
          </h3>

          <div className="mt-4 flex flex-wrap gap-2">
            {(note.categories ?? []).length > 0 ? (
              (note.categories ?? []).map((name) => (
                <span key={name} className="badge-ui">
                  {name}
                </span>
              ))
            ) : (
              <span className="text-xs text-brand-4">
                No categories assigned
              </span>
            )}
          </div>
        </div>

        <span className={archived ? "badge-soft" : "badge-brand"}>
          {archived ? "Archived" : "Active"}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-surface-soft line-clamp-4">
        {note.content}
      </p>

      <div className="mt-auto border-t border-white-soft/8 pt-4">
        <div className="grid grid-cols-3 gap-2">
          <button
            className="btn-secondary-sm w-full justify-center"
            onClick={() => onEdit(note)}
          >
            Edit
          </button>

          <button
            className="btn-danger-sm w-full justify-center"
            onClick={() => onDelete(note)}
          >
            Delete
          </button>

          <button
            className="btn-ghost-sm w-full justify-center"
            onClick={() => onArchiveToggle(note.id, archived)}
          >
            {archived ? "Unarchive" : "Archive"}
          </button>
        </div>
      </div>
    </article>
  );
}
