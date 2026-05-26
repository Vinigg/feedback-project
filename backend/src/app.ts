import express from 'express';
import cors from 'cors';
import aiRoutes from './routes/ai.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/ai', aiRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;
