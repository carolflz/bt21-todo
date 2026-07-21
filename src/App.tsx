import { useProjectsStore } from "./stores/projectsStore";
import { AppShell } from "./components/layout/AppShell";
import { ProjectSidebar } from "./components/projects/ProjectSidebar";
import { NoteBoard } from "./components/notes/NoteBoard";
import { Mascot } from "./components/mascot/Mascot";

function App() {
  const activeProjectId = useProjectsStore((s) => s.activeProjectId);

  return (
    <>
      <AppShell sidebar={<ProjectSidebar />}>
        {activeProjectId ? (
          <NoteBoard projectId={activeProjectId} />
        ) : (
          <div style={{ padding: 24, color: "var(--color-text-muted)" }}>
            Create a project to get started.
          </div>
        )}
      </AppShell>
      <Mascot />
    </>
  );
}

export default App;
