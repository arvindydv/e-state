import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import rpgenerator from "rpgenerator";

// generate tokens
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const register = asyncHandler(async (req, res) => {
  const payload = req.body;

  if (!payload.email || !payload.username || !payload.password) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, {}, "email, username and password cannot be empty")
      );
  }

  //   find user
  const checkUser = await User.findOne({
    $or: [{ username: payload.username }, { email: payload.email }],
  });
  if (checkUser) {
    return res
      .status(409)
      .json(
        new ApiResponse(409, {}, "email or username is already in registered")
      );
  }

  const user = await User.create(payload);
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const { accessToken } = await generateAccessAndRefereshTokens(
    createdUser._id
  );

  // set cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        201,
        { user: createdUser, accessToken },
        "Registered successfully"
      )
    );
});

// sign in controller
const signIn = asyncHandler(async (req, res) => {
  const payload = req.body;
  if (!payload.email || !payload.password) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, {}, "email/username and password cannot be empty")
      );
  }

  const user = await User.findOne({
    $or: [{ username: payload.username }, { email: payload.email }],
  });

  if (!user) {
    return res.status(404).json(new ApiResponse(404, {}, "user not found"));
  }

  //  check password
  const isPasswordValid = await user.isPasswordCorrect(payload.password);
  if (!isPasswordValid) {
    return res.status(400).json(new ApiResponse(400, {}, "invalid password"));
  }

  const { accessToken } = await generateAccessAndRefereshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // set cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken: accessToken,
        },
        "user logged in successfully"
      )
    );
});

const signUpWithGoogle = asyncHandler(async (req, res) => {
  const payload = req.body;

  payload.username = payload.email;
  //   find user
  const checkUser = await User.findOne({
    $or: [{ username: payload.username }, { email: payload.email }],
  });
  if (checkUser) {
    return res
      .status(409)
      .json(
        new ApiResponse(409, {}, "email or username is already in registered")
      );
  }

  payload.password = rpgenerator();

  const user = await User.create(payload);
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const { accessToken } = await generateAccessAndRefereshTokens(
    createdUser._id
  );

  // set cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        201,
        { user: createdUser, accessToken },
        "Registered successfully"
      )
    );
});

const loginWithGoogle = asyncHandler(async (req, res) => {
  const email = req.body.email;

  //   find user
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json(new ApiResponse(404, {}, "user not found"));
  }

  const { accessToken } = await generateAccessAndRefereshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // set cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken: accessToken,
        },
        "user logged in successfully"
      )
    );
});

// user logout controller
const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out successfully"));
});

export { register, signIn, signUpWithGoogle, loginWithGoogle, logout };
