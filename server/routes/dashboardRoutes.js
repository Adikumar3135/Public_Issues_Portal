import {getDepartmentAnalytics, getComplaintStatusAnalytics, getDateWiseAnalytics } from "../controllers/departmentController.js";
import { getAdminDashboard } from "../controllers/dashboardController.js";
import {
    protect,
    allowRoles
} from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

router.get(
    "/admin",
    protect,
    allowRoles("admin"),
    getAdminDashboard
);

router.get(
    "/departments",
    protect,
    allowRoles("admin"),
    getDepartmentAnalytics
);

router.get(
    "/status",
    protect,
    allowRoles("admin"),
    getComplaintStatusAnalytics
);

router.get(
    "/date-wise",
    protect,
    allowRoles("admin"),
    getDateWiseAnalytics
);

export default router;