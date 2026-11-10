import Complaint from "../models/Complaint.js";
import Department from "../models/Department.js";
import User from "../models/User.js";
import {createNotification} from "../utils/createNotification.js";

export async function createComplaint(req, res, next) {
    try {
        const {
            title,
            description,
            category,
            address,
            latitude,
            longitude
        } = req.body;

        if (
            typeof title !== "string" ||
            typeof description !== "string" ||
            typeof category !== "string" ||
            typeof address !== "string" ||
            !title.trim() ||
            !description.trim() ||
            !address.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Title, description, category and address are required"
            });
        }

        const allowedCategories = [
            "Road",
            "Sanitation",
            "Water",
            "Electricity",
            "Drainage",
            "Other"
        ];

        if (!allowedCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid complaint category"
            });
        }

        if (
            (latitude !== undefined && (typeof latitude !== "number" || latitude < -90 || latitude > 90)) || (longitude !== undefined && (typeof longitude !== "number" || longitude < -180 || longitude > 180))
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid location coordinates"
            });
        }


        const complaintId = `CMP-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)
            .toUpperCase()}`;

        const complaint = await Complaint.create({
            complaintId,
            user: req.user._id,
            title: title.trim(),
            description: description.trim(),
            category,
            location: {
                address: address.trim(), ...(latitude !== undefined && { latitude }),
                ...(longitude !== undefined && { longitude })
            },
            status: "Submitted",
            history: [
                {
                    status: "Submitted",
                    note: "Complaint submitted by citizen",
                    actor: req.user._id
                }
            ]
        });

        try {
            await createNotification({
                recipient: req.user._id,
                complaint: complaint._id,
                type: "COMPLAINT_SUBMITTED",
                title: "Complaint Submitted",
                message: `Your complaint ${complaint.complaintId} has been submitted successfully.`
            });
        } catch (notificationError) {
            console.error("Submission notification failed:", notificationError.message);
        }

        return res.status(201).json({
            success: true,
            message: "Complaint submitted successfully",
            complaint: {
                id: complaint._id,
                complaintId: complaint.complaintId,
                title: complaint.title,
                category: complaint.category,
                status: complaint.status,
                location: complaint.location,
                createdAt: complaint.createdAt
            }
        });

    } catch (error) {
        next(error);
    }
}


export async function getComplaintById(req, res, next) {
    try {
        const complaint = await Complaint.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate("assignedDepartment", "name")
            .populate("assignedStaff", "name")
            .populate("history.actor", "name role")
            .lean();

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        return res.status(200).json({
            success: true,
            complaint
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid complaint ID"
            });
        }

        next(error);
    }
}

export async function updateMyComplaint(req, res, next) {
    try {
        const complaint = await Complaint.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        if (complaint.status !== "Submitted") {
            return res.status(400).json({
                success: false,
                message: "Only submitted complaint can be edited"
            });
        }

        const {
            title,
            description,
            category,
            address
        } = req.body;

        if (
            title === undefined &&
            description === undefined &&
            category === undefined &&
            address === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Provide at least one field to update"
            });
        }
        if (title !== undefined) {
            if (typeof title !== "string" || !title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Title cannot be empty"
                });
            }
            if (title.trim().length > 150) {
                return res.status(400).json({
                    success: false,
                    message: "Title cannot exceed 150 characters"
                });
            }

            complaint.title = title.trim();
        }

        if (description !== undefined) {
            if (
                typeof description !== "string" ||
                !description.trim() ||
                description.length > 3000
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Description must be 1-3000 characters"
                });
            }

            complaint.description = description.trim();
        }

        if (category !== undefined) {
            const allowedCategories = [
                "Road",
                "Sanitation",
                "Water",
                "Electricity",
                "Drainage",
                "Other"
            ];

            if (!allowedCategories.includes(category)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid complaint category"
                });
            }
            complaint.category = category;
        }

        if (address !== undefined) {
            if (
                typeof address !== "string" ||
                !address.trim() ||
                address.trim().length > 300
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Address must be 1–300 characters"
                });
            }
            complaint.location.address = address.trim();
        }

        await complaint.save();

        return res.status(200).json({
            success: true,
            message: "Complaint updated successfully",
            complaint
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid complaint ID"
            });
        }
        next(error);
    }
}


export async function getMyComplaints(req, res, next) {
    try {
        const page = Math.max(
            1,
            Number.parseInt(req.query.page, 10) || 1
        );

        const limit = Math.min(
            50,
            Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
        );

        const filter = {
            user: req.user._id
        };

        const allowedStatuses = [
            "Submitted",
            "Under Review",
            "Approved",
            "Assigned",
            "In Progress",
            "Resolved",
            "Rejected"
        ];

        const allowedCategories = [
            "Road",
            "Sanitation",
            "Water",
            "Electricity",
            "Drainage",
            "Other"
        ];

        if (req.query.status) {
            if (!allowedStatuses.includes(req.query.status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid complaint status"
                });
            }

            filter.status = req.query.status;
        }

        if (req.query.category) {
            if (!allowedCategories.includes(req.query.category)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid complaint category"
                });
            }

            filter.category = req.query.category;
        }

        const [complaints, total] = await Promise.all([
            Complaint.find(filter)
                .select(
                    "complaintId title category status priority location.address createdAt updatedAt"
                )
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),

            Complaint.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            filters: {
                status: filter.status || null,
                category: filter.category || null
            },
            complaints
        });
    } catch (error) {
        next(error);
    }
}


export async function getComplaintsForReview(req, res, next) {
    try {
        const page = Math.max(
            1,
            Number.parseInt(req.query.page, 10) || 1
        );

        const limit = Math.min(
            50,
            Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
        );

        const filter = {
            status: { $in: ["Submitted", "Under Review", "Approved"] }
        };

        const [complaints, total] = await Promise.all([
            Complaint.find(filter)
                .select(
                    "complaintId title description category location.address status priority user assignedDepartment assignedStaff createdAt"
                )
                .populate("user", "name email")
                .populate("assignedDepartment", "name")
                .populate("assignedStaff", "name")
                .sort({ createdAt: 1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),

            Complaint.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            complaints
        });
    } catch (error) {
        next(error);
    }
}


export async function startComplaintReview(req, res, next) {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        if (complaint.status !== "Submitted") {
            return res.status(400).json({
                success: false,
                message: "Only submitted complaints can enter review"
            });
        }

        complaint.status = "Under Review";

        complaint.history.push({
            status: "Under Review",
            note: "Admin started reviewing the complaint",
            actor: req.user._id
        });

        await complaint.save();

        try {
            await createNotification({
                recipient: complaint.user,
                complaint: complaint._id,
                type: "COMPLAINT_UNDER_REVIEW",
                title: "Complaint Under Review",
                message: `Your complaint ${complaint.complaintId} is now under review.`
            });
        } catch (notificationError) {
            console.error("Review notification failed:", notificationError.message);
        }

        return res.status(200).json({
            success: true,
            message: "Complaint moved to Under Review",
            complaint
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid complaint ID"
            });
        }

        next(error);
    }
}


export async function approveComplaint(req, res, next) {
    try {
        const { departmentId, note } = req.body;

        if (
            typeof departmentId !== "string" ||
            !departmentId.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Department ID is required"
            });
        }

        const department = await Department.findOne({
            _id: departmentId,
            isActive: true

        });

        if (!department) {
            return res.status(400).json({
                success: false,
                message: "Valid active department is required"
            });
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        if (complaint.status !== "Under Review") {
            return res.status(400).json({
                success: false,
                message: "Only complaints under review can be approved"
            });

        }

        complaint.status = "Approved";
        complaint.assignedDepartment = department._id;
        complaint.reviewNote =
            typeof note === "string" ? note.trim() : "";

        complaint.history.push({
            status: "Approved",
            note: complaint.reviewNote || "Complaint approved by admin",
            actor: req.user._id
        });

        await complaint.save();

        try{
            await createNotification({
                recipient: complaint.user,
                complaint: complaint._id,
                type: "COMPLAINT_APPROVED",
                title: "Complaint Approved",
                message: `Your complaint ${complaint.complaintId} has been approved and assigned to ${department.name}.`
            });
        }catch(error){
            console.error("Approval notification failed:", error.message);
        }

        return res.status(200).json({
            success: true,
            message: "Complaint approved and department assigned",
            complaint
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid complaint or department ID"
            });
        }

        next(error);
    }
}


export async function rejectComplaint(req, res, next) {
    try {
        const { reason } = req.body;

        if (
            typeof reason !== "string" ||
            !reason.trim() ||
            reason.trim().length > 1000
        ) {
            return res.status(400).json({
                success: false,
                message: "A rejection reason of 1–1000 characters is required"
            });
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        if (
            !["Submitted", "Under Review"].includes(complaint.status)
        ) {
            return res.status(400).json({
                success: false,
                message: "This complaint cannot be rejected at its current status"
            });
        }

        complaint.status = "Rejected";
        complaint.reviewNote = reason.trim();

        complaint.history.push({
            status: "Rejected",
            note: reason.trim(),
            actor: req.user._id
        });

        await complaint.save();

        try{
            await createNotification({
                recipient: complaint.user,
                complaint: complaint._id,
                type: "COMPLAINT_REJECTED",
                title: "Complaint Rejected",
                message: `Your complaint ${complaint.complaintId} was rejected. Reason: ${reason.trim()}`
            });
        }catch(error){
            console.error("Rejection notification failed:", error.message);
        }

        return res.status(200).json({
            success: true,
            message: "Complaint rejected",
            complaint
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid complaint ID"
            });
        }

        next(error);
    }
}

export async function assignComplaint(req, res, next) {
    try {
        const { staffId } = req.body;

        if (
            typeof staffId !== "string" ||
            !staffId.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Staff ID is required"
            });
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        if (complaint.status !== "Approved") {
            return res.status(400).json({
                success: false,
                message: "Only approved complaint can be assigned"
            });
        }

        if (!complaint.assignedDepartment) {
            return res.status(400).json({
                success: false,
                message: "Complaint department is missing"
            });
        }

        const staff = await User.findOne({
            _id: staffId,
            role: "municipal",
            isActive: true,
            department: complaint.assignedDepartment
        });

        if (!staff) {
            return res.status(400).json({
                success: false,
                message: "Active staff from the assigned department is required"
            });
        }

        complaint.assignedStaff = staff._id;
        complaint.status = "Assigned";

        complaint.history.push({
            status: "Assigned",
            note: `Complaint assigned to ${staff.name}`,
            actor: req.user._id
        });

        await complaint.save();

        try{
            await createNotification({
                recipient: complaint.user,
                complaint: complaint._id,
                type: "COMPLAINT_ASSIGNED",
                title:"Complaint Assigned",
                message: `Your complaint ${complaint.complaintId} has been assigned to the ${staff.name} team.`
            });
        }catch(notificationError){
            console.error(
                "Assigned notification failed:",
                notificationError.message
            );
        }

        return res.status(200).json({
            success: true,
            message: "Complaint assigned successfully",
            complaint: {
                id: complaint._id,
                complaintId: complaint.complaintId,
                status: complaint.status,
                assignedDepartment: complaint.assignedDepartment,
                assignedStaff: staff._id
            }
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid complaint or staff ID"
            });
        }
        next(error);
    }
}

export async function getAssignedComplaints(req, res, next) {
    try {
        const page = Math.max(
            1,
            Number.parseInt(req.query.page, 10) || 1
        );

        const limit = Math.min(
            50,
            Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
        );

        const filter = {
            assignedStaff: req.user._id,
            assignedDepartment: req.user.department,
            status: { $in: ["Assigned", "In Progress", "Resolved"] }
        };

        const [complaints, total] = await Promise.all([
            Complaint.find(filter)
                .select(
                    "complaintId title description category location status priority createdAt updatedAt"
                )
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Complaint.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            complaints
        });
    } catch (error) {
        next(error);
    }
}

export async function updateStaffComplaint(req, res, next) {
    try {
        const { status, resolutionNote } = req.body;

        if (!['In Progress', 'Resolved'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid complaint status'
            });
        }

        const complaint = await Complaint.findOne({
            _id: req.params.id,
            assignedStaff: req.user._id,
            assignedDepartment: req.user.department
        });

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Assigned complaint not found'
            });
        }

        if (status === 'In Progress' && complaint.status !== 'Assigned') {
            return res.status(400).json({
                success: false,
                message: 'Only assigned complaints can be started'
            });
        }

        if (status === 'Resolved') {
            if (complaint.status !== 'In Progress') {
                return res.status(400).json({
                    success: false,
                    message: 'Only in-progress complaints can be resolved'
                });
            }

            if (typeof resolutionNote !== 'string' || !resolutionNote.trim() || resolutionNote.trim().length > 1000) {
                return res.status(400).json({
                    success: false,
                    message: 'Resolution note is required (maximum 1000 characters)'
                });
            }

            complaint.resolutionNote = resolutionNote.trim();
        }

        complaint.status = status;
        complaint.history.push({
            status,
            note: status === 'Resolved'
                ? resolutionNote.trim()
                : 'Municipal staff started working on the complaint',
            actor: req.user._id
        });

        await complaint.save();

        const notificationDetails = status === 'In Progress'
            ? {
                type: 'COMPLAINT_IN_PROGRESS',
                title: 'Work Started',
                message: `Work has started on your complaint ${complaint.complaintId}.`
            }
            : {
                type: 'COMPLAINT_RESOLVED',
                title: 'Complaint Resolved',
                message: `Your complaint ${complaint.complaintId} has been resolved.`
            };

        try {
            await createNotification({
                recipient: complaint.user,
                complaint: complaint._id,
                ...notificationDetails
            });
        } catch (notificationError) {
            console.error('Status notification failed:', notificationError.message);
        }

        return res.status(200).json({
            success: true,
            message: `Complaint status updated to ${status}`,
            complaint
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid complaint ID'
            });
        }
        next(error);
    }
}

export async function getStaffComplaintDetails(req, res, next) {
    try{
        const complaint = await Complaint.findOne({
            _id: req.params.id,
            assignedDepartment: req.user.department,
            assignedStaff: req.user._id
        }).populate("user","name")
        .populate("assignedDepartment","name")
        .populate("assignedStaff","name")
        .populate("history.actor","name role")
        .lean();

        if(!complaint){
            return res.status(404).json({
                success: false,
                message: "Assigned complaint not found"
            });
        }

        return res.status(200).json({
            success: true,
            complaint
        });
    }catch(error){
        if(error.name === "CastError"){
            return res.status(400).json({
                success: false,
                message: "Invalid complaint ID"
            });
        }
        next(error);
    }
}