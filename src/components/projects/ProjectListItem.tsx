import { Project } from "../../api/types";
import btsLogo from "../../assets/decorations/bts-logo.png";
import styles from "./ProjectListItem.module.css";

interface ProjectListItemProps {
  project: Project;
  isActive: boolean;
  onSelect: () => void;
  onRename: () => void;
  onArchiveToggle: () => void;
  onDelete: () => void;
}

export function ProjectListItem({
  project,
  isActive,
  onSelect,
  onRename,
  onArchiveToggle,
  onDelete,
}: ProjectListItemProps) {
  return (
    <div className={[styles.item, isActive ? styles.active : ""].join(" ")} onClick={onSelect}>
      <img src={btsLogo} alt="" className={styles.bullet} />
      <span className={styles.name}>{project.name}</span>
      <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
        <button className={styles.iconBtn} onClick={onRename} title="Rename" aria-label="Rename">
          ✎
        </button>
        <button
          className={styles.iconBtn}
          onClick={onArchiveToggle}
          title={project.status === "active" ? "Archive" : "Unarchive"}
          aria-label="Archive"
        >
          {project.status === "active" ? "🗄" : "↩"}
        </button>
        <button className={styles.iconBtn} onClick={onDelete} title="Delete" aria-label="Delete">
          ✕
        </button>
      </div>
    </div>
  );
}
