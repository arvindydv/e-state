import { Listing } from "../models/listing.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createListing = asyncHandler(async (req, res) => {
  const payload = req.body;
  payload.userId = req.user._id;

  const listing = await Listing.create(payload);

  return res
    .status(201)
    .json(new ApiResponse(201, listing, "listing created successfully"));
});

// get my Listing
const myListing = asyncHandler(async (req, res) => {
  const listing = await Listing.find({ userId: req.user._id });
  return res
    .status(200)
    .json(new ApiResponse(200, listing, "all listing got successfully"));
});

// delete listing

const deleteListing = asyncHandler(async (req, res) => {
  const listingId = req.params.listingId;

  const findListing = await Listing.findOne({ _id: listingId });
  if (!findListing) {
    return res.status(404).json(new ApiResponse(404, {}, "Listing not found"));
  }

  // // Check if the logged-in user is authorized to delete the listing
  // if (findListing.userId != req.user._id) {
  //   return res.status(401).json(new ApiResponse(401, {}, "Unauthorized user"));
  // }

  await Listing.deleteOne({ _id: listingId });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "listing deleted successfully"));
});

const getListingById = asyncHandler(async (req, res) => {
  const listingId = req.params.listingId;

  const listing = await Listing.findOne({ _id: listingId });
  if (!listing) {
    return res.status(404).json(new ApiResponse(404, {}, "listing not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, listing, "listing got successfully"));
});

const updateListing = asyncHandler(async (req, res) => {
  const listingId = req.params.listingId;

  const findListing = await Listing.findOne({ _id: listingId });
  if (!findListing) {
    return res.status(404).json(new ApiResponse(404, {}, "listing not found"));
  }

  if (listingId != findListing.userId) {
    return res.status(401).json(new ApiResponse(401, {}, "unauthorized user"));
  }

  const updatedListing = await Listing.findByIdAndUpdate(listingId, payload, {
    new: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedListing, "listing updated successfully"));
});

export {
  createListing,
  myListing,
  deleteListing,
  getListingById,
  updateListing,
};
