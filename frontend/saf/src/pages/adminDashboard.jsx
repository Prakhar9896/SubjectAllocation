import { useState } from "react";
import AdminDashboardProf from "./adminDashboardProf";
import AdminDashboardSubjectWise from "./adminDashboardSubj";

export default function UnifiedAdminDashboard() {
  const [mode, setMode] = useState("FACULTY"); // FACULTY | SUBJECT

  return (
    <div className="p-5 max-w-6xl mx-auto">
      {/* MODE TOGGLE */}
      <div className="inline-flex mb-6 rounded-lg border border-gray-300 overflow-hidden">
        <button
          onClick={() => setMode("FACULTY")}
          className={`px-6 py-2 text-sm font-semibold transition-all ${
            mode === "FACULTY"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Faculty Preferences
        </button>

        <button
          onClick={() => setMode("SUBJECT")}
          className={`px-6 py-2 text-sm font-semibold transition-all ${
            mode === "SUBJECT"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Subject Preferences
        </button>
      </div>

      {/* DASHBOARD BODY */}
      {mode === "FACULTY" && <AdminDashboardProf />}
      {mode === "SUBJECT" && <AdminDashboardSubjectWise />}
    </div>
  );
}
