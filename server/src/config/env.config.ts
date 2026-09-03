import "dotenv/config";

const ENV_CONFIG = {
  port: process.env.PORT || "5000",
  nodeEnv: process.env.NODE_ENV || "development",

  dbUri: process.env.DB_URI as string,

  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiry: process.env.JWT_EXPIRY || "7d",
  cookieExpiryDays: Number(process.env.COOKIE_EXPIRY || 7),

  allowOrigins: (process.env.ALLOW_ORIGINS || "http://localhost:3000").split(","),

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
    apiKey: process.env.CLOUDINARY_API_KEY as string,
    apiSecret: process.env.CLOUDINARY_API_SECRET as string,
  },

  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
};

export default ENV_CONFIG;
