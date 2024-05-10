import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const updateProfile = asyncHandler(async (req, res) => {
  const payload = req.body;
  const userId = req.params.userId;

  const findUser = await User.findOne({ _id: userId });
  if (!findUser) {
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        firstName: payload?.firstName,
        lastName: payload?.lastName,
        email: payload?.email,
        password: payload?.password,
        avatar: payload?.avatar,
        username: payload?.username,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "user details updated successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  console.log(userId, req.user._id);

  if (req.user._id != userId) {
    return res.status(401).json(new ApiResponse(401, {}, "unautherized user"));
  }

  const findUser = await User.findOne({ _id: userId });
  if (!findUser) {
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  await User.deleteOne({ _id: userId });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User deleted successfully"));
});

const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "user got successfully"));
});

export { updateProfile, deleteUser, getUserById };
