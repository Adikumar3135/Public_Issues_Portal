import mongoose from "mongoose";

const notificationSchema = new  mongoose.Schema(
    {
        recipient:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "USer",
            required:  true,
            index: true
        },
        complaint:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Complaint",
            default: null
        },
        type:{
            type: String,
            enum:[
                "COMPLAINT_SUBMITTED",
                "COMPLAINT_UDER_REVIEW",
                "COMPLAINT_APPROVED",
                "COMPLAINT_REJECTED",
                "COMPLAINT_ASSIGNED",
                "COMPLAINT_IN_PROGRESS",
                "COMPLAINT_RESOLVED"
            ],
            required: true
        },

        title:{
            type: String,
            required: true,
            maxlength: 150
        },

        message:{
            type: String,
            required: true,
            maxlength: 500
        },

        isRead:{
            type: Boolean,
            default: false,
            index: true
        }
    },
    {
        timestamps: true
    }
);

notificationSchema.index({
    recipient: 1,
    createdAt: -1
});

export default mongoose.model("Notification", notificationSchema);