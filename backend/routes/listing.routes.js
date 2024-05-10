import { Router } from "express";
import {
  createListing,
  deleteListing,
  getListingById,
  myListing,
  updateListing,
} from "../controllers/listing.controller.js";

import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/listing").post(verifyJwt, createListing);
router.route("/listing").get(verifyJwt, myListing);
router.route("/listing/:listingId").delete(verifyJwt, deleteListing);
router.route("/listing/:listingId").get(getListingById);
router.route("/listing/:listingId").patch(verifyJwt, updateListing);

export default router;
