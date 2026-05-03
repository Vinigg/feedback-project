import express from 'express';

import { login } from '../controllers/auth.controller';

const router = express.Router();

// POST /api/auth/login - Rota de login

router.post('/login', login);

export default router;