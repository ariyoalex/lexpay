import app from "./app";
import connectDatabase from "./config/database";
import config from "./config/index";
import logger from "./config/logger";
import { initSocket } from "./socket";
import http from "http";

const start = async () => {
  try {
    await connectDatabase(config.mongodbUri);
  } catch (error) {
    logger.warn("MongoDB not available, starting without database", { error });
  }

  const server = http.createServer(app);
  initSocket(server);

  server.listen(config.port, () => {
    logger.info(`LexPay server running on port ${config.port} in ${config.nodeEnv} mode`);
  });
};

start();
