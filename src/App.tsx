import { ErrorCallout } from "./components/ErrorCallout/ErrorCallout";
import { LoadingBar } from "./components/LoadingBar/LoadingBar";
import { LogsTable } from "./components/LogsTable/LogsTable";
import { useStreamingLogs } from "./hooks/useStreamingLogs";

function App() {
  const { logs, loading, error } = useStreamingLogs(
    "https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log",
  );

  return (
    <main>
      <h1
        style={{
          padding: "1rem",
        }}
      >
        Logs Viewer
      </h1>
      <ErrorCallout error={error} />
      <LoadingBar loading={loading} />
      <LogsTable logs={logs} />
    </main>
  );
}

export default App;
