import express from "express";
import apiResponse from "../../shared/infrastructure/middleware/api_response.js";
import authRouter from "../../application/routes/auth.routes.js";
import userRoutes from "../../application/routes/user.routes.js";
import songRoutes from "../../application/routes/songs.routes.js";
import path from "node:path";
import { authMiddleware } from "../../shared/infrastructure/middleware/auth.middleware.js";
import YoutubeConvertor from "../../lib/youtube.convertor.js";

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(apiResponse);
app.use("/api/v1/uploads", authMiddleware, express.static(path.join(process.cwd(), "uploads")));

app.post("/api/v1/convert", async (req, res) => {
  try {
    return res.success(await YoutubeConvertor.convertToAudio(req.body));
  } catch (error: any) {
    return res.error({
      status: false,
      message: error.message || "Something went wrong",
      data: null,
    })
  }
})

app.get("/", (req, res) => {
  return res.success({
    status: true,
    message: "Welcome to the world of harmony",
    data: null,
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/song", songRoutes);

app.use((req, res, next) => {
  res.error({
    status: false,
    message: "Looks Like you are lost! The requested endpoint does not exist.",
    data: {
      type: "single",
      item: {
        requestedUrl: req.originalUrl,
        baseUrl: req.baseUrl,
      },
    },
  });
});

export default app;
