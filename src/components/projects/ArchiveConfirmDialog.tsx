import { ConfirmDialog } from "../common/ConfirmDialog";
import { Project } from "../../api/types";

interface ArchiveConfirmDialogProps {
  project: Project | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ArchiveConfirmDialog({ project, onConfirm, onCancel }: ArchiveConfirmDialogProps) {
  if (!project) return null;
  const isArchiving = project.status === "active";
  return (
    <ConfirmDialog
      isOpen={!!project}
      title={isArchiving ? "Archive project?" : "Restore project?"}
      message={
        isArchiving
          ? `"${project.name}" will be moved to your archive. You can restore it anytime.`
          : `"${project.name}" will be restored to your active projects.`
      }
      confirmLabel={isArchiving ? "Archive" : "Restore"}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
