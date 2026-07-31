import styles from "./TopBar.module.css";

export default function TopBar() {
  return (
    <header className={styles.topBar}>
      <div className={styles.brand}>
        <span className={styles.logo}>🚀</span>
        <span className={styles.title}>Konda OS</span>
      </div>

      <div className={styles.actions}>
        <span className={styles.version}>v0.1.0</span>
      </div>
    </header>
  );
}