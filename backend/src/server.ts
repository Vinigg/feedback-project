import express from 'express';

import cors from 'cors';

const app = express();

const PORT = 3000;

// Middleware

app.use(cors());

app.use(express.json());

// Iniciar servidor

app.listen(PORT, () => {

  console.log(`Servidor rodando na porta ${PORT}`);

});
