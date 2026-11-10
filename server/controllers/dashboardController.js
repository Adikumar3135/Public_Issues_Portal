import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import Department from "../models/Department.js";


export async function getAdminDashboard(req, res, next){
    try{
        const[
            totalComplaints,
            pendingReview,
            approved,
            assigned,
            inProgress,
            resolved,
            rejected,
            totalCitizens,
            totalStaff,
            totalDepartments
        ] = await Promise.all([
            Complaint.countDocuments(),
            Complaint.countDocuments({ status: { $in: ["Submitted", "Under Review"] } }),
            Complaint.countDocuments({ status: "Approved" }),
            Complaint.countDocuments({ status: "Assigned" }),
            Complaint.countDocuments({ status: "In Progress" }),
            Complaint.countDocuments({ status: "Resolved" }),
            Complaint.countDocuments({ status: "Rejected" }),
            User.countDocuments({ role: "citizen" }),
            User.countDocuments({ role: "municipal", isActive: true }),
            Department.countDocuments({ isActive: true })
        ]);

        return res.status(200).json({
            success:true,
            dashboard:{
                complaint:{
                    total: totalComplaints,
                    pendingReview,
                    approved,
                    assigned,
                    inProgress,
                    resolved,
                    rejected
                },
                users:{
                    totalCitizens,
                    activeStaff: totalStaff
                },
                departments:{
                    active: totalDepartments
                }
            }
        })
    }catch(error){
        next(error);
    }
}