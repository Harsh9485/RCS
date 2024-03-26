import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

import {
  addInList,
  updatedList,
  createList,
} from "../controllers/list.controller.js";
import { verifyAdminJWT } from "../middlewares/admin.middleware.js";

router.route("/lists/:ownerId").post(verifyJWT, addInList);
router.route("/lists/:userId").patch(verifyAdminJWT, updatedList);
router.route("/lists-create").post(verifyAdminJWT, createList);

export default router;
