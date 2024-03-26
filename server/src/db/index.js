import mongoose from "mongoose";

const connextDB = async () => {
  try {
    console.log(process.env.PORT);
    await mongoose.connect(`${process.env.DB}`);
    console.log("Connect to database");
  } catch (error) {
    console.error("db error: ", error);
    process.exit(1);
  }
};

export default connextDB;
