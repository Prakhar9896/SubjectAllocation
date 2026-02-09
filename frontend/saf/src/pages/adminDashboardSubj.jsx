import { useState } from "react";
import toast from "react-hot-toast";

/* ---------------- CONSTANTS ---------------- */

const RANK_PRIORITY = {
  Professor: 1,
  "Associate Professor": 2,
  "Assistant Professor": 3,
};

const COURSES = [
  { course_id: 1, name: "Data Structures", calculated_clh: 4 },
  { course_id: 2, name: "Web Development", calculated_clh: 4 },
  { course_id: 3, name: "Machine Learning", calculated_clh: 5 },
  { course_id: 4, name: "Database Systems", calculated_clh: 4 },
  { course_id: 5, name: "Algorithms", calculated_clh: 4 },
  { course_id: 6, name: "Signal Processing", calculated_clh: 4 },
  { course_id: 7, name: "Cloud Computing", calculated_clh: 5 },
  { course_id: 8, name: "VLSI Design", calculated_clh: 5 },
];

const STAFF = [
  { staff_id: 1, rank: "Associate Professor", max_load_clh: 14 },
  { staff_id: 2, rank: "Professor", max_load_clh: 14 },
  { staff_id: 3, rank: "Assistant Professor", max_load_clh: 14 },
  { staff_id: 4, rank: "Professor", max_load_clh: 14 },
  { staff_id: 5, rank: "Associate Professor", max_load_clh: 14 },
  { staff_id: 6, rank: "Assistant Professor", max_load_clh: 14 },
  { staff_id: 7, rank: "Professor", max_load_clh: 14 },
  { staff_id: 8, rank: "Associate Professor", max_load_clh: 14 },
  { staff_id: 9, rank: "Assistant Professor", max_load_clh: 14 },
  { staff_id: 10, rank: "Professor", max_load_clh: 14 },
];

const STAFF_DETAILS_INIT = [
  { staff_id: 1, name: "Dr. Sarah Johnson", currentLoad: 8 },
  { staff_id: 2, name: "Prof. Michael Chen", currentLoad: 6 },
  { staff_id: 3, name: "Dr. Emily Watson", currentLoad: 9 },
  { staff_id: 4, name: "Prof. Rajesh Kumar", currentLoad: 10 },
  { staff_id: 5, name: "Dr. Lisa Anderson", currentLoad: 8 },
  { staff_id: 6, name: "Dr. Daniel Brown", currentLoad: 7 },
  { staff_id: 7, name: "Prof. Anna Müller", currentLoad: 9 },
  { staff_id: 8, name: "Dr. Kevin Park", currentLoad: 6 },
  { staff_id: 9, name: "Dr. Sofia Martinez", currentLoad: 8 },
  { staff_id: 10, name: "Prof. James Wilson", currentLoad: 11 },
];

const PREFERENCES = [
  { staff_id: 1, course_id: 1, preference_rank: 1 },
  { staff_id: 2, course_id: 1, preference_rank: 1 },
  { staff_id: 7, course_id: 1, preference_rank: 1 },
  { staff_id: 4, course_id: 1, preference_rank: 2 },
  { staff_id: 5, course_id: 1, preference_rank: 3 },
];

/* ---------------- COMPONENT ---------------- */

export default function AdminDashboardSubjectWise() {
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [staffDetails, setStaffDetails] = useState(STAFF_DETAILS_INIT);

  const selectedCourse = COURSES.find(c => c.course_id === selectedCourseId);

  const getStaffForRank = rank => {
    return PREFERENCES.filter(
      p => p.course_id === selectedCourseId && p.preference_rank === rank,
    )
      .map(p => {
        const staff = STAFF.find(s => s.staff_id === p.staff_id);
        const detail = staffDetails.find(d => d.staff_id === p.staff_id);
        return { ...staff, ...detail };
      })
      .sort((a, b) => {
        const r = RANK_PRIORITY[a.rank] - RANK_PRIORITY[b.rank];
        if (r !== 0) return r;
        return a.currentLoad - b.currentLoad;
      });
  };

  const handleApprove = () => {
    if (!selectedCourseId || !selectedStaffId) {
      toast.error("❌ Select a subject and faculty before approving");
      return;
    }

    const staffMeta = STAFF.find(s => s.staff_id === selectedStaffId);
    const staffDetail = staffDetails.find(d => d.staff_id === selectedStaffId);
    const newLoad = staffDetail.currentLoad + selectedCourse.calculated_clh;

    if (newLoad > staffMeta.max_load_clh) {
      toast("⚠️ Assignment exceeds faculty load limit", {
        icon: "🚫",
        duration: 10000,
      });
      return;
    }

    setStaffDetails(prev =>
      prev.map(d =>
        d.staff_id === selectedStaffId
          ? { ...d, currentLoad: newLoad }
          : d,
      ),
    );

    toast.success(
      `${selectedCourse.name} assigned successfully`,
    );

    setSelectedCourseId(null);
    setSelectedStaffId(null);
  };

  const canApprove = selectedCourseId !== null && selectedStaffId !== null;

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard – Subject Wise Allocation
      </h1>

      <div className="grid grid-cols-2 gap-5 h-[80vh]">
        {/* LEFT: SUBJECT LIST */}
        <div className="overflow-y-auto">
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            {COURSES.map((course, idx) => (
              <div
                key={course.course_id}
                onClick={() => {
                  setSelectedCourseId(course.course_id);
                  setSelectedStaffId(null);
                  toast(`📘 Selected ${course.name}`, { duration: 2000 });
                }}
                className={`p-4 cursor-pointer border-b border-gray-300 border-l-4 transition-all ${
                  selectedCourseId === course.course_id
                    ? "bg-blue-100 border-l-blue-500"
                    : "bg-white border-l-blue-500 hover:bg-blue-50"
                }`}
              >
                <p className="font-bold">
                  {idx + 1}. {course.name}
                </p>
                <p className="text-sm text-gray-600">
                  CLH: {course.calculated_clh}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-gray-50 rounded-lg flex flex-col">
          {selectedCourse ? (
            <>
              <div className="p-4 bg-blue-500 text-white">
                <h3 className="text-xl font-bold">{selectedCourse.name}</h3>
                <p>Course Load: {selectedCourse.calculated_clh} CLH</p>
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                {[1, 2, 3].map(rank => {
                  const staffList = getStaffForRank(rank);
                  if (!staffList.length) return null;

                  return (
                    <div key={rank} className="mb-4">
                      <p className="font-bold text-sm mb-2">
                        {rank === 1
                          ? "Choice I"
                          : rank === 2
                            ? "Choice II"
                            : "Choice III"}
                      </p>

                      <div className="space-y-2 ml-2">
                        {staffList.map(s => (
                          <div
                            key={s.staff_id}
                            onClick={() => {
                              setSelectedStaffId(s.staff_id);
                              toast(`👨‍🏫 Selected ${s.name}`, { duration: 2000 });
                            }}
                            className={`p-3 rounded border cursor-pointer transition-all ${
                              selectedStaffId === s.staff_id
                                ? "bg-green-100 border-green-500"
                                : "bg-white hover:bg-gray-50"
                            }`}
                          >
                            <p className="font-semibold">{s.name}</p>
                            <p className="text-sm text-gray-600">
                              {s.rank} | Load: {s.currentLoad}/{s.max_load_clh} CLH
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={!canApprove}
                  className={`flex-1 py-2 rounded font-bold transition-all ${
                    canApprove
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Approve Assignments
                </button>

                <button
                  onClick={() => {
                    setSelectedCourseId(null);
                    setSelectedStaffId(null);
                    toast("ℹ️ Assignment cancelled");
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a subject to begin allocation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
