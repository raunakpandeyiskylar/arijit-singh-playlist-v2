import { Router } from "express";
import authController from "../controllers/auth.controller";
import { authMiddleware } from "../../shared/infrastructure/middleware/auth.middleware";

const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/signup", authController.signup);
authRouter.post("/logout", authMiddleware, authController.logout);

export default authRouter;
