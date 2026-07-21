import { useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Note, UpdateNoteInput } from "../../api/types";
import { useResizable } from "../../hooks/useResizable";
import { NoteToolbar } from "./NoteToolbar";
import { ColorPicker } from "./ColorPicker";
import styles from "./StickyNote.module.css";

interface StickyNoteProps {
  note: Note;
  onUpdate: (input: UpdateNoteInput) => void;
  onDelete: () => void;
}

export function StickyNote({ note, onUpdate, onDelete }: StickyNoteProps) {
  const x = useMotionValue(note.posX);
  const y = useMotionValue(note.posY);
  const elementRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const [isColorPickerOpen, setColorPickerOpen] = useState(false);

  function buildInput(overrides: Partial<UpdateNoteInput>): UpdateNoteInput {
    return {
      title,
      body,
      color: note.color,
      posX: x.get(),
      posY: y.get(),
      width: note.width,
      height: note.height,
      pinned: note.pinned,
      ...overrides,
    };
  }

  const { startResize } = useResizable(
    { width: note.width, height: note.height },
    { onResizeEnd: (size) => onUpdate(buildInput({ width: size.width, height: size.height })) }
  );

  function handleColorSelect(color: string) {
    setColorPickerOpen(false);
    onUpdate(buildInput({ color }));
  }

  return (
    <motion.div
      ref={elementRef}
      className={styles.note}
      style={{ x, y, backgroundColor: note.color, width: note.width, height: note.height }}
      drag={!note.pinned}
      dragMomentum={false}
      dragElastic={0.05}
      onDragEnd={() => onUpdate(buildInput({}))}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <NoteToolbar
        pinned={note.pinned}
        onPinToggle={() => onUpdate(buildInput({ pinned: !note.pinned }))}
        onColorClick={() => setColorPickerOpen((v) => !v)}
        onDelete={onDelete}
      />
      {isColorPickerOpen && <ColorPicker selected={note.color} onSelect={handleColorSelect} />}
      <input
        className={styles.titleInput}
        value={title}
        placeholder="Title..."
        onPointerDown={(e) => e.stopPropagation()}
        onChange={(e) => setTitle(e.currentTarget.value)}
        onBlur={() => onUpdate(buildInput({}))}
      />
      <textarea
        className={styles.bodyInput}
        value={body}
        placeholder="Write something..."
        onPointerDown={(e) => e.stopPropagation()}
        onChange={(e) => setBody(e.currentTarget.value)}
        onBlur={() => onUpdate(buildInput({}))}
      />
      <div
        className={styles.resizeHandle}
        onPointerDown={(e) => elementRef.current && startResize(e, elementRef.current)}
      />
    </motion.div>
  );
}
