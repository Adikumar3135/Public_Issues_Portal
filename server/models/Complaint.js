import mongoose from "mongoose";


const complaintSchema = new mongoose.Schema(
    {
        complaintId: {
            type: String,
            trim: true,
            unique: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150
        },
        description: {
            type: String,
            required: true,
            maxlength: 3000
        },
        category: {
            type: String,
            enum: [
                "Road", "Sanitation",
                "Water",
                "Electricity",
                "Drainage",
                "Other"
            ],
            required: true
        },
        location: {
            address: {
                type: String,
                required: true,
                maxlength: 300
            },
            latitude: Number,
            longitude: Number
        },
        imageUrl: {
            type: String,
            default: ""
        },
        status: {
            type: String,
            enum: [
                "Submitted",
                "Under Review",
                "Approved",
                "Assigned",
                "In Progress",
                "Resolved",
                "Rejected"
            ],
            default: "Submitted",
            index: true
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },
        assignedDepartment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            default: null
        },
        assignedStaff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        reviewNote: {
            type: String,
            default: "",
            maxlength: 1000
        },
        resolutionNote: {
            type: String,
            default: "",
            maxlength: 1000
        },
        history: [
            {
                status: {
                    type: String,
                    required: true
                },
                note: {
                    type: String,
                    default: "",
                    maxlength: 1000
                },
                actor: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                timestamp: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true
    }
);


export default mongoose.model("Complaint", complaintSchema);