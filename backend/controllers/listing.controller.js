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

const getListings = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 9;
  const startIndex = parseInt(req.query.startIndex) || 0;

  let offer = req.query.offer;
  if (offer === undefined || offer === "false") {
    offer = { $in: [false, true] };
  }

  let furnished = req.query.furnished;
  if (furnished === undefined || furnished === "false") {
    furnished = { $in: [false, true] };
  }

  let parking = req.query.parking;
  if (parking === undefined || parking === "false") {
    parking = { $in: [false, true] };
  }

  let type = req.query.type;
  if (type === undefined || type === "all") {
    type = { $in: ["sale", "rent"] };
  }

  const searchTerm = req.query.searchTerm || "";
  const sort = req.query.sort || "createdAt";
  const order = req.query.order || "desc";

  const listing = await Listing.find({
    name: { $regex: searchTerm, $options: "i" },
    offer,
    furnished,
    parking,
    type,
  })
    .sort({ [sort]: order })
    .limit(limit)
    .skip(startIndex);

  return res
    .status(200)
    .json(new ApiResponse(200, listing, "get listing successfully"));
});

export {
  createListing,
  myListing,
  deleteListing,
  getListingById,
  updateListing,
  getListings
};
