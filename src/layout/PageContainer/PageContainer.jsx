import styles from "./PageContainer.module.css";
import { Editor, Sidebar } from "@components";

export default function PageContainer({
  children,
  className = "",
  editor = true,
  sidebar = true,
  pageActive,
}) {
  return (
    <div>
      {editor && <Editor />}
      {sidebar && <Sidebar pageActive={pageActive} />}
      <div className={`${styles.pageContainer} ${className}`}>
        <div className={styles.mainContent}>{children}</div>
      </div>
    </div>
  );
}
