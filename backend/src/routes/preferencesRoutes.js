import express from 'express';
import auth from '../middleware/auth.js';
import { 
  submitPreferences, 
  getMyPreferences 
} from '../controllers/preferences.controller.js';

const router = express.Router();


router.post('/', auth, submitPreferences);

// GET /api/preferences
router.get('/', auth, getMyPreferences);

export default router;
