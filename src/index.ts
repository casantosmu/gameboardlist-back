import "./loadEnvironment";
import connectDB from "./database";
import startServer from "./server/startServer";

const port = process.env.PORT ?? 4000;
const mongoUrl = process.env.MONGODB;

(async () => {
  try {
    await connectDB(mongoUrl);
    await startServer(port as number);
  } catch {
    process.exit(1);
  }
})();
