import app from "./app";
import config from "./config/index";
import connectDatabase from "./config/database";
import logger from "./config/logger";

const start = async () => {
  try {
    await connectDatabase(config.mongodbUri);

    app.listen(config.port, () => {
      logger.info(`LexPay server running on port ${config.port} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    logger.error("Failed to start server", { error });
    process.exit(1);
  }
};

start();
