import logo from "../assets/manipal-logo.png";

export default function RoleSelector() {
  return (
    <>
      {/* TOP BAR */}
      <div className="topbar">
        <img src={logo} alt="Manipal Logo" className="logo" />
      </div>

      {/* MAIN SPLIT SCREEN */}
      <div className="container">
        {/* LEFT SECTION */}
        <div className="left">
          <h1>Subject Allocation<br />Management System</h1>
          <p>
            Official academic portal for faculty and administrators of
            Manipal Institute of Technology.
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="right">
          <div className="card">
            <h2>Sign in</h2>
            <p>Select your login role</p>

            <button className="primary-btn">Faculty Login</button>
            <button className="secondary-btn">Administrator Login</button>
          </div>
        </div>
      </div>
    </>
  );
}
