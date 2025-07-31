import styles from "./ButtonStyles.module.css";

export default function IconButton({ onClick, src, alt, width, height }) {
  return (
    <div>
      <button className={styles.iconBtn} onClick={() => onClick()}>
        <img
          style={{
            width: width,
            height: height,
          }}
          src={src}
          alt={alt ?? "icon button"}
        />
      </button>
    </div>
  );
}
