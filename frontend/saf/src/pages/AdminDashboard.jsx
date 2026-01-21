import { useState } from "react";

const RANK_PRIORITY = { "Professor": 1, "Associate Professor": 2, "Assistant Professor": 3 };
const PREFERENCE_PRIORITY = { "choice1": 1, "choice2": 2, "choice3": 3 };

const DUMMY_FACULTY_PREFERENCES = [
  {
    facultyId: 1,
    name: "Dr. Sarah Johnson",
    rank: "Associate Professor",
    currentLoad: 12,
    preferences: [
      { choice: "choice1", courses: ["Data Structures", "Web Development"] },
      { choice: "choice2", courses: ["Algorithms"] },
      { choice: "choice3", courses: ["Database Systems"] }
    ]
  },
  {
    facultyId: 2,
    name: "Prof. Michael Chen",
    rank: "Professor",
    currentLoad: 8,
    preferences: [
      { choice: "choice1", courses: ["Machine Learning"] },
      { choice: "choice2", courses: ["Cloud Computing"] },
      { choice: "choice3", courses: ["Signal Processing"] }
    ]
  },
  {
    facultyId: 3,
    name: "Dr. Emily Watson",
    rank: "Assistant Professor",
    currentLoad: 15,
    preferences: [
      { choice: "choice1", courses: ["VLSI Design"] },
      { choice: "choice2", courses: ["Database Systems", "Algorithms"] },
      { choice: "choice3", courses: ["Web Development"] }
    ]
  },
  {
    facultyId: 4,
    name: "Prof. Rajesh Kumar",
    rank: "Professor",
    currentLoad: 20,
    preferences: [
      { choice: "choice1", courses: ["Signal Processing"] },
      { choice: "choice2", courses: ["Data Structures"] },
      { choice: "choice3", courses: ["Cloud Computing"] }
    ]
  },
  {
    facultyId: 5,
    name: "Dr. Lisa Anderson",
    rank: "Associate Professor",
    currentLoad: 18,
    preferences: [
      { choice: "choice1", courses: ["Machine Learning", "Cloud Computing"] },
      { choice: "choice2", courses: ["VLSI Design"] },
      { choice: "choice3", courses: ["Algorithms"] }
    ]
  }
];

const AVAILABLE_COURSES = [
  "Data Structures",
  "Web Development",
  "Machine Learning",
  "Database Systems",
  "Algorithms",
  "Signal Processing",
  "Cloud Computing",
  "VLSI Design"
];

export default function AdminDashboard() {
  const [preferences, setPreferences] = useState(DUMMY_FACULTY_PREFERENCES);
  const [assignments, setAssignments] = useState({});
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  const sortedPreferences = [...preferences].sort((a, b) => {
    const rankDiff = RANK_PRIORITY[a.rank] - RANK_PRIORITY[b.rank];
    if (rankDiff !== 0) return rankDiff;

    // Secondary: Preference Rank (by first preference choice)
    const aPrefRank = Math.min(...a.preferences.map(p => PREFERENCE_PRIORITY[p.choice]));
    const bPrefRank = Math.min(...b.preferences.map(p => PREFERENCE_PRIORITY[p.choice]));
    if (aPrefRank !== bPrefRank) return aPrefRank - bPrefRank;

    // Tertiary: Current Load (lower load first)
    return a.currentLoad - b.currentLoad;
  });

  const handleAssignCourse = (facultyId, course) => {
    setAssignments(prev => ({
      ...prev,
      [facultyId]: [...(prev[facultyId] || []), course]
    }));
    setPreferences(prev => prev.map(f =>
      f.facultyId === facultyId ? { ...f, currentLoad: f.currentLoad + 4 } : f
    ));
  };

  const handleUnassignCourse = (facultyId, course) => {
    setAssignments(prev => ({
      ...prev,
      [facultyId]: prev[facultyId].filter(c => c !== course)
    }));
    setPreferences(prev => prev.map(f =>
      f.facultyId === facultyId ? { ...f, currentLoad: f.currentLoad - 4 } : f
    ));
  };

  const getRankColor = (rank) => {
    switch(rank) {
      case "Professor": return "#d4af37";
      case "Associate Professor": return "#c0c0c0";
      case "Assistant Professor": return "#cd7f32";
      default: return "#999";
    }
  };

  const getPreferenceLabel = (choice) => {
    return choice === "choice1" ? "🥇 Choice I" : choice === "choice2" ? "🥈 Choice II" : "🥉 Choice III";
  };

  return (
    <div style={{  maxWidth: "1400px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1 className="bg-amber-50 h-12">Admin Dashboard - Faculty Assignment</h1>
      
      <div style={{ backgroundColor: "#f0f8ff", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
        <p style={{ margin: "5px 0" }}>
          <strong>Total Faculty:</strong> {sortedPreferences.length} | 
          <strong style={{ marginLeft: "20px" }}>Assignments Made:</strong> {Object.values(assignments).flat().length}
        </p>
        <p style={{ margin: "5px 0", fontSize: "0.9em", color: "#666" }}>
          Sorted by: Faculty Rank → Preference Priority → Current Load
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Faculty Preferences List */}
        <div>
          <h3>Faculty Preferences</h3>
          <div style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", overflow: "hidden" }}>
            {sortedPreferences.map((faculty, idx) => (
              <div key={faculty.facultyId} style={{ borderBottom: "1px solid #ddd" }}>
                <div
                  onClick={() => setSelectedFaculty(selectedFaculty === faculty.facultyId ? null : faculty.facultyId)}
                  style={{
                    padding: "15px",
                    cursor: "pointer",
                    backgroundColor: selectedFaculty === faculty.facultyId ? "#e3f2fd" : "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderLeft: `4px solid ${getRankColor(faculty.rank)}`
                  }}
                >
                  <div>
                    <p style={{ margin: "5px 0", fontWeight: "bold" }}>
                      {idx + 1}. {faculty.name}
                    </p>
                    <p style={{ margin: "2px 0", fontSize: "0.85em", color: "#666" }}>
                      {faculty.rank} | Current Load: {faculty.currentLoad} CLH | Assigned: {(assignments[faculty.facultyId] || []).length} courses
                    </p>
                  </div>
                  <span style={{ fontSize: "1.2em" }}>{selectedFaculty === faculty.facultyId ? "−" : "+"}</span>
                </div>

                {selectedFaculty === faculty.facultyId && (
                  <div style={{ padding: "15px", backgroundColor: "#fafafa", borderTop: "1px solid #ddd" }}>
                    {faculty.preferences.map(pref => (
                      <div key={pref.choice} style={{ marginBottom: "12px" }}>
                        <p style={{ margin: "5px 0", fontWeight: "bold", fontSize: "0.9em" }}>
                          {getPreferenceLabel(pref.choice)}
                        </p>
                        <div style={{ marginLeft: "15px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {pref.courses.map(course => (
                            <span
                              key={course}
                              style={{
                                backgroundColor: (assignments[faculty.facultyId] || []).includes(course) ? "#4CAF50" : "#e0e0e0",
                                color: (assignments[faculty.facultyId] || []).includes(course) ? "white" : "#333",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "0.85em",
                                cursor: "pointer"
                              }}
                              onClick={() => {
                                if ((assignments[faculty.facultyId] || []).includes(course)) {
                                  handleUnassignCourse(faculty.facultyId, course);
                                } else {
                                  handleAssignCourse(faculty.facultyId, course);
                                }
                              }}
                            >
                              {course} {(assignments[faculty.facultyId] || []).includes(course) ? "✓" : "+"}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3>Current Assignments</h3>
          <div style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", padding: "15px", maxHeight: "600px", overflowY: "auto" }}>
            {sortedPreferences.length === 0 ? (
              <p style={{ color: "#999" }}>No assignments yet</p>
            ) : (
              sortedPreferences.map(faculty => {
                const facultyAssignments = assignments[faculty.facultyId] || [];
                if (facultyAssignments.length === 0) return null;

                return (
                  <div key={faculty.facultyId} style={{ marginBottom: "15px", paddingBottom: "15px", borderBottom: "1px solid #ddd" }}>
                    <p style={{ margin: "5px 0", fontWeight: "bold", fontSize: "0.9em" }}>
                      {faculty.name}
                    </p>
                    <div style={{ marginLeft: "10px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {facultyAssignments.map(course => (
                        <div
                          key={course}
                          style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "0.85em",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px"
                          }}
                        >
                          {course}
                          <span
                            onClick={() => handleUnassignCourse(faculty.facultyId, course)}
                            style={{ cursor: "pointer", fontWeight: "bold" }}
                          >
                            ×
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#fff3cd", borderRadius: "8px", borderLeft: "4px solid #ffc107" }}>
        <p style={{ margin: 0, fontSize: "0.9em" }}>
          <strong>💡 System Flags:</strong> Click on a faculty member to expand their preferences. Click courses to assign/unassign. The list is sorted by rank priority, preference order, and current load.
        </p>
      </div>
    </div>
  );
}