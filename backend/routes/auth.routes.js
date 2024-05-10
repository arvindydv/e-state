import { Router } from "express";
import { register, signIn, signUpWithGoogle } from "../controllers/auth.controller.js";
const router = Router();

router.route("/register").post(register);
router.route("/register-with-google").post(signUpWithGoogle);
router.route("/sign-in").post(signIn);

export default router;
