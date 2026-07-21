import styles from "./NoteToolbar.module.css";

interface NoteToolbarProps {
  pinned: boolean;
  onPinToggle: () => void;
  onColorClick: () => void;
  onDelete: () => void;
}

export function NoteToolbar({ pinned, onPinToggle, onColorClick, onDelete }: NoteToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <button
        type="button"
        className={styles.iconBtn}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={onPinToggle}
        title={pinned ? "Unpin" : "Pin"}
      >
        {pinned ? "📌" : "📍"}
      </button>
      <button
        type="button"
        className={styles.iconBtn}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={onColorClick}
        title="Color"
      >
        🎨
      </button>
      <button
        type="button"
        className={styles.iconBtn}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={onDelete}
        title="Delete"
      >
        ✕
      </button>
    </div>
  );
}
