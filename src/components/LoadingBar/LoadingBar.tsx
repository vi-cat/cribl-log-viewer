import styles from "./LoadingBar.module.css";

type LoadingBarProps = {
  loading: boolean;
};

export function LoadingBar({ loading }: LoadingBarProps) {
  return (
    <div className={`${styles.bar}${loading ? ` ${styles.active}` : ""}`} />
  );
}
