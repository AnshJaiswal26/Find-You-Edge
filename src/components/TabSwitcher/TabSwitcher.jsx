import styles from "./TabSwitcher.module.css";

export default function TabContainer({ tabs, currentTab, onClick }) {
  return (
    <>
      <div className={styles.tab}>
        {tabs.map(({ key, label }) => (
          <div
            key={key}
            className={`${styles.element} ${
              currentTab === key ? styles.selected : ""
            }`}
            onClick={() => onClick(key)}
          >
            {label}
          </div>
        ))}
      </div>
    </>
  );
}
