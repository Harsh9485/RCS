import { Router } from "express";

const router = Router();

import {
  registerAdminUser,
  adminLogin,
} from "../controllers/adminUser.controller.js";

router.route("/register").post(registerAdminUser);
router.route("/login").post(adminLogin);

export default router;
