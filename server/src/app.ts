import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { notFound } from "./middlewares/notFound.middleware";
import ENV_CONFIG from "./config/env.config";

const app = express();

// Parses the JWT session cookie on every request.
app.use(cookieParser());

// Only allow requests from the configured frontend origin(s), with credentials
// (cookies) enabled so the httpOnly auth cookie is sent/received correctly.
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ENV_CONFIG.allowOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Northloom API is running" });
});

app.use("/api/v1", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
