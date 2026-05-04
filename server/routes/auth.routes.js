import express from "express";
import { signup, login, logOut } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signup)
authRouter.post("/signin", login)
authRouter.get("/logout", logOut)

export default authRouter;