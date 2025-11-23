
import express from "express";
import apiResponse from '../../shared/infrastructure/middleware/api_response.js';

const app = express();

app.use(express.json());
app.use(apiResponse);

app.get("/", (req, res) => {
    return res.success("Welcome to the server", null);
});

export default app;
