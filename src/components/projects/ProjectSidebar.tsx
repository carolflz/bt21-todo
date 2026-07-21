import { useEffect, useState } from "react";
import { useProjectsStore } from "../../stores/projectsStore";
import { Project } from "../../api/types";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { ProjectForm } from "./ProjectForm";
import { ProjectListItem } from "./ProjectListItem";
import { ArchiveConfirmDialog } from "./ArchiveConfirmDialog";
import bt21Train from "../../assets/decorations/bt21-train.gif";
import rjPeek from "../../assets/decorations/rj-peek.webp";
import styles from "./ProjectSidebar.module.css";

const PROJECT_COLORS = ["#7C6FEF", "#FF9EC7", "#6FCF97", "#56CCF2", "#F2C94C"];

export function ProjectSidebar() {
  const {
    projects,
    activeProjectId,
    fetchProjects,
    createProject,
    renameProject,
    archiveProject,
    unarchiveProject,
    deleteProject,
    setActiveProject,
  } = useProjectsStore();

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<Project | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (!activeProjectId && projects.length > 0) {
      const firstActive = projects.find((p) => p.status === "active");
      if (firstActive) setActiveProject(firstActive.id);
    }
  }, [projects, activeProjectId, setActiveProject]);

  const activeProjects = projects.filter((p) => p.status === "active");
  const archivedProjects = projects.filter((p) => p.status === "archived");

  async function handleCreate(name: string) {
    const colorTag = PROJECT_COLORS[projects.length % PROJECT_COLORS.length];
    const project = await createProject(name, colorTag);
    setActiveProject(project.id);
    setCreateOpen(false);
  }

  async function confirmArchiveToggle() {
    if (!archiveTarget) return;
    if (archiveTarget.status === "active") {
      await archiveProject(archiveTarget.id);
    } else {
      await unarchiveProject(archiveTarget.id);
    }
    setArchiveTarget(null);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await deleteProject(deleteTarget.id);
    setDeleteTarget(null);
  }

  function renderItem(project: Project) {
    return (
      <ProjectListItem
        key={project.id}
        project={project}
        isActive={project.id === activeProjectId}
        onSelect={() => setActiveProject(project.id)}
        onRename={() => setRenameTarget(project)}
        onArchiveToggle={() => setArchiveTarget(project)}
        onDelete={() => setDeleteTarget(project)}
      />
    );
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h1 className={styles.title}>Projects</h1>
        <div className={styles.newProjectRow}>
          <img src={rjPeek} alt="" className={styles.rjPeek} />
          <Button
            variant="primary"
            className={styles.newProjectBtn}
            onClick={() => setCreateOpen(true)}
          >
            + New Project
          </Button>
        </div>
      </div>

      <div className={styles.list}>{activeProjects.map(renderItem)}</div>

      {archivedProjects.length > 0 && (
        <div className={styles.archivedSection}>
          <button className={styles.archivedToggle} onClick={() => setShowArchived((v) => !v)}>
            {showArchived ? "Hide" : "Show"} archived ({archivedProjects.length})
          </button>
          {showArchived && <div className={styles.list}>{archivedProjects.map(renderItem)}</div>}
        </div>
      )}

      <div className={styles.decoration}>
        <img src={bt21Train} alt="" />
      </div>

      <Modal isOpen={isCreateOpen} onClose={() => setCreateOpen(false)} title="New Project">
        <ProjectForm
          submitLabel="Create"
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>

      <Modal isOpen={!!renameTarget} onClose={() => setRenameTarget(null)} title="Rename Project">
        {renameTarget && (
          <ProjectForm
            initialName={renameTarget.name}
            submitLabel="Save"
            onSubmit={async (name) => {
              await renameProject(renameTarget.id, name);
              setRenameTarget(null);
            }}
            onCancel={() => setRenameTarget(null)}
          />
        )}
      </Modal>

      <ArchiveConfirmDialog
        project={archiveTarget}
        onConfirm={confirmArchiveToggle}
        onCancel={() => setArchiveTarget(null)}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete project?"
        message={`"${deleteTarget?.name}" and all of its notes and meetings will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
