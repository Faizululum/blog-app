import mongoose from "mongoose";

const connectToDatabase = async () => {
  mongoose
    .connect(process.env.MONGODB_URI!)
    .then(() => console.log("Connected to database"))
    .catch((err) => console.log(err));
};

export default connectToDatabase;
