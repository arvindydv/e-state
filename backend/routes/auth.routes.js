import { Router } from "express";
import {
  loginWithGoogle,
  logout,
  register,
  signIn,
  signUpWithGoogle,
} from "../controllers/auth.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(register);
router.route("/register-with-google").post(signUpWithGoogle);
router.route("/sign-in-with-google").post(loginWithGoogle);
router.route("/sign-in").post(signIn);
router.route("/sign-out").post(verifyJwt, logout);

export default router;
