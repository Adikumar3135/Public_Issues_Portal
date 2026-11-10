import {Navigate,Route,Routes} from "react-router-dom";import {Toaster} from "react-hot-toast";import {useAuth} from "./context/AuthContext";import Login from "./pages/auth/Login";import Register from "./pages/auth/Register";import ProtectedRoute from "./routes/ProtectedRoute";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";import SubmitComplaint from "./pages/citizen/SubmitComplaint";import MyComplaints from "./pages/citizen/MyComplaints";import ComplaintDetails from "./pages/citizen/ComplaintDetails";import CitizenProfile from "./pages/citizen/CitizenProfile";import CitizenNotifications from "./pages/citizen/CitizenNotifications";
import AdminDashboard from "./pages/admin/AdminDashboard";import AdminComplaints from "./pages/admin/AdminComplaints";import AdminStaff from "./pages/admin/AdminStaff";import AdminDepartments from "./pages/admin/AdminDepartments";import AdminAnalytics from "./pages/admin/AdminAnalytics";
import StaffDashboard from "./pages/municipal/StaffDashboard";import StaffComplaints from "./pages/municipal/StaffComplaints";import NotificationsPage from "./pages/shared/NotificationsPage";import ProfilePage from "./pages/shared/ProfilePage";
function RoleHome(){const {user}=useAuth();if(user?.role==="citizen")return <Navigate to="/citizen/dashboard" replace/>;if(user?.role==="admin")return <Navigate to="/admin/dashboard" replace/>;if(user?.role==="municipal")return <Navigate to="/staff/dashboard" replace/>;return <Navigate to="/" replace/>;}
function App(){return <><Toaster position="top-right" toastOptions={{duration:3500}}/><Routes><Route path="/" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/home" element={<ProtectedRoute><RoleHome/></ProtectedRoute>}/>
<Route element={<ProtectedRoute allowedRoles={["citizen"]}/>}>
<Route path="/citizen/dashboard" element={<CitizenDashboard/>}/><Route path="/citizen/complaints/new" element={<SubmitComplaint/>}/><Route path="/citizen/complaints" element={<MyComplaints/>}/><Route path="/citizen/complaints/:id" element={<ComplaintDetails/>}/><Route path="/citizen/profile" element={<CitizenProfile/>}/><Route path="/citizen/notifications" element={<CitizenNotifications/>}/>
</Route>
<Route element={<ProtectedRoute allowedRoles={["admin"]}/>}>
<Route path="/admin/dashboard" element={<AdminDashboard/>}/><Route path="/admin/complaints" element={<AdminComplaints/>}/><Route path="/admin/staff" element={<AdminStaff/>}/><Route path="/admin/departments" element={<AdminDepartments/>}/><Route path="/admin/analytics" element={<AdminAnalytics/>}/><Route path="/admin/notifications" element={<NotificationsPage/>}/><Route path="/admin/profile" element={<ProfilePage/>}/>
</Route>
<Route element={<ProtectedRoute allowedRoles={["municipal"]}/>}>
<Route path="/staff/dashboard" element={<StaffDashboard/>}/><Route path="/staff/complaints" element={<StaffComplaints/>}/><Route path="/staff/notifications" element={<NotificationsPage/>}/><Route path="/staff/profile" element={<ProfilePage/>}/>
</Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes></>}
export default App;
