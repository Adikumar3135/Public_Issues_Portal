import { LayoutDashboard, FilePlus2, ClipboardList, UserRound, Users, Building2, ChartNoAxesCombined, Bell, Settings, BriefcaseBusiness } from "lucide-react";
export const citizenNavItems = [
    { label: "Dashboard", path: "/citizen/dashboard", icon: LayoutDashboard },
    { label: "Submit Complaint", path: "/citizen/complaints/new", icon: FilePlus2 },
    { label: "My Complaints", path: "/citizen/complaints", icon: ClipboardList },
    { label: "Notifications", path: "/citizen/notifications", icon: Bell },
    { label: "My Profile", path: "/citizen/profile", icon: UserRound },
];
export const adminNavItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Review Complaints", path: "/admin/complaints", icon: ClipboardList },
    { label: "Staff Management", path: "/admin/staff", icon: Users },
    { label: "Departments", path: "/admin/departments", icon: Building2 },
    { label: "Analytics", path: "/admin/analytics", icon: ChartNoAxesCombined },
    { label: "Notifications", path: "/admin/notifications", icon: Bell },
];
export const staffNavItems = [
    { label: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard },
    { label: "Assigned Complaints", path: "/staff/complaints", icon: BriefcaseBusiness },
    { label: "Notifications", path: "/staff/notifications", icon: Bell },
    { label: "My Profile", path: "/staff/profile", icon: UserRound },
];
