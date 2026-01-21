import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import AdminLogin from "./pages/Adminlogin"
import Facultyauth from "./pages/Facultyauth";
import FacultyRegister from "./pages/FacultyRegister";
import RoleSelector from "./components/RoleSelector";
import FacultyDashboard from "./pages/FacultyDashboard";
import AdminDashboard from "./pages/adminDashboard";
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
        <Route path="admin-dashboard" element={<AdminDashboard/>}/>
      </Routes>
    </Router>
  );
}