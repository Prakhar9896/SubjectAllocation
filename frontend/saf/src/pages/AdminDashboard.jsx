import { useState } from "react";

const RANK_PRIORITY = {
  Professor: 1,
  "Associate Professor": 2,
  "Assistant Professor": 3,
};

const PREFERENCE_PRIORITY = {
  choice1: 1,
  choice2: 2,
  choice3: 3,
};

const DUMMY_FACULTY_PREFERENCES = [
  {
    facultyId: 1,
    name: "Dr. Sarah Johnson",
    rank: "Associate Professor",
    currentLoad: 12,
    preferences: [
      { choice: "choice1", courses: ["Data Structures", "Web Development"] },
      { choice: "choice2", courses: ["Algorithms"] },
      { choice: "choice3", courses: ["Database Systems"] },
    ],
  },
  {
    facultyId: 2,
    name: "Prof. Michael Chen",
    rank: "Professor",
    currentLoad: 8,
    preferences: [
      { choice: "choice1", courses: ["Machine Learning"] },
      { choice: "choice2", courses: ["Cloud Computing"] },
      { choice: "choice3", courses: ["Signal Processing"] },
    ],
  },
  {
    facultyId: 3,
    name: "Dr. Emily Watson",
    rank: "Assistant Professor",
    currentLoad: 15,
    preferences: [
      { choice: "choice1", courses: ["VLSI Design"] },
      { choice: "choice2", courses: ["Database Systems", "Algorithms"] },
      { choice: "choice3", courses: ["Web Development"] },
    ],
  },
  {
    facultyId: 4,
    name: "Prof. Rajesh Kumar",
    rank: "Professor",
    currentLoad: 20,
    preferences: [
      { choice: "choice1", courses: ["Signal Processing"] },
      { choice: "choice2", courses: ["Data Structures"] },
      { choice: "choice3", courses: ["Cloud Computing"] },
    ],
  },
  {
    facultyId: 5,
    name: "Dr. Lisa Anderson",
    rank: "Associate Professor",
    currentLoad: 18,
    preferences: [
      { choice: "choice1", courses: ["Machine Learning", "Cloud Computing"] },
      { choice: "choice2", courses: ["VLSI Design"] },
      { choice: "choice3", courses: ["Algorithms"] },
    ],
  },
];

export default function AdminDashboard() {
  const [preferences, setPreferences] = useState(DUMMY_FACULTY_PREFERENCES);
  const [assignments, setAssignments] = useState({});
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const sortedPreferences = [...preferences].sort((a, b) => {
    const rankDiff = RANK_PRIORITY[a.rank] - RANK_PRIORITY[b.rank];
    if (rankDiff !== 0) return rankDiff;

    const aPrefRank = Math.min(
      ...a.preferences.map((p) => PREFERENCE_PRIORITY[p.choice]),
    );
    const bPrefRank = Math.min(
      ...b.preferences.map((p) => PREFERENCE_PRIORITY[p.choice]),
    );
    if (aPrefRank !== bPrefRank) return aPrefRank - bPrefRank;

    return a.currentLoad - b.currentLoad;
  });

  const handleAssignCourse = (facultyId, course) => {
    setAssignments((prev) => ({
      ...prev,
      [facultyId]: [...(prev[facultyId] || []), course],
    }));

    setPreferences((prev) =>
      prev.map((f) =>
        f.facultyId === facultyId
          ? { ...f, currentLoad: f.currentLoad + 4 }
          : f,
      ),
    );
  };

  const handleUnassignCourse = (facultyId, course) => {
    setAssignments((prev) => ({
      ...prev,
      [facultyId]: prev[facultyId].filter((c) => c !== course),
    }));

    setPreferences((prev) =>
      prev.map((f) =>
        f.facultyId === facultyId
          ? { ...f, currentLoad: f.currentLoad - 4 }
          : f,
      ),
    );
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case "Professor":
        return "#d4af37";
      case "Associate Professor":
        return "#c0c0c0";
      case "Assistant Professor":
        return "#cd7f32";
      default:
        return "#999";
    }
  };

  const getPreferenceLabel = (choice) =>
    choice === "choice1"
      ? "Choice I"
      : choice === "choice2"
        ? "Choice II"
        : "Choice III";

  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Admin Dashboard - Faculty Assignment</h1>

      <div
        style={{
          backgroundColor: "#f0f8ff",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <p>
          <strong>Total Faculty:</strong> {sortedPreferences.length} |{" "}
          <strong>Assignments Made:</strong>{" "}
          {Object.values(assignments).flat().length}
        </p>
        <p style={{ fontSize: "0.9em", color: "#666" }}>
          Sorted by: Faculty Rank → Preference Priority → Current Load
        </p>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* LEFT COLUMN */}
        <div>
          <h3>Faculty Preferences</h3>
          <div style={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
            {sortedPreferences.map((faculty, idx) => (
              <div
                key={faculty.facultyId}
                style={{ borderBottom: "1px solid #ddd" }}
              >
                <div
                  onClick={() =>
                    setSelectedFaculty(
                      selectedFaculty === faculty.facultyId
                        ? null
                        : faculty.facultyId,
                    )
                  }
                  style={{
                    padding: "15px",
                    cursor: "pointer",
                    backgroundColor:
                      selectedFaculty === faculty.facultyId
                        ? "#e3f2fd"
                        : "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    borderLeft: `4px solid ${getRankColor(faculty.rank)}`,
                  }}
                >
                  <div>
                    <p style={{ fontWeight: "bold" }}>
                      {idx + 1}. {faculty.name}
                    </p>
                    <p style={{ fontSize: "0.85em", color: "#666" }}>
                      {faculty.rank} | Load: {faculty.currentLoad} CLH
                    </p>
                  </div>
                  <span>
                    {selectedFaculty === faculty.facultyId ? "−" : "+"}
                  </span>
                </div>

                {selectedFaculty === faculty.facultyId && (
                  <div style={{ padding: "15px", backgroundColor: "#fafafa" }}>
                    {faculty.preferences.map((pref) => (
                      <div key={pref.choice}>
                        <p style={{ fontWeight: "bold", fontSize: "0.9em" }}>
                          {getPreferenceLabel(pref.choice)}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                          }}
                        >
                          {pref.courses.map((course) => {
                            const assigned = (
                              assignments[faculty.facultyId] || []
                            ).includes(course);
                            return (
                              <span
                                key={course}
                                onClick={() =>
                                  assigned
                                    ? handleUnassignCourse(
                                        faculty.facultyId,
                                        course,
                                      )
                                    : handleAssignCourse(
                                        faculty.facultyId,
                                        course,
                                      )
                                }
                                style={{
                                  backgroundColor: assigned
                                    ? "#4CAF50"
                                    : "#e0e0e0",
                                  color: assigned ? "white" : "#333",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                }}
                              >
                                {course} {assigned ? "✓" : "+"}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <h3>Current Assignments</h3>

          <div
            style={{
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              padding: "15px",
              maxHeight: "600px",
              overflowY: "auto",
            }}
          >
            {sortedPreferences.map((faculty) => {
              const facultyAssignments = assignments[faculty.facultyId] || [];
              if (facultyAssignments.length === 0) return null;

              return (
                <div key={faculty.facultyId} style={{ marginBottom: "15px" }}>
                  <p style={{ fontWeight: "bold" }}>{faculty.name}</p>
                  <div
                    style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}
                  >
                    {facultyAssignments.map((course) => (
                      <div
                        key={course}
                        style={{
                          backgroundColor: "#4CAF50",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          display: "flex",
                          gap: "5px",
                        }}
                      >
                        {course}
                        <span
                          onClick={() =>
                            handleUnassignCourse(faculty.facultyId, course)
                          }
                          style={{ cursor: "pointer", fontWeight: "bold" }}
                        >
                          ×
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* APPROVE BUTTON */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <button
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "12px 28px",
                fontSize: "1rem",
                fontWeight: "bold",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#2e7d32")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#4CAF50")}
              onClick={() => console.log("Approved:", assignments)}
            >
              Approve Changes
            </button>
          </div>
        </div>
      </div>

      {/* SYSTEM FLAGS */}
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#fff3cd",
          borderRadius: "8px",
          borderLeft: "4px solid #ffc107",
        }}
      >
        <strong>💡 System Flags:</strong> Click faculty → assign/unassign
        courses.
      </div>
    </div>
  );
}
