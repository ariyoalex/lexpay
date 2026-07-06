import mongoose from "mongoose";
import logger from "./logger";

const connectDatabase = async (uri: string): Promise<void> => {
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
    logger.error("MongoDB connection failed", { error });
    process.exit(1);
  }
};

export default connectDatabase;
