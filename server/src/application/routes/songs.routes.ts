import { Router } from "express";
import { authMiddleware } from "../../shared/infrastructure/middleware/auth.middleware";
import songController from "../controllers/song.controller";
import { singleMediaMiddleware } from "../../shared/infrastructure/middleware/media.middleware";
import upload from "../../config/multer.config";

const songRoutes = Router();

songRoutes.post("/create", authMiddleware, upload("songs").fields([
    { name: "coverImage", maxCount: 1 },
    { name: "song", maxCount: 1 }
]), songController.createSong);

songRoutes.post("/list", authMiddleware, songController.getSong);

export default songRoutes;
