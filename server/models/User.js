import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {

        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    passwordHash: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ["citizen", "admin", "municipal"],
        default: "citizen"
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
    { timestamps: true }
);

export default mongoose.model("User", userSchema);