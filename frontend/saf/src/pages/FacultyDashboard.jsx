import { useState } from "react";
import "./FacultyDashboard.css";

export default function FacultyDashboard({
  facultyProfile = {
    name: "Dr. A. Sharma",
    rank: "Professor",
    maxLoad: 14,
  },
}) {
  const [courses] = useState([
    {
      id: 1,
      program: "B.Tech",
      semester: 4,
      name: "Data Structures",
      is_core: true,
      branch: "CSE",
      clh: 4,
    },
    {
      id: 2,
      program: "B.Tech",
      semester: 6,
      name: "Operating Systems",
      is_core: true,
      branch: "CSE",
      clh: 3,
    },
    {
      id: 3,
      program: "M.Tech",
      semester: 2,
      name: "Advanced Algorithms",
      is_core: false,
      branch: "AI",
      clh: 3,
    },
  ]);

  const [filters, setFilters] = useState({
    program: "",
    semester: "",
    type: "",
    branch: "",
  });

  const [choices, setChoices] = useState({
    choice1: [],
    choice2: [],
    choice3: [],
  });

  const calculateCLH = (selected) =>
    selected.reduce((sum, c) => sum + c.clh * (c.sections || 1), 0);

  const handleSelect = (choiceKey, course) => {
    setChoices((prev) => {
      const exists = prev[choiceKey].find((c) => c.id === course.id);
      if (exists) return prev;
      return {
        ...prev,
        [choiceKey]: [...prev[choiceKey], { ...course, sections: 1 }],
      };
    });
  };

  const filteredCourses = courses.filter((c) => {
    if (filters.program && c.program !== filters.program) return false;
    if (filters.semester && c.semester !== Number(filters.semester)) return false;
    if (filters.type === "core" && !c.is_core) return false;
    if (filters.type === "elective" && c.is_core) return false;
    if (filters.branch && c.branch !== filters.branch) return false;
    return true;
  });

  const handleDragStart = (e,course) => {
    e.dataTransfer.effectAlloved="move";
    e.dataTransfer.setData("text/plain", course.id);
  };

  const handleDragOver =(e) => {
    e.preventDefault();
  };

const handleDrop = (e, choiceKey) => {
  e.preventDefault();

  const courseId = e.dataTransfer.getData("text/plain");
  if (!courseId) return;

  const course = courses.find((c) => c.id === Number(courseId));
  if (!course) return;

  setChoices((prev) => {
    if (prev[choiceKey].some((c) => c.id === course.id)) return prev;

    return {
      ...prev,
      [choiceKey]: [...prev[choiceKey], { ...course, sections: 1 }],
    };
  });
};
;

const handleRemove = (choiceKey, courseId) => {
  setChoices((prev) => ({
    ...prev,
    [choiceKey]: prev[choiceKey].filter((c) => c.id !== courseId),
  }));
};

  return (
    <div className="faculty-dashboard">
      <div className="header">
        <h2>Faculty Dashboard</h2>
        <p>
          <strong>{facultyProfile.name}</strong><br />
          {facultyProfile.rank} | Max Load: {facultyProfile.maxLoad} CLH
        </p>
      </div>

      <div className="filters">
        <select onChange={(e) => setFilters({ ...filters, program: e.target.value })}>
          <option value="">Program</option>
          <option>B.Tech</option>

        </select>

        <select onChange={(e) => setFilters({ ...filters, semester: e.target.value })}>
          <option value="">Semester</option>
          <option value="1">I</option>
          <option value="2">II</option>
          <option value="3">III</option>
          <option value="4">IV</option>
          <option value="5">V</option>
          <option value="6">VI</option>
          <option value="7">VII</option>
        </select>

        <select onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
          <option value="">Type</option>
          <option value="core">Core</option>
          <option value="elective">Elective</option>
        </select>

        <select onChange={(e) => setFilters({ ...filters, branch: e.target.value })}>
          <option value="">Branch</option>
          <option value="">All Branches</option>
          <option value="cse">CSE</option>
          <option value="aiml">CSE (AI&ML)</option>
          <option value="csis">CSIS</option>
          <option value="fintech">CSE & FIN-TECH</option>
          <option value="it">IT</option>
          <option value="cce">CCE</option>
          <option value="cne">CSE (Computer Networking and Engg.) </option>
          <option value="aids">CSE (AIDS)</option>
          <option value="cs">CSE(Cyber security)</option>
          <option value="dse">DSE</option>
        </select>
      </div>

      <h3>Available Courses</h3>

      <div className="layout">
  {/* LEFT COLUMN */}
  <div className="course-list">
    {filteredCourses.map((course) => (
      <div
        key={course.id}
        className="course-card"
        draggable
        onDragStart={(e) => handleDragStart(e, course)}
      >
        <p>
          {course.program} | Sem {course.semester} | {course.name} |{" "}
          {course.is_core ? "Core" : "Elective"} | {course.clh} CLH
        </p>
      </div>
    ))}
  </div>

  {/* RIGHT COLUMN */}
  <div className="sidebar choices">
    {["choice1", "choice2", "choice3"].map((key, index) => (
      <div
        key={key}
        className="choice-box"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, key)}
      >
        <h3>Choice {index + 1}</h3>

        {choices[key].length > 0 ? (
          choices[key].map((c) => (
            <div key={c.id} className="selected-item">
              {c.name}
            </div>
          ))
        ) : (
          <div className="empty">Drop courses here</div>
        )}
      </div>
    ))}
  </div>
</div>

      </div>
  );
}
