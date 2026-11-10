import express from 'express';
import { register, login, getProfile, getAdminTest, createStaff, getStaff, deactivateStaff } from "../controllers/authController.js";
import { protect, allowRoles } from "../middleware/authMiddleware.js"
import { loginLimiter, registerLimiter } from '../middleware/rateLimitMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { registerValidator, loginValidator } from '../vaildators/authValidators.js';


const router = express.Router();

//Protected route
router.get("/profile", protect, getProfile);

router.get("/admin-test", protect, allowRoles("admin"), getAdminTest);

//Staff Routes
router.post("/staff", protect, allowRoles("admin"), createStaff);

router.get("/staff", protect, allowRoles("admin"), getStaff);

router.patch("/staff/:id/deactivate", protect, allowRoles("admin"), deactivateStaff);

router.post("/register", registerLimiter, registerValidator, validateRequest, register);

router.post("/login", loginLimiter, loginValidator, validateRequest, login);




export default router;
