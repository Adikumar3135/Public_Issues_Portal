import Department from "../models/Department.js";
import Complaint from "../models/Complaint.js";

export async function createDepartment(req, res, next) {
    try {
        const { name, description } = req.body;

        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Department name is required"
            });
        }

        const normalizedName = name.trim();

        const existingDepartment = await Department.findOne({
            name: normalizedName
        });

        if (existingDepartment) {
            return res.status(409).json({
                success: false,
                message: "Department already exists"
            });
        }

        const department = await Department.create({
            name: normalizedName,
            description: typeof description === "string" ? description.trim() : ""
        });

        return res.status(201).json({
            success: true,
            message: "Department created successfully",
            department
        });


    } catch (error) {
        next(error);
    }
}

export async function getDepartment(req, res, next) {
    try {
        const departments = await Department.find().sort({ name: 1 }).lean();

        return res.status(200).json({
            success: true,
            count: departments.length,
            departments
        });
    } catch (error) {
        next(error);
    }
}


export async function updateDepartment(req, res, next) {
    try {
        const { name, description } = req.body;

        if (name === undefined && description === undefined) {
            return res.status(400).json({
                success: false,
                message: "Provide a name or description to update"
            });
        }

        const department = await Department.findById(req.params.id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        if (name !== undefined) {
            if (typeof name !== "string" || !name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Department name is required"
                });
            }
            department.name = name.trim();
        }

        if (description !== undefined) {
            if (typeof description !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Description must be text"
                });
            }
            department.description = description.trim();
        }

        await department.save();

        return res.status(200).json({
            success: true,
            message: "Department Updated succesfully",
            department
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Department name is already created"
            });
        }

        next(error);
    }
}


export async function deactivateDepartment(req, res, next) {
    try {
        const department = await Department.findById(req.params.id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        department.isActive = false;
        await department.save();

        return res.status(200).json({
            success: true,
            message: "Department deactivated successfully"
        });
    } catch (error) {
        next(error);
    }
}

export async function getDepartmentAnalytics(req, res, next) {
    try {
        const departments = await Department.find({
            isActive: true
        })
            .select("name")
            .lean();

        const analytics = await Promise.all(
            departments.map(async (department) => {
                const [total, resolved, inProgress, assigned] = await Promise.all([
                    Complaint.countDocuments({
                        assignedDepartment: department._id
                    }),

                    Complaint.countDocuments({
                        assignedDepartment: department._id,
                        status: "Resolved"
                    }),

                    Complaint.countDocuments({
                        assignedDepartment: department._id,
                        status: "In Progress"
                    }),

                    Complaint.countDocuments({
                        assignedDepartment: department._id,
                        status: "Assigned"
                    })
                ]);

                return {
                    department: department.name,
                    total,
                    resolved,
                    inProgress,
                    assigned
                };
            })
        );

        res.status(200).json({
            success: true,
            departments: analytics
        });
    } catch (error) {
        next(error);
    }
}

export async function getComplaintStatusAnalytics(req, res, next) {
    try {
        const statusCounts = await Complaint.aggregate([
            {
                $group: {
                    _id: "$status",
                    total: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    status: "$_id",
                    total: 1
                }
            },
            {
                $sort: { status: 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            statusAnalytics: statusCounts
        });
    } catch (error) {
        next(error);
    }
}

export async function getDateWiseAnalytics(req, res, next) {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Start date and end date are required"
            });
        }
        const isValidDate = (value) => {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                return false;
            }
            const date = new Date(`${value}T00:00:00.000Z`);

            return date.toISOString().slice(0, 10) === value
        }

        if (
            !isValidDate(startDate) ||
            !isValidDate(endDate) ||
            startDate > endDate
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid date range"
            });
        }




        const start = new Date(`${startDate}T00:00:00.000Z`);
        const end = new Date(`${endDate}T23:59:59.999Z`);

        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime()) ||
            start > end
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid date range"
            });
        }

        const analytics = await Complaint.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: start,
                        $lte: end
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                            timezone: "Asia/Kolkata"
                        }
                    },
                    total: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    total: 1
                }
            },
            {
                $sort: { date: 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            dateRange: { startDate, endDate },
            analytics
        });
    } catch (error) {
        next(error);
    }
}
