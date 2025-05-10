import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
      console.log("✅ Connected to MongoDB");
    } else {
      console.log("⚠️ Already connected to MongoDB");
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("Database connection failed");
  }
};

export default connectToDatabase;
