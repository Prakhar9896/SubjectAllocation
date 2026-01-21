import { useState } from "react";

const RANK_PRIORITY = { "Professor": 1, "Associate Professor": 2, "Assistant Professor": 3 };

const COURSES = [
  { course_id: 1, name: "Data Structures", l_hours: 3, t_hours: 0, p_hours: 2, calculated_clh: 4, is_core: true, is_lab_associated: false, required_faculty: 2 },
  { course_id: 2, name: "Web Development", l_hours: 2, t_hours: 1, p_hours: 2, calculated_clh: 4, is_core: false, is_lab_associated: true, required_faculty: 1 },
  { course_id: 3, name: "Machine Learning", l_hours: 3, t_hours: 1, p_hours: 2, calculated_clh: 5, is_core: true, is_lab_associated: false, required_faculty: 1 },
  { course_id: 4, name: "Database Systems", l_hours: 3, t_hours: 0, p_hours: 2, calculated_clh: 4, is_core: true, is_lab_associated: true, required_faculty: 2 },
  { course_id: 5, name: "Algorithms", l_hours: 3, t_hours: 1, p_hours: 0, calculated_clh: 4, is_core: true, is_lab_associated: false, required_faculty: 1 },
  { course_id: 6, name: "Signal Processing", l_hours: 3, t_hours: 0, p_hours: 2, calculated_clh: 4, is_core: true, is_lab_associated: true, required_faculty: 2 },
  { course_id: 7, name: "Cloud Computing", l_hours: 3, t_hours: 1, p_hours: 2, calculated_clh: 5, is_core: false, is_lab_associated: false, required_faculty: 1 },
  { course_id: 8, name: "VLSI Design", l_hours: 2, t_hours: 1, p_hours: 4, calculated_clh: 5, is_core: false, is_lab_associated: true, required_faculty: 2 }
];

const STAFF = [
  { staff_id: 1, rank: "Associate Professor", is_senior: true, max_load_clh: 14 },
  { staff_id: 2, rank: "Professor", is_senior: true, max_load_clh: 14 },
  { staff_id: 3, rank: "Assistant Professor", is_senior: false, max_load_clh: 14 },
  { staff_id: 4, rank: "Professor", is_senior: true, max_load_clh: 14 },
  { staff_id: 5, rank: "Associate Professor", is_senior: true, max_load_clh: 14 }
];

const STAFF_DETAILS = [
  { staff_id: 1, name: "Dr. Sarah Johnson", currentLoad: 8 },
  { staff_id: 2, name: "Prof. Michael Chen", currentLoad: 6 },
  { staff_id: 3, name: "Dr. Emily Watson", currentLoad: 9 },
  { staff_id: 4, name: "Prof. Rajesh Kumar", currentLoad: 10 },
  { staff_id: 5, name: "Dr. Lisa Anderson", currentLoad: 8 }
];

const PREFERENCES = [
  { preference_id: 1, staff_id: 1, course_id: 1, preference_rank: 1 },
  { preference_id: 2, staff_id: 1, course_id: 2, preference_rank: 1 },
  { preference_id: 3, staff_id: 1, course_id: 5, preference_rank: 2 },
  { preference_id: 4, staff_id: 1, course_id: 4, preference_rank: 3 },
  
  { preference_id: 5, staff_id: 2, course_id: 3, preference_rank: 1 },
  { preference_id: 6, staff_id: 2, course_id: 7, preference_rank: 2 },
  { preference_id: 7, staff_id: 2, course_id: 6, preference_rank: 3 },
  
  { preference_id: 8, staff_id: 3, course_id: 8, preference_rank: 1 },
  { preference_id: 9, staff_id: 3, course_id: 4, preference_rank: 2 },
  { preference_id: 10, staff_id: 3, course_id: 5, preference_rank: 2 },
  { preference_id: 11, staff_id: 3, course_id: 2, preference_rank: 3 },
  
  { preference_id: 12, staff_id: 4, course_id: 6, preference_rank: 1 },
  { preference_id: 13, staff_id: 4, course_id: 1, preference_rank: 2 },
  { preference_id: 14, staff_id: 4, course_id: 7, preference_rank: 3 },
  
  { preference_id: 15, staff_id: 5, course_id: 3, preference_rank: 1 },
  { preference_id: 16, staff_id: 5, course_id: 7, preference_rank: 1 },
  { preference_id: 17, staff_id: 5, course_id: 8, preference_rank: 2 },
  { preference_id: 18, staff_id: 5, course_id: 5, preference_rank: 3 }
];

export default function AdminDashboard() {
  const [staff, setStaff] = useState(STAFF);
  const [staffDetails, setStaffDetails] = useState(STAFF_DETAILS);
  const [preferences, setPreferences] = useState(PREFERENCES);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [assignments, setAssignments] = useState({});

  const sortedStaff = [...staff].sort((a, b) => {
    const rankDiff = RANK_PRIORITY[a.rank] - RANK_PRIORITY[b.rank];
    if (rankDiff !== 0) return rankDiff; 
    const detailA = staffDetails.find(d => d.staff_id === a.staff_id);
    const detailB = staffDetails.find(d => d.staff_id === b.staff_id);
    return (detailA?.currentLoad || 0) - (detailB?.currentLoad || 0);
  });

  const currentStaffRecord = selectedStaffId ? staff.find(s => s.staff_id === selectedStaffId) : null;
  const currentStaffDetail = selectedStaffId ? staffDetails.find(d => d.staff_id === selectedStaffId) : null;
  const currentAssignments = assignments[selectedStaffId] || [];

  const getCourseById = (id) => COURSES.find(c => c.course_id === id);
  
  const calculateCLH = (courseIds) => {
    return courseIds.reduce((sum, id) => {
      const course = getCourseById(id);
      return sum + (course?.calculated_clh || 0);
    }, 0);
  };

  const getPreferencesByRank = (staffId, rank) => {
    return preferences.filter(p => p.staff_id === staffId && p.preference_rank === rank);
  };

  const validateConstraints = (staffId, courseIds) => {
    const stf = staff.find(s => s.staff_id === staffId);
    const det = staffDetails.find(d => d.staff_id === staffId);
    const clh = calculateCLH(courseIds);
    const newTotalLoad = (det?.currentLoad || 0) + clh;

    const errors = [];

    if (newTotalLoad > stf.max_load_clh) {
      errors.push(`Exceeds max load: ${newTotalLoad}/${stf.max_load_clh} CLH`);
    }

    if (stf.is_senior) {
      const labCourses = courseIds.map(id => getCourseById(id)).filter(c => c.is_lab_associated);
      if (labCourses.length > 1) {
        errors.push(" Senior faculty cannot select multiple lab-associated courses");
      }
    }

    return { errors, clh: newTotalLoad };
  };

  const handleAssignCourse = (courseId) => {
    const newAssignments = [...currentAssignments, courseId];
    const validation = validateConstraints(selectedStaffId, newAssignments);
    
    if (validation.errors.length === 0) {
      setAssignments(prev => ({
        ...prev,
        [selectedStaffId]: newAssignments
      }));
    } else {
      alert(validation.errors.join("\n"));
    }
  };

  const handleUnassignCourse = (courseId) => {
    setAssignments(prev => ({
      ...prev,
      [selectedStaffId]: prev[selectedStaffId].filter(c => c !== courseId)
    }));
  };

  const handleApprove = () => {
    const validation = validateConstraints(selectedStaffId, currentAssignments);
    
    if (validation.errors.length > 0) {
      alert("Cannot approve:\n" + validation.errors.join("\n"));
      return;
    }

    if (currentAssignments.length > 0) {
      setStaffDetails(prev => prev.map(d =>
        d.staff_id === selectedStaffId
          ? { ...d, currentLoad: validation.clh }
          : d
      ));
      alert(`✓ Assignments approved for ${currentStaffDetail.name}`);
      setSelectedStaffId(null);
      setAssignments(prev => {
        const newAssignments = { ...prev };
        delete newAssignments[selectedStaffId];
        return newAssignments;
      });
    }
  };



  const validation = currentStaffRecord ? validateConstraints(selectedStaffId, currentAssignments) : null;
  const canApprove = currentAssignments.length > 0 && validation?.errors.length === 0;

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard - Faculty Assignment</h1>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="mb-2">
          <strong>Total Faculty:</strong> {sortedStaff.length} | 
          <strong className="ml-5">Assignments Made:</strong> {Object.values(assignments).flat().length} courses
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 min-h-96">
        {/* Faculty List */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Faculty Preferences</h3>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            {sortedStaff.map((stf, idx) => {
              const detail = staffDetails.find(d => d.staff_id === stf.staff_id);
              return (
                <div
                  key={stf.staff_id}
                  onClick={() => setSelectedStaffId(selectedStaffId === stf.staff_id ? null : stf.staff_id)}
                  className={`p-4 cursor-pointer border-b border-gray-300 border-l-4 border-l-blue-500 transition-all ${selectedStaffId === stf.staff_id ? "bg-blue-100" : "bg-white"}`}
                >
                  <p className="font-bold mb-2">
                    {idx + 1}. {detail?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {stf.rank} {stf.is_senior ? "(Senior)" : ""} | Load: {detail?.currentLoad || 0}/{stf.max_load_clh} CLH
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assignment Panel */}
        <div>
          {currentStaffRecord && currentStaffDetail ? (
            <div className="bg-gray-50 rounded-lg overflow-hidden h-full flex flex-col">
              <div className="p-4 bg-blue-500 text-white">
                <h3 className="text-xl font-bold mb-2">{currentStaffDetail.name}</h3>
                <p className="text-sm mb-1">{currentStaffRecord.rank}</p>
                <p className="text-sm mb-2">Current Load: {currentStaffDetail.currentLoad}/{currentStaffRecord.max_load_clh} CLH</p>
                {currentAssignments.length > 0 && (
                  <p className="text-sm bg-black bg-opacity-20 p-2 rounded">
                    New Assignment: +{calculateCLH(currentAssignments)} CLH → Total: {currentStaffDetail.currentLoad + calculateCLH(currentAssignments)}/{currentStaffRecord.max_load_clh} CLH
                  </p>
                )}
              </div>

              <div className="flex-1 overflow-auto p-4">
                <h4 className="font-bold mb-4">Available Courses</h4>
                {[1, 2, 3].map((rank) => {
                  const rankedPreferences = getPreferencesByRank(selectedStaffId, rank);
                  if (rankedPreferences.length === 0) return null;
                  
                  return (
                    <div key={rank} className="mb-4">
                      <p className="font-bold text-sm mb-2">
                        {rank === 1 ? "Choice I" : rank === 2 ? "Choice II" : "Choice III"}
                      </p>
                      <div className="ml-2 flex flex-wrap gap-2">
                        {rankedPreferences.map(pref => {
                          const course = getCourseById(pref.course_id);
                          const isSelected = currentAssignments.includes(pref.course_id);
                          return (
                            <button
                              key={pref.preference_id}
                              onClick={() => isSelected ? handleUnassignCourse(pref.course_id) : handleAssignCourse(pref.course_id)}
                              title={`L:${course.l_hours} T:${course.t_hours} P:${course.p_hours} = ${course.calculated_clh} CLH`}
                              className={`px-2.5 py-1.5 rounded text-sm transition-all ${isSelected ? "bg-green-500 text-white" : "bg-gray-300 text-gray-800"}`}
                            >
                              {course.name} ({course.calculated_clh}CLH) {isSelected ? "✓" : "+"}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Constraint Warnings */}
                {validation && validation.errors.length > 0 && (
                  <div className="mt-4 p-2.5 bg-red-50 border border-red-300 rounded">
                    <p className="font-bold text-red-800 mb-2">Mandatory Constraints Violated:</p>
                    {validation.errors.map((err, idx) => (
                      <p key={idx} className="text-sm text-red-700">{err}</p>
                    ))}
                  </div>
                )}

                {/* Selected Assignments */}
                {currentAssignments.length > 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                    <p className="text-sm font-bold mb-2">Selected Assignments ({calculateCLH(currentAssignments)} CLH added):</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {currentAssignments.map(courseId => {
                        const course = getCourseById(courseId);
                        return (
                          <span key={courseId} className="bg-green-500 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                            {course.name} ({course.calculated_clh} CLH)
                            <span onClick={() => handleUnassignCourse(courseId)} className="cursor-pointer font-bold">×</span>
                          </span>
                        );
                      })}
                    </div>
                    <p className={`text-sm font-bold ${validation.errors.length > 0 ? "text-red-700" : "text-green-700"}`}>
                      Total: {currentStaffDetail.currentLoad + calculateCLH(currentAssignments)}/{currentStaffRecord.max_load_clh} CLH
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-300 flex gap-2.5">
                <button
                  onClick={handleApprove}
                  disabled={!canApprove}
                  className={`flex-1 py-2.5 rounded font-bold transition-all ${canApprove ? "bg-green-500 text-white cursor-pointer hover:bg-green-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                >
                  Approve Assignments
                </button>
                <button
                  onClick={() => setSelectedStaffId(null)}
                  className="px-5 py-2.5 bg-gray-500 text-white rounded cursor-pointer hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
              <p>Select a faculty member to assign courses</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}