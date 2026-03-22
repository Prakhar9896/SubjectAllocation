import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import AdminLogin from "./pages/Adminlogin"
import Facultyauth from "./pages/Facultyauth";
import FacultyRegister from "./pages/FacultyRegister";
import RoleSelector from "./components/RoleSelector";
import FacultyDashboard from "./pages/FacultyDashboard";
import AdminDashboardProf from "./pages/adminDashboardProf";
import AdminDashboardSubj from "./pages/adminDashboardSubj";
import AdminDashboard from "./pages/adminDashboard";
import FacultyProfile from "./pages/FacultyProfile";
export default function App() {
  const [facultyProfile, setFacultyProfile] = useState({
    name: "Dr. Sarah Johnson",
    rank: "Associate Professor",
    maxLoad: 40,
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelector />} />
        <Route path="/login" element={<Facultyauth />} />
        <Route path="/register" element={<FacultyRegister />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route 
          path="/faculty-dashboard" 
          element={<FacultyDashboard facultyProfile={facultyProfile} />}
        />
        <Route path="admin-dashboard-subj" element={<AdminDashboardSubj/>}/>
        <Route path='admin-dashboard' element={<AdminDashboard/>}/>
        <Route path="admin-dashboard-prof" element={<AdminDashboardProf/>}/>
        <Route path="/fdb" element={<FacultyDashboard />} />
        <Route path='/fp' element={<FacultyProfile />} />
      </Routes>
    </Router>
  );
}
