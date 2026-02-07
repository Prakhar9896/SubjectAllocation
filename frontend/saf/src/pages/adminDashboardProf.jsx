import { useState } from "react";

const RANK_PRIORITY = {
  Professor: 1,
  "Associate Professor": 2,
  "Assistant Professor": 3,
};

/* ---------------- DATA ---------------- */

const COURSES = [
  { course_id: 1, name: "Data Structures", l_hours: 3, t_hours: 0, p_hours: 2, calculated_clh: 4, is_lab_associated: false },
  { course_id: 2, name: "Web Development", l_hours: 2, t_hours: 1, p_hours: 2, calculated_clh: 4, is_lab_associated: true },
  { course_id: 3, name: "Machine Learning", l_hours: 3, t_hours: 1, p_hours: 2, calculated_clh: 5, is_lab_associated: false },
  { course_id: 4, name: "Database Systems", l_hours: 3, t_hours: 0, p_hours: 2, calculated_clh: 4, is_lab_associated: true },
  { course_id: 5, name: "Algorithms", l_hours: 3, t_hours: 1, p_hours: 0, calculated_clh: 4, is_lab_associated: false },
  { course_id: 6, name: "Signal Processing", l_hours: 3, t_hours: 0, p_hours: 2, calculated_clh: 4, is_lab_associated: true },
  { course_id: 7, name: "Cloud Computing", l_hours: 3, t_hours: 1, p_hours: 2, calculated_clh: 5, is_lab_associated: false },
  { course_id: 8, name: "VLSI Design", l_hours: 2, t_hours: 1, p_hours: 4, calculated_clh: 5, is_lab_associated: true },
];

const STAFF = [
  { staff_id: 1, rank: "Associate Professor", is_senior: true, max_load_clh: 14 },
  { staff_id: 2, rank: "Professor", is_senior: true, max_load_clh: 14 },
  { staff_id: 3, rank: "Assistant Professor", is_senior: false, max_load_clh: 14 },
  { staff_id: 4, rank: "Professor", is_senior: true, max_load_clh: 14 },
  { staff_id: 5, rank: "Associate Professor", is_senior: true, max_load_clh: 14 },
  { staff_id: 6, rank: "Assistant Professor", is_senior: false, max_load_clh: 14 },
  { staff_id: 7, rank: "Professor", is_senior: true, max_load_clh: 14 },
  { staff_id: 8, rank: "Associate Professor", is_senior: true, max_load_clh: 14 },
  { staff_id: 9, rank: "Assistant Professor", is_senior: false, max_load_clh: 14 },
  { staff_id: 10, rank: "Professor", is_senior: true, max_load_clh: 14 },
];

const STAFF_DETAILS = [
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
  // -------- Staff 1 --------
  { staff_id: 1, course_id: 1, preference_rank: 1 },
  { staff_id: 1, course_id: 2, preference_rank: 1 },
  { staff_id: 1, course_id: 5, preference_rank: 2 },
  { staff_id: 1, course_id: 4, preference_rank: 3 },

  // -------- Staff 2 --------
  { staff_id: 2, course_id: 3, preference_rank: 1 },
  { staff_id: 2, course_id: 7, preference_rank: 2 },
  { staff_id: 2, course_id: 6, preference_rank: 3 },

  // -------- Staff 3 --------
  { staff_id: 3, course_id: 8, preference_rank: 1 },
  { staff_id: 3, course_id: 4, preference_rank: 2 },
  { staff_id: 3, course_id: 5, preference_rank: 2 },
  { staff_id: 3, course_id: 2, preference_rank: 3 },]
  
export default function AdminDashboardProf() {
  const [staffDetails, setStaffDetails] = useState(STAFF_DETAILS);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [assignments, setAssignments] = useState({});

  const sortedStaff = [...STAFF].sort((a, b) => {
    const r = RANK_PRIORITY[a.rank] - RANK_PRIORITY[b.rank];
    if (r !== 0) return r;
    const la = staffDetails.find(d => d.staff_id === a.staff_id)?.currentLoad || 0;
    const lb = staffDetails.find(d => d.staff_id === b.staff_id)?.currentLoad || 0;
    return la - lb;
  });

  const currentAssignments = assignments[selectedStaffId] || [];
  const staffDetail = staffDetails.find(d => d.staff_id === selectedStaffId);
  const staffMeta = STAFF.find(s => s.staff_id === selectedStaffId);

  const getCourse = id => COURSES.find(c => c.course_id === id);

  const calculateCLH = ids =>
    ids.reduce((s, id) => s + getCourse(id).calculated_clh, 0);

  const handleToggleCourse = id => {
    setAssignments(prev => ({
      ...prev,
      [selectedStaffId]: prev[selectedStaffId]?.includes(id)
        ? prev[selectedStaffId].filter(c => c !== id)
        : [...(prev[selectedStaffId] || []), id],
    }));
  };

  const handleApprove = () => {
    setStaffDetails(prev =>
      prev.map(d =>
        d.staff_id === selectedStaffId
          ? { ...d, currentLoad: d.currentLoad + calculateCLH(currentAssignments) }
          : d,
      ),
    );
    setAssignments({});
    setSelectedStaffId(null);
  };

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard – Faculty Wise Allocation
      </h1>

      <div className="grid grid-cols-2 gap-5 h-[80vh]">
        {/* LEFT */}
        <div className="overflow-y-auto bg-gray-50 rounded-lg">
          {sortedStaff.map((s, i) => {
            const d = staffDetails.find(x => x.staff_id === s.staff_id);
            return (
              <div
                key={s.staff_id}
                onClick={() => setSelectedStaffId(s.staff_id)}
                className={`p-4 border-b border-l-4 cursor-pointer ${
                  selectedStaffId === s.staff_id
                    ? "bg-blue-100 border-l-blue-500"
                    : "bg-white border-l-blue-500"
                }`}
              >
                <p className="font-bold">{i + 1}. {d.name}</p>
                <p className="text-sm text-gray-600">
                  {s.rank} | Load: {d.currentLoad}/{s.max_load_clh} CLH
                </p>
              </div>
            );
          })}
        </div>

        {/* RIGHT */}
        {staffDetail && staffMeta ? (
          <div className="bg-gray-50 rounded-lg flex flex-col">
            <div className="p-4 bg-blue-500 text-white">
              <h3 className="text-xl font-bold">{staffDetail.name}</h3>
              <p>{staffMeta.rank}</p>
              <p>Current Load: {staffDetail.currentLoad}/{staffMeta.max_load_clh} CLH</p>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              {[1, 2, 3].map(rank => (
                <div key={rank} className="mb-4">
                  <p className="font-bold text-sm mb-2">Choice {rank}</p>
                  <div className="space-y-2">
                    {PREFERENCES.filter(p => p.staff_id === selectedStaffId && p.preference_rank === rank)
                      .map(p => {
                        const c = getCourse(p.course_id);
                        const selected = currentAssignments.includes(c.course_id);
                        return (
                          <div
                            key={c.course_id}
                            onClick={() => handleToggleCourse(c.course_id)}
                            className={`p-3 rounded border cursor-pointer ${
                              selected
                                ? "bg-green-100 border-green-500"
                                : "bg-white border-gray-400 hover:bg-gray-50"
                            }`}
                          >
                            <p className="font-semibold">{c.name}</p>
                            <p className="text-sm text-gray-600">
                              L:{c.l_hours} T:{c.t_hours} P:{c.p_hours} | {c.calculated_clh} CLH
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t flex gap-3">
              <button
                onClick={handleApprove}
                disabled={!currentAssignments.length}
                className={`flex-1 py-2 rounded font-bold ${
                  currentAssignments.length
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                Approve Assignments
              </button>
              <button
                onClick={() => setSelectedStaffId(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg flex items-center justify-center text-gray-500">
            Select a faculty member to assign courses
          </div>
        )}
      </div>
    </div>
  );
}
