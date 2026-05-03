import express from 'express';

import cors from 'cors';

import authRoutes from './routes/auth.routes';

const app = express();

const PORT = 3000;

// Middleware

app.use(cors());

app.use(express.json());

// Rotas

app.use('/api/auth', authRoutes);

// Iniciar servidor

app.listen(PORT, () => {

  console.log(`Servidor rodando na porta ${PORT}`);

});