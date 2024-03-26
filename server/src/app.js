import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// routes inport
import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/adminUser.routes.js";
import listRouter from "./routes/list.routes.js";
// routes declaration

app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/list", listRouter);

export { app };
