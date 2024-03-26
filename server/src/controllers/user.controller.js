import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const generateAccessAndRefereshToken = async function (user) {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

const options = {
  // options object for cookie security because cookies modify in the frontend
  httpOnly: true,
  secure: true,
};

const registerUser = asyncHandler(async (req, res) => {
  //   const dataUser = await User.find({ createdAt: "2024-03-22T11:46:14.251Z" });
  //   console.log(dataUser);

  const { name, password, aadhaarNo, rashanCardNo } = req.body;
  console.log(name, password, aadhaarNo, rashanCardNo);
  if (!name || !aadhaarNo || !rashanCardNo || !password) {
    throw new ApiError(400, "Please enter all required fields");
  }
  const existingUser = await User.findOne({ name });
  if (existingUser) {
    throw new ApiError(400, "this user already exists");
  }

  const user = await User.create({
    name,
    aadhaarNo,
    rashanCardNo,
    password,
  });

  const userSuccessFullCreated = await User.findById(user._id).select(
    "-password"
  );
  if (!userSuccessFullCreated) {
    throw new ApiError(500, "Account not created please try again");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        userSuccessFullCreated,
        "account created successfully"
      )
    );
});

const login = asyncHandler(async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    throw new ApiError(400, "required name or password must be provided");
  }
  const user = await User.findOne({ name });
  if (!user) {
    throw new ApiError(411, "user not registed");
  }
  const validPassword = await user.isPasswordCorrect(password);
  console.log(validPassword);
  if (!validPassword) {
    throw new ApiError(400, "password incorrect");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefereshToken(
    user
  );

  const loginUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loginUser, "login successfully"));
});

export { registerUser, login };
