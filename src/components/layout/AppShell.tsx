import { PropsWithChildren, ReactNode } from "react";
import styles from "./AppShell.module.css";

interface AppShellProps {
  sidebar: ReactNode;
}

export function AppShell({ sidebar, children }: PropsWithChildren<AppShellProps>) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>{sidebar}</aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
