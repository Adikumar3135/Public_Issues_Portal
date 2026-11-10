
import express from "express";
import {
    createDepartment,
    getDepartment,
    updateDepartment,
    deactivateDepartment,
} from "../controllers/departmentController.js";
import {
    protect,
    allowRoles
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/",
    protect,
    allowRoles("admin"),
    createDepartment
);

router.get(
    "/",
    protect,
    allowRoles("admin"),
    getDepartment
);

router.patch(
    "/:id",
    protect,
    allowRoles("admin"),
    updateDepartment
);

router.patch(
    "/:id/deactivate",
    protect,
    allowRoles("admin"),
    deactivateDepartment
);

export default router;
