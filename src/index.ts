import "./loadEnvironment";
import startServer from "./server/startServer";

const port = process.env.PORT ?? 4000;

(async () => {
  try {
    await startServer(port as number);
  } catch {
    process.exit(1);
  }
})();
