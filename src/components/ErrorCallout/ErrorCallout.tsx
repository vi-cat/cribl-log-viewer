import styles from "./ErrorCallout.module.css";

type ErrorCalloutProps = {
  error: Error | null;
};

export const ErrorCallout = ({ error }: ErrorCalloutProps) => {
  return (
    <div className={`${styles.callout}${error ? ` ${styles.active}` : ""}`}>
      {error && (
        <>
          <strong>Error:</strong> {error.message}
        </>
      )}
    </div>
  );
};
