import { Router } from "express";
import {
  deleteUser,
  getUserById,
  updateProfile,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/profile/:userId").patch(verifyJwt, updateProfile);
router.route("/profile/:userId").delete(verifyJwt, deleteUser);
router.route("/profile/:userId").get(verifyJwt, getUserById);

export default router;
