import { FormEvent, useState } from "react";
import { Button } from "../common/Button";
import styles from "./ProjectForm.module.css";

interface ProjectFormProps {
  initialName?: string;
  submitLabel: string;
  onSubmit: (name: string) => void;
  onCancel?: () => void;
}

export function ProjectForm({
  initialName = "",
  submitLabel,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [name, setName] = useState(initialName);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        autoFocus
        className={styles.input}
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        placeholder="Project name..."
      />
      <div className={styles.actions}>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
