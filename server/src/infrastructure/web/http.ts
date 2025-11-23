import express from "express";
import apiResponse from "../../shared/infrastructure/middleware/api_response.js";

const app = express();

app.use(express.json());
app.use(apiResponse);

app.get("/", (req, res) => {
  return res.success({
    status: true,
    message: "Welcome to the server",
    data: null,
  });
});

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
