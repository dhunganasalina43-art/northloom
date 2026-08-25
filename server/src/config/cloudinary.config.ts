import { v2 as cloudinary } from "cloudinary";
import ENV_CONFIG from "./env.config";

cloudinary.config({
  cloud_name: ENV_CONFIG.cloudinary.cloudName,
  api_key: ENV_CONFIG.cloudinary.apiKey,
  api_secret: ENV_CONFIG.cloudinary.apiSecret,
});

export default cloudinary;
