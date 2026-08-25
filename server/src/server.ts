import app from "./app";
import connectDatabase from "./config/db.config";
import ENV_CONFIG from "./config/env.config";

const start = async () => {
  await connectDatabase();
  app.listen(ENV_CONFIG.port, () => {
    console.log(`[server] Northloom API listening on http://localhost:${ENV_CONFIG.port}`);
  });
};

start();
