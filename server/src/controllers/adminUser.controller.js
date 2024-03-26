import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AdminUser } from "../models/adminUser.model.js";

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

const registerAdminUser = asyncHandler(async (req, res) => {
  //   const dataUser = await User.find({ createdAt: "2024-03-22T11:46:14.251Z" });
  //   console.log(dataUser);

  const { name, password } = req.body;
  console.log(name, password);
  if (!name || !password) {
    throw new ApiError(400, "Please enter all required fields");
  }
  const existingUser = await AdminUser.findOne({ name });
  if (existingUser) {
    throw new ApiError(400, "this user already exists");
  }

  const user = await AdminUser.create({
    name,
    password,
  });

  const userSuccessFullCreated = await AdminUser.findById(user._id).select(
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

const adminLogin = asyncHandler(async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    throw new ApiError(400, "required name or password must be provided");
  }
  const user = await AdminUser.findOne({ name });
  if (!user) {
    throw new ApiError(411, "user not registed");
  }
  const validPassword = await user.isPasswordCorrect(password);
  if (!validPassword) {
    throw new ApiError(400, "password incorrect");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefereshToken(
    user
  );
  const loginUser = await AdminUser.findById(user._id).select(
    "-password  -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loginUser, "login successfully"));
});

export { registerAdminUser, adminLogin };
