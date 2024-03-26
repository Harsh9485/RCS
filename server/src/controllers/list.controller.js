import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AdminUser } from "../models/adminUser.model.js";
import { List } from "../models/list.models.js";
import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";

const addInList = asyncHandler(async (req, res) => {
  const { ownerId } = req.params;
  const userId = req.user._id;
  if (!isValidObjectId(ownerId)) {
    throw new ApiError(400, "Invalid admin id");
  }
  const existAdmin = await AdminUser.findById(ownerId);
  if (!existAdmin) {
    throw new ApiError(400, "AdminUser not valied");
  }
  console.log(userId);
  const exist = await List.findOne({ "userList._id": userId });
  console.log(exist);
  if (exist) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "user already exists in list"));
  }
  const listexist = await List.findOne({ owner: ownerId });
  if (!listexist) {
    const list = await List.create({
      owner: ownerId,
    });
    list.userList.push(userId);
    await list.save({ validateBeforeSave: false });
    const updatedList = await List.findById(list._id);
    if (list.userList.length !== updatedList.userList.length) {
      throw new ApiError(500, "user not add in List");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, updatedList, "add successfully"));
  }
  listexist.userList.push(userId);
  await listexist.save({ validateBeforeSave: false });
  const updatedList = await List.findById(listexist._id);
  if (listexist.userList.length !== updatedList.userList.length) {
    throw new ApiError(500, "user not add in List");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedList, "add successfully"));
});

const updatedList = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "invalid user id");
  }
  const user = await User.findById(userId);
  console.log(user);
  if (!user) {
    throw new ApiError(400, "user not found please register");
  }
  const list = await List.findOneAndUpdate(
    { owner: req.adminUser._id, "userList._id": user._id },
    { $set: { "userList.$.complit": true } },
    { new: true }
  );
  console.log(list);
  if (!list) {
    throw new ApiError(500, "list not updated");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, list, "list updated successfully"));
});

const createList = asyncHandler(async (req, res) => {
  var targetDate = new Date();
  const thisDateListExist = await List.find({
    createdAt: {
      $gte: new Date(targetDate.setHours(0, 0, 0, 0)), // Start of the target date
      $lt: new Date(targetDate.setHours(23, 59, 59, 999)), // End of the target date
    },
  });
  console.log(thisDateListExist);
  if (thisDateListExist.length > 0) {
    throw new ApiError(400, "list already exists");
  }
  const list = await List.create({
    owner: req.adminUser._id,
  });
  console.log(List);
  if (!list) {
    throw new ApiError(500, "list not created");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, list, "list create successfully"));
});

const getList = asyncHandler(async (req, res) => {
  const list = await List.find({});
});
export { addInList, updatedList, createList };
