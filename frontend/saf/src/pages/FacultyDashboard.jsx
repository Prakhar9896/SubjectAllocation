import { useState, useEffect } from "react";

export default function FacultyDashboard({ facultyProfile }) {
  const [courses, setCourses] = useState([]);
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
  
  const [loading, setLoading] = useState(true);

  const isSenior =
    facultyProfile.rank === "Professor" ||
    facultyProfile.rank === "Associate Professor";

  useEffect(() => {
    fetch("/api/subjects")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch subjects", err);
        setLoading(false);
      });
  }, []);

  const calculateCLH = (selected) =>
    selected.reduce((sum, c) => sum + c.clh * (c.sections || 1), 0);

  const validateChoice = (selected) => {
    const totalCLH = calculateCLH(selected);
    if (totalCLH > facultyProfile.maxLoad) {
      return { error: "Load exceeds maximum allowed CLH" };
    }

    if (isSenior) {
      const labCount = selected.filter((c) => c.is_lab).length;
      if (labCount > 1) {
        return { error: "Senior faculty cannot select multiple lab courses" };
      }
    }

    const pgCount = selected.filter((c) => c.level === "PG").length;
    if (pgCount > 1) {
      return { error: "Cannot select more than one M.Tech course per choice" };
    }

    const hasElective = selected.some((c) => !c.is_core);
    const hasCore = selected.some((c) => c.is_core);

    if (hasElective && !hasCore) {
      return { warning: "Elective chosen without a core course" };
    }

    return {};
  };

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

  const handleSectionChange = (choiceKey, id, sections) => {
    setChoices((prev) => ({
      ...prev,
      [choiceKey]: prev[choiceKey].map((c) =>
        c.id === id ? { ...c, sections: Number(sections) } : c
      ),
    }));
  };

  const filteredCourses = courses
    .filter((c) => {
      if (filters.program && c.program !== filters.program) return false;
      if (filters.semester && c.semester !== Number(filters.semester))
        return false;
      if (filters.type === "core" && !c.is_core) return false;
      if (filters.type === "elective" && c.is_core) return false;
      if (filters.branch && c.branch !== filters.branch) return false;
      return true;
    })
    .sort((a, b) => {
      if (a.semester !== b.semester) return a.semester - b.semester;
      return a.branch.localeCompare(b.branch);
    });

  const handleSubmit = () => {
    fetch("/api/faculty/submit-choices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(choices),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to submit preferences");
        return res.json();
      })
      .then((data) => alert("Preferences saved successfully!"))
      .catch((err) => console.error(err));
  };

  if (loading) return <p>Loading subjects...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Faculty Dashboard</h2>
      <p>
        <strong>{facultyProfile.name}</strong> <br />
        {facultyProfile.rank} <br />
        Max Load: {facultyProfile.maxLoad} CLH
      </p>

      <h3>Filters</h3>
      <select
        onChange={(e) => setFilters({ ...filters, program: e.target.value })}
      >
        <option value="">All Programs</option>
        {[...new Set(courses.map((c) => c.program))].map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <select
        onChange={(e) =>
          setFilters({ ...filters, semester: e.target.value })
        }
      >
        <option value="">All Semesters</option>
        {[...new Set(courses.map((c) => c.semester))].map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
      >
        <option value="">All Types</option>
        <option value="core">Core</option>
        <option value="elective">Elective</option>
      </select>

      <select
        onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
      >
        <option value="">All Branches</option>
        {[...new Set(courses.map((c) => c.branch))].map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>

      <h3>Available Courses</h3>
      {filteredCourses.map((course) => (
        <div
          key={course.id}
          style={{
            borderBottom: "1px solid #ccc",
            marginBottom: "5px",
            paddingBottom: "5px",
          }}
        >
          <p>
            {course.program} | Sem {course.semester} | {course.name} |{" "}
            {course.is_core ? "Core" : "Elective"} | {course.clh} CLH
          </p>
          <button onClick={() => handleSelect("choice1", course)}>
            Add to Choice I
          </button>{" "}
          <button onClick={() => handleSelect("choice2", course)}>
            Add to Choice II
          </button>{" "}
          <button onClick={() => handleSelect("choice3", course)}>
            Add to Choice III
          </button>
        </div>
      ))}

      {Object.entries(choices).map(([key, selected]) => {
        const validation = validateChoice(selected);

        return (
          <div key={key} style={{ marginTop: "20px" }}>
            <h3>{key.toUpperCase()}</h3>
            <p>
              Total Load: {calculateCLH(selected)} / {facultyProfile.maxLoad} CLH
            </p>

            {validation.error && <p style={{ color: "red" }}>{validation.error}</p>}
            {validation.warning && <p style={{ color: "orange" }}>{validation.warning}</p>}

            {selected.map((c) => (
              <div key={c.id}>
                {c.name} — Sections:
                <input
                  type="number"
                  min="1"
                  value={c.sections}
                  onChange={(e) =>
                    handleSectionChange(key, c.id, e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        );
      })}

      <button
        disabled={Object.values(choices).some((c) => validateChoice(c).error)}
        style={{ marginTop: "30px", padding: "10px 20px" }}
        onClick={handleSubmit}
      >
        Submit Preferences
      </button>
    </div>
  );
}
