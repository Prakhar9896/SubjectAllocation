import express from 'express';
import dotenv from 'dotenv';
import preferencesRoutes from './routes/preferencesRoutes.js';

dotenv.config();

console.log("SERVER FILE LOADED");

const app = express();

app.use(express.json());
app.use('/api/preferences', preferencesRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
