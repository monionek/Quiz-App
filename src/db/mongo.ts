import mongoose from "mongoose";
import { envConfig } from "../config/config";

export const connectMongo = async () => {
mongoose.connect(envConfig.mongoUrl).then(() => {
  console.log('MongoDB connected');
});
};
