import logo from "../assets/manipal-logo.png";
import { useNavigate } from "react-router-dom";

export default function RoleSelector() {
  const navigate = useNavigate();

  return (
    <>
      {/* TOP BAR */}
      <div className="h-24 bg-white flex items-center pl-10 border-b-4 border-[#0b3c5d]">
        <img src={logo} alt="Manipal Logo" className="h-16" />
      </div>

      {/* MAIN SPLIT SCREEN */}
      <div className="flex h-[calc(100vh-96px)]">
        {/* LEFT SECTION */}
        <div className="flex-1 bg-gradient-to-br from-[#0b3c5d] to-[#1c5d8a] text-white px-20 py-20 flex flex-col justify-center">
          <h1 className="text-6xl font-bold leading-snug mb-6">
            Subject Allocation<br />Management System
          </h1>
          <p className="text-base opacity-95 max-w-lg">
            Official academic portal for faculty and administrators of
            Manipal Institute of Technology.
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex-1 bg-[#f4f6f8] flex items-center justify-center p-8">
          {/* LOGIN CARD */}
          <div className="bg-white w-full max-w-sm p-10 rounded-2xl shadow-2xl text-center">
            <h2 className="text-3xl font-bold mb-2">Sign in</h2>
            <p className="text-gray-600 mb-8">Select your login role</p>

            <button
              className="w-full py-4 bg-[#0b3c5d] text-white rounded-lg font-medium mb-3 hover:bg-[#08304a] transition duration-200"
              onClick={() => navigate("/login")}
            >
              Faculty Login
            </button>

            <button
              className="w-full py-4 bg-white text-[#0b3c5d] border-2 border-[#0b3c5d] rounded-lg font-medium hover:bg-[#eef3f7] transition duration-200"
              onClick={() => navigate("/admin")}
            >
              Administrator Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}