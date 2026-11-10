import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";


async function seedAdmin() {
    try {
        const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

        if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
            throw new Error("Admin environment variables are missing");
        }
        if (ADMIN_PASSWORD.length < 12){
            throw new Error("Admin password must be at least 12 characters");
        }

        await connectDB();

        const email = ADMIN_EMAIL.trim().toLowerCase();

        const existingUser = await User.findOne({email});

        if(existingUser){
            console.log(
                "An account with this email already exists"
            );
            return
        }

        const passwordHash = await bcrypt.hash(ADMIN_PASSWORD,12);

        await User.create({
            name:ADMIN_NAME.trim(),
            email,
            passwordHash,
            role:"admin",
            department:null
        });

        console.log("Admin account created successfully");

    }catch(error){
        console.error("Admin setup failed:",error.message);
        process.exitCode = 1; 
    } finally {
        await mongoose.disconnect().catch((disconnectError) => {
            console.error("Database disconnect failed:", disconnectError.message);
        });
    }
}

seedAdmin();