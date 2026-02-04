import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FacultyProfile.css";
import logo from "../assets/manipal-logo.png";

export default function FacultyProfile() {
  const navigate = useNavigate();

  const [faculty, setFaculty] = useState(null);
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profileRes = await fetch("/api/faculty/me", {
          credentials: "include",
        });
        const profileData = await profileRes.json();

        const choiceRes = await fetch("/api/faculty/choices", {
          credentials: "include",
        });
        const choiceData = await choiceRes.json();

        setFaculty(profileData);
        setChoices(Array.isArray(choiceData) ? choiceData : []);
      } catch (err) {
        console.error("Profile load failed", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) return <div className="profile-loading">Loading...</div>;

  const demoChoices = [
    {
      subject: "Operating Systems",
      clh: 3,
      sections: 4,
      program: "B.Tech",
      semester: 6,
    },
    {
      subject: "Database Management Systems",
      clh: 3,
      sections: 3,
      program: "B.Tech",
      semester: 5,
    },
  ];

  const displayChoices = choices.length ? choices : demoChoices;

  const assignedCourses = [
    "Sem 6 Operating Systems – IT Section A,B",
    "Sem 5 DBMS – CSE Section C",
  ];

  return (
    <div className="profile-page">

      {/* Navbar */}
      <nav className="profile-navbar">
        <div className="nav-left">
          <img src={logo} alt="Manipal Logo" className="nav-logo" />
          <span className="nav-title"></span>
        </div>

        <button
          className="nav-dashboard-btn"
          onClick={() => navigate("/fdb")}
        >
          Go to Dashboard
        </button>
      </nav>

      <div className="profile-container">

        {/* Profile Card */}
        <section className="big-card">
          <h3></h3>

          <div className="profile-grid">
            <div>
              <strong>Name</strong>
              <p>{faculty?.name || "Dr. A Sharma"}</p>
            </div>
            <div>
              <strong>Designation</strong>
              <p>{faculty?.designation || "Professor"}</p>
            </div>
            <div>
              <strong>Scale</strong>
              <p>{faculty?.scale || "Senior Scale"}</p>
            </div>
          </div>
        </section>

        {/* Selected Choices */}
        <section className="big-card">
          <h3 className = "profile-section-title">Selected Choices</h3>

          {displayChoices.map((choice, idx) => (
            <div className="choice-card" key={idx}>
              <h4>{choice.subject}</h4>
              <p>
                {choice.clh} CLH • {choice.sections} Sections •{" "}
                {choice.program} • Sem {choice.semester}
              </p>
            </div>
          ))}
        </section>

        {/* Assigned Courses */}
        <section className="big-card">
          <h3 className = "profile-section-title">Assigned Courses</h3>

          {assignedCourses.map((course, i) => (
            <div className="assigned-card" key={i}>
              {course}
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}
