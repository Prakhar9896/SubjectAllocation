import { useState } from "react";
import "./FacultyDashboard.css";
import logo from "../assets/manipal-logo.png";

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
    {
      id: 4,
      program: "B.Tech",
      semester: 5,
      name: "Database Management Systems",
      is_core: true,
      branch: "CSE",
      clh: 4,
    },
    {
      id: 5,
      program: "B.Tech",
      semester: 3,
      name: "Computer Networks",
      is_core: true,
      branch: "CSE",
      clh: 3,
    },
    {
      id: 6,
      program: "B.Tech",
      semester: 7,
      name: "Machine Learning",
      is_core: false,
      branch: "AI",
      clh: 3,
    },
    {
      id: 7,
      program: "B.Tech",
      semester: 5,
      name: "Software Engineering",
      is_core: true,
      branch: "CSE",
      clh: 4,
    },
    {
      id: 8,
      program: "B.Tech",
      semester: 4,
      name: "Theory of Computation",
      is_core: false,
      branch: "CSE",
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

  const [selectedChoice, setSelectedChoice] = useState("choice1");

  const calculateCLH = (selected) =>
    selected.reduce((sum, c) => sum + c.clh * (c.sections || 1), 0);

  const getTotalCLH = () => {
    return calculateCLH([
      ...choices.choice1,
      ...choices.choice2,
      ...choices.choice3,
    ]);
  };

  const isCourseSelected = (courseId) => {
    return (
      choices.choice1.some((c) => c.id === courseId) ||
      choices.choice2.some((c) => c.id === courseId) ||
      choices.choice3.some((c) => c.id === courseId)
    );
  };

  const getCourseChoiceLocation = (courseId) => {
    if (choices.choice1.some((c) => c.id === courseId)) return "choice1";
    if (choices.choice2.some((c) => c.id === courseId)) return "choice2";
    if (choices.choice3.some((c) => c.id === courseId)) return "choice3";
    return null;
  };

  const filteredCourses = courses.filter((c) => {
    if (filters.program && c.program !== filters.program) return false;
    if (filters.semester && c.semester !== Number(filters.semester))
      return false;
    if (filters.type === "core" && !c.is_core) return false;
    if (filters.type === "elective" && c.is_core) return false;
    if (filters.branch && c.branch !== filters.branch) return false;
    return true;
  });

  const handleAddCourse = (courseWithSections) => {
    setChoices((prev) => {
      if (prev[selectedChoice].some((c) => c.id === courseWithSections.id)) return prev;
      return {
        ...prev,
        [selectedChoice]: [...prev[selectedChoice], courseWithSections],
      };
    });
  };

  const handleRemove = (choiceKey, courseId) => {
    setChoices((prev) => ({
      ...prev,
      [choiceKey]: prev[choiceKey].filter((c) => c.id !== courseId),
    }));
  };

  const handleSubmit = () => {
    console.log("Submitted preferences:", choices);
    alert(`Preferences submitted successfully!\nTotal CLH: ${getTotalCLH()}`);
  };

  const handleClearAll = () => {
    setChoices({
      choice1: [],
      choice2: [],
      choice3: [],
    });
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-logo">
            <img 
              src={logo}
              alt="Manipal Academy of Higher Education" 
              className="logo-image"
            />
          </div>
          <div className="navbar-title">
            
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-flex">
            <div>
              <h1 className="header-title">Course Preference Selection</h1>
              <p className="header-subtitle">
                Select your preferred courses for the upcoming semester
              </p>
            </div>
            <div className="faculty-card">
              <div className="faculty-label">Faculty</div>
              <div className="faculty-name">{facultyProfile.name}</div>
              <div className="faculty-info">
                {facultyProfile.rank} • Max Load: {facultyProfile.maxLoad} CLH
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="main-grid">
          {/* LEFT - Filters */}
          <aside className="filters-panel">
            <div className="panel-header">
              <div className="panel-icon">
                <svg
                  className="icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </div>
              <h2 className="panel-title">Filters</h2>
            </div>

            <div className="filters-content">
              <div className="filter-group">
                <label className="filter-label">Program</label>
                <select
                  value={filters.program}
                  onChange={(e) =>
                    setFilters({ ...filters, program: e.target.value })
                  }
                  className="filter-select"
                >
                  <option value="">All Programs</option>
                  <option value="B.Tech">B.Tech</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Semester</label>
                <select
                  value={filters.semester}
                  onChange={(e) =>
                    setFilters({ ...filters, semester: e.target.value })
                  }
                  className="filter-select"
                >
                  <option value="">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value })
                  }
                  className="filter-select"
                >
                  <option value="">All Types</option>
                  <option value="core">Core</option>
                  <option value="elective">Elective</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Branch</label>
                <select
                  value={filters.branch}
                  onChange={(e) =>
                    setFilters({ ...filters, branch: e.target.value })
                  }
                  className="filter-select"
                >
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

              <button
                onClick={() =>
                  setFilters({ program: "", semester: "", type: "", branch: "" })
                }
                className="clear-filters-btn"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* CENTER - Available Courses */}
          <section className="courses-panel">
            <div className="courses-header">
              <div className="courses-header-flex">
                <div>
                  <h2 className="courses-title">Available Courses</h2>
                  <p className="courses-count">
                    {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""} available
                  </p>
                </div>
                <div className="add-hint">
                  Click + to add to{" "}
                  <span className="selected-choice-text">
                    {selectedChoice === "choice1"
                      ? "Choice 1"
                      : selectedChoice === "choice2"
                      ? "Choice 2"
                      : "Choice 3"}
                  </span>
                </div>
              </div>
            </div>

            <div className="courses-content">
              {filteredCourses.length > 0 ? (
                <div className="courses-grid">
                  {filteredCourses.map((course) => {
                    const isSelected = isCourseSelected(course.id);
                    const choiceLocation = getCourseChoiceLocation(course.id);
                    
                    return (
                      <div
                        key={course.id}
                        className={`course-card ${isSelected ? "course-selected" : ""}`}
                      >
                        <div className="course-card-content">
                          <div className="course-info">
                            <div className="course-header">
                              <div className="course-name">
                                {course.name}
                              </div>
                              <div className={`clh-badge ${isSelected ? "clh-selected" : ""}`}>
                                {course.clh} CLH
                              </div>
                            </div>

                            <div className="course-tags">
                              <span className="tag tag-program">
                                <svg
                                  className="tag-icon"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                </svg>
                                {course.program} • Sem {course.semester}
                              </span>
                              <span className={`tag ${course.is_core ? "tag-core" : "tag-elective"}`}>
                                {course.is_core ? "Core" : "Elective"}
                              </span>
                              <span className="tag tag-branch">
                                {course.branch}
                              </span>
                            </div>

                            {isSelected && (
                              <div className="selected-indicator">
                                <svg
                                  className="check-icon"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Added to{" "}
                                {choiceLocation === "choice1"
                                  ? "Choice 1"
                                  : choiceLocation === "choice2"
                                  ? "Choice 2"
                                  : "Choice 3"}
                              </div>
                            )}
                          </div>

                          <div className="course-actions">
                            {!isSelected && (
                              <div className="sections-input-group">
                                <label className="sections-label">Sections:</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  defaultValue="1"
                                  className="sections-input"
                                  id={`sections-${course.id}`}
                                />
                              </div>
                            )}
                            <button
                              onClick={() => {
                                const sectionsInput = document.getElementById(`sections-${course.id}`);
                                const sections = sectionsInput ? parseInt(sectionsInput.value) || 1 : 1;
                                handleAddCourse({ ...course, sections });
                              }}
                              disabled={isSelected}
                              className={`add-btn ${isSelected ? "add-btn-disabled" : ""}`}
                            >
                              {isSelected ? "✓" : "+"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg
                      className="icon"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="empty-title">No courses match your filters</p>
                  <p className="empty-subtitle">
                    Try adjusting your filter criteria
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* RIGHT - Preferences Panel */}
          <aside className="preferences-panel">
            <div className="preferences-header">
              <h2 className="preferences-title">My Preferences</h2>
              <div className="load-indicator">
                <div className="load-text">
                  <span>Total Load</span>
                  <span className="load-value">
                    {getTotalCLH()} / {facultyProfile.maxLoad} CLH
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(
                        (getTotalCLH() / facultyProfile.maxLoad) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Choice Selector Tabs */}
            <div className="choice-tabs">
              {["choice1", "choice2", "choice3"].map((key, index) => (
                <button
                  key={key}
                  onClick={() => setSelectedChoice(key)}
                  className={`choice-tab ${selectedChoice === key ? "choice-tab-active" : ""}`}
                >
                  Choice {index + 1}
                  {choices[key].length > 0 && (
                    <span className={`choice-badge ${selectedChoice === key ? "choice-badge-active" : ""}`}>
                      {choices[key].length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Choice Content */}
            <div className="choice-content">
              {["choice1", "choice2", "choice3"].map((key, index) => (
                <div
                  key={key}
                  className={selectedChoice === key ? "choice-visible" : "choice-hidden"}
                >
                  {choices[key].length > 0 ? (
                    <div className="selected-courses">
                      {choices[key].map((course) => (
                        <div key={course.id} className="selected-course-card">
                          <div className="selected-course-content">
                            <div className="selected-course-info">
                              <h4 className="selected-course-name">
                                {course.name}
                              </h4>
                              <div className="selected-course-details">
                                <span className="detail-clh">{course.clh} CLH</span>
                                <span>•</span>
                                <span>{course.sections || 1} Section{(course.sections || 1) > 1 ? 's' : ''}</span>
                                <span>•</span>
                                <span>{course.program}</span>
                                <span>•</span>
                                <span>Sem {course.semester}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemove(key, course.id)}
                              className="remove-btn"
                              title="Remove course"
                            >
                              <svg
                                className="icon"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="choice-total">
                        <div className="choice-total-content">
                          <span>Choice {index + 1} Total</span>
                          <span className="choice-total-value">
                            {calculateCLH(choices[key])} CLH
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-choice">
                      <div className="empty-choice-icon">
                        <svg
                          className="icon"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                      <p className="empty-choice-title">
                        No courses in Choice {index + 1}
                      </p>
                      <p className="empty-choice-subtitle">
                        Click + on courses to add them here
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button onClick={handleClearAll} className="clear-btn">
                Clear All Choices
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  choices.choice1.length === 0 &&
                  choices.choice2.length === 0 &&
                  choices.choice3.length === 0
                }
                className="submit-btn"
              >
                Submit Preferences
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}