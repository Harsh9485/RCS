import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { AdminUser } from "../models/adminUser.model.js";

export const verifyAdminJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Brarer", "");
    if (!token) {
      throw new ApiError(400, "unauthorized request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const adminUser = await AdminUser.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!adminUser) {
      throw new ApiError(400, "User not exist");
    }
    req.adminUser = adminUser;
    next();
  } catch (error) {
    throw new ApiError(400, "Authentication request");
  }
});
