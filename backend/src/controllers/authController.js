import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// dummy data

const departments = [
  { id: "dept-001", code: "CSE", name: "Computer Science & Engineering", active: true },
  { id: "dept-002", code: "ECE", name: "Electronics & Communication Engineering", active: true },
  { id: "dept-003", code: "MECH", name: "Mechanical Engineering", active: true },
];

const programs = [
  { id: "prog-001", name: "Bachelor of Engineering", short_code: "BE", active: true },
  { id: "prog-002", name: "Master of Technology", short_code: "MTech", active: true },
];

// Pre-hashed password for dummy users is "password123"
const DUMMY_HASH = "$2b$12$HlNNY1VDCctihftqPjGY8.IxiMl5.46p8IvGMsAVgIH1MKqjBRDm2";

const users = [
  {
    id: "user-001",
    full_name: "Dr. Ramesh Kumar",
    email: "ramesh.kumar@college.edu",
    password_hash: DUMMY_HASH,
    role: "faculty",
    created_at: new Date("2024-01-10"),
  },
  {
    id: "user-002",
    full_name: "Prof. Sunita Sharma",
    email: "sunita.sharma@college.edu",
    password_hash: DUMMY_HASH,
    role: "faculty",
    created_at: new Date("2024-01-12"),
  },
  {
    id: "user-003",
    full_name: "Admin User",
    email: "admin@college.edu",
    password_hash: DUMMY_HASH,
    role: "admin",
    created_at: new Date("2024-01-01"),
  },
];

const facultyProfiles = [
  {
    id: "fp-001",
    user_id: "user-001",
    employee_id: "EMP101",
    designation: "Associate Professor",
    scale: "AGP-7000",
    department_id: "dept-001",
    experience_years: 10,
    max_workload: 18,
    status: "active",
    created_at: new Date("2024-01-10"),
  },
  {
    id: "fp-002",
    user_id: "user-002",
    employee_id: "EMP102",
    designation: "Assistant Professor",
    scale: "AGP-6000",
    department_id: "dept-002",
    experience_years: 5,
    max_workload: 18,
    status: "active",
    created_at: new Date("2024-01-12"),
  },
];

// POST /api/auth/register/faculty
export const registerFaculty = async (req, res) => {
  const {
    full_name,
    email,
    password,
    employee_id,
    designation,
    scale,
    department_id,
    experience_years,
    max_workload,
  } = req.body;

  if (!full_name || !email || !password || !employee_id || !designation || !department_id) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ success: false, message: "Email already registered." });
  }

  if (facultyProfiles.find((p) => p.employee_id === employee_id)) {
    return res.status(409).json({ success: false, message: "Employee ID already exists." });
  }

  // Validate department exists [Not needed if implemented as a dropdown]
  if (!departments.find((d) => d.id === department_id)) {
    return res.status(400).json({ success: false, message: "Invalid department_id." });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const userId = uuidv4();

  users.push({
    id: userId,
    full_name,
    email,
    password_hash: passwordHash,
    role: "faculty",
    created_at: new Date(),
  });

  facultyProfiles.push({
    id: uuidv4(),
    user_id: userId,
    employee_id,
    designation,
    scale: scale || null,
    department_id,
    experience_years: experience_years || 0,
    max_workload: max_workload || 18,
    status: "active",
    created_at: new Date(),
  });

  return res.status(201).json({
    success: true,
    message: "Faculty registered successfully.",
    user: { id: userId, full_name, email, role: "faculty" },
  });
};

// POST /api/auth/register/admin
export const registerAdmin = async (req, res) => {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "full_name, email, and password are required.",
    });
  }

  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ success: false, message: "Email already registered." });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const userId = uuidv4();

  users.push({
    id: userId,
    full_name,
    email,
    password_hash: passwordHash,
    role: "admin",
    created_at: new Date(),
  });

  return res.status(201).json({
    success: true,
    message: "Admin registered successfully.",
    user: { id: userId, full_name, email, role: "admin" },
  });
};

// POST /api/auth/login
export const login = async (req, res) => {
    console.log(await bcrypt.hash("password123", 12));
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email or password." });
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid email or password." });
  }

  let profile = null;
  if (user.role === "faculty") {
    const fp = facultyProfiles.find((p) => p.user_id === user.id);
    if (fp) {
      const dept = departments.find((d) => d.id === fp.department_id);
      profile = { ...fp, department_name: dept ? dept.name : null };
    }
  }

  return res.status(200).json({
    success: true,
    message: "Login successful.",
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      ...(profile && { profile }),
    },
  });
};

export const getData = () => ({ departments, users, facultyProfiles });