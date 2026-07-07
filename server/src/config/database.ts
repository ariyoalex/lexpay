import mongoose from "mongoose";
import logger from "./logger";

const connectDatabase = async (uri: string): Promise<void> => {
  if (!uri) {
    logger.warn("No MONGODB_URI provided, skipping database connection");
    return;
  }

  try {
    await mongoose.connect(uri);
    logger.info("MongoDB connected successfully");

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error", { error: err.message });
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });
  } catch (error) {
    logger.warn("MongoDB not available, continuing without database", { error });
  }
};

export default connectDatabase;
