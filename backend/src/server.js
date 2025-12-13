import dotenv from "dotenv";
import app from "./app.js";

// Load environment variables
dotenv.config();

// Define port
const PORT = process.env.PORT || 4000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
