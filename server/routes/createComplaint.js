import express from "express";
import {
    createComplaint,
    getMyComplaints,
    getComplaintById,
    updateMyComplaint,
    getComplaintsForReview,
    startComplaintReview,
    approveComplaint,
    rejectComplaint,
    assignComplaint,
    getAssignedComplaints,
    updateStaffComplaint,
    getStaffComplaintDetails
} from "../controllers/complaintController.js";
import { protect, allowRoles } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { createComplaintValidator } from "../vaildators/authValidators.js";

const router = express.Router();

router.post(
    "/",
    protect,
    allowRoles("citizen"),
    createComplaintValidator,
    validateRequest,
    createComplaint
);

router.get(
    "/my",
    protect,
    allowRoles("citizen"),
    getMyComplaints
);

router.get(
    "/my/:id",
    protect,
    allowRoles("citizen"),
    getComplaintById
);

router.patch(
    "/my/:id",
    protect,
    allowRoles("citizen"),
    updateMyComplaint
);

router.get(
    "/admin/review",
    protect,
    allowRoles("admin"),
    getComplaintsForReview
);

router.patch(
    "/admin/:id/review",
    protect,
    allowRoles("admin"),
    startComplaintReview
);


router.patch(
  "/admin/:id/approve",
  protect,
  allowRoles("admin"),
  approveComplaint
);

router.patch(
  "/admin/:id/reject",
  protect,
  allowRoles("admin"),
  rejectComplaint
);

router.patch(
    "/admin/:id/assign",
    protect,
    allowRoles("admin"),
    assignComplaint
);

router.get(
    "/staff/assigned",
    protect,
    allowRoles("municipal"),
    getAssignedComplaints
);

router.patch(
    "/staff/:id/status",
    protect,
    allowRoles("municipal"),
    updateStaffComplaint
);

router.get(
    "/staff/:id",
    protect,
    allowRoles("municipal"),
    getStaffComplaintDetails
);


export default router;



