import express from "express";
import { registerFaculty, registerAdmin, login, getData } from "../controllers/authController.js";

const router = express.Router();

// POST routes
router.post("/register/faculty", registerFaculty);
router.post("/register/admin", registerAdmin);
router.post("/login", login);

// GET routes for testing
router.get("/users", (req, res) => {
  res.json({ success: true, users: getData().users });
});

router.get("/departments", (req, res) => {
  res.json({ success: true, departments: getData().departments });
});

router.get("/faculty-profiles", (req, res) => {
  res.json({ success: true, facultyProfiles: getData().facultyProfiles });
});

export default router;