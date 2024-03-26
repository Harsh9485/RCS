import { app } from "./app.js";
import connextDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
console.log(process.env.DB);

connextDB()
  .then(() => {
    app.on("error", (err) => {
      console.log(`server connection error: ${err}`);
    });
    app.listen(process.env.PORT || 8080, () => {
      console.log("concect to server", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(`Mongoose connection Error: ${error}`);
  });
