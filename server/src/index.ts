import app from "./app";
import config from "./config/index";
import connectDatabase from "./config/database";
import logger from "./config/logger";

const start = async () => {
  try {
    await connectDatabase(config.mongodbUri);
  } catch (error) {
    logger.warn("MongoDB not available, starting without database", { error });
  }

  app.listen(config.port, () => {
    logger.info(`LexPay server running on port ${config.port} in ${config.nodeEnv} mode`);
  });
};

start();
