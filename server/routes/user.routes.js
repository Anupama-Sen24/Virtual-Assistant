import express from "express";
import { askToAssistant, getCurrentUser, updateAssistant } from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.js"
import upload from "../middlewares/multer.js"

const userRouter = express.Router();

userRouter.get("/current", (req, res, next) => {
    if (!req.cookies || !req.cookies.token) return res.status(200).json(null);
    next();
}, isAuth, getCurrentUser);
userRouter.post("/update", isAuth, upload.single("assistantImage"), updateAssistant);
userRouter.post("/ask", isAuth, askToAssistant);

export default userRouter;