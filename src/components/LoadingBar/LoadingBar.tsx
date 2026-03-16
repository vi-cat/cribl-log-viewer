import styles from "./LoadingBar.module.css";

type LoadingBarProps = {
  loading: boolean;
};

export const LoadingBar = ({ loading }: LoadingBarProps) => {
  return (
    <div className={`${styles.bar}${loading ? ` ${styles.active}` : ""}`} />
  );
};
