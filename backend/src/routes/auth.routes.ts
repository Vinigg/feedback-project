import express from 'express';

import { login } from '../controllers/auth.controller';

const router = express.Router();

// POST /api/auth/login

router.post('/login', login);

export default router;