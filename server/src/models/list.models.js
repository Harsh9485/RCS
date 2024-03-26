import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const listSchema = new Schema(
  {
    owner: {
      type: Schema.ObjectId,
      ref: "AdminUser",
    },
    userList: [
      {
        user: {
          type: Schema.ObjectId,
          ref: "User",
        },
        complit: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

listSchema.plugin(mongooseAggregatePaginate);

const List = mongoose.model("List", listSchema);

export { List };
