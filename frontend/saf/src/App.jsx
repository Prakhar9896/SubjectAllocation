import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLogin from "./pages/Adminlogin"
import Facultyauth from "./pages/Facultyauth";
import FacultyRegister from "./pages/FacultyRegister";
import RoleSelector from "./components/RoleSelector";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelector />} />
        <Route path="/login" element={<Facultyauth />} />
        <Route path="/register" element={<FacultyRegister />} />
        <Route path="/admin" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}