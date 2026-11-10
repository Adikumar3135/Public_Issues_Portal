import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Department from '../models/Department.js';


export async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name,email and password are required"
            });
        }

        if (typeof password !== "string" || password.length < 12) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 12 characters"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            passwordHash,
            role: "citizen"
        });
        return res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        if (typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        }).select("+passwordHash");

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account is disabled"
            });
        }

        const token = jwt.sign(
            { sub: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department
            }
        })
    } catch (error) {
        next(error);
    }

}

export async function getProfile(req, res) {
    return res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            department: req.user.department
        }
    });
}

export async function getAdminTest(req, res) {
    return res.status(200).json({
        success: true,
        message: "Admin access granted"
    })
}

export async function createStaff(req, res, next) {

    try {
        const { name, email, password, department } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            typeof department !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !password ||
            !department.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Name,Email,Password and Department are required"
            });
        }

        if (password.length < 12) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 12 characters"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        const departmentRecord = await Department.findOne({
            _id: department,
            isActive: true
        });

        if (!departmentRecord) {
            return res.status(400).json({
                success: false,
                message: "Valid active department is required"
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const staff = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            passwordHash,
            role: "municipal",
            department: departmentRecord._id
        });

        return res.status(201).json({
            success: true,
            message: "Municipal staff account created successfully",
            user: {
                id: staff._id,
                name: staff.name,
                email: staff.email,
                role: staff.role,
                department: staff.department
            }
        });
    } catch (error) {
        next(error);
    }

}

export async function getStaff(req, res, next) {
    try {
        const staff = await User.find({ role: "municipal" })
            .select("name email role department isActive createdAt")
            .populate("department", "name")
            .sort({ name: 1 })
            .lean();

        return res.status(200).json({
            success: true,
            count: staff.length,
            staff
        });
    } catch (error) {
        next(error);
    }
}

export async function deactivateStaff(req, res, next) {
    try {
        const staff = await User.findOne({
            _id: req.params.id,
            role:"municipal"
        });

        if(!staff){
            return res.status(404).json({
                success:false,
                message:"Municipal staff not found"
            });
        }

        staff.isActive = false;
        await staff.save();

        return res.status(200).json({
            success:true,
            message:"Staff account deactivated successfully"
        });
    }catch(error){
        if(error.name === "CastError"){
            return res.status(400).json({
                success:false,
                message:"Invalid staff ID"
            });
        }

        next(error);
    }
    
}