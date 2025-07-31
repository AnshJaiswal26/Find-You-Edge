import styles from "./Container.module.css";

export default function Container({ children, className = "", title }) {
  return (
    <div className={`${styles.container} ${className}`}>
      {title && <div className={styles.title}>{title}</div>}
      {children}
    </div>
  );
}
