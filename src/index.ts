import 'dotenv/config';
import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import mahasiswaRoutes from './routes/mahasiswa.js';
import produkRoutes from './routes/produk.js';

const app = express();
const port = Number(process.env.PORT ?? 5000);

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'REST API siap digunakan' });
});

app.use('/api/mahasiswa', mahasiswaRoutes);
app.use('/api/produk', produkRoutes);

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error('API error:', error);
  if (error instanceof SyntaxError && 'status' in error && error.status === 400) {
    res.status(400).json({ message: 'Format JSON tidak valid' });
    return;
  }
  if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
    res.status(409).json({ message: 'NIM sudah digunakan' });
    return;
  }
  res.status(500).json({ message: 'Terjadi kesalahan pada server' });
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
