import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import connectDB from './config/db.js';
import transactionRoutes from './routes/transaction.routes.js';

const app = express();

// Middleware

app.use(
  cors({
    origin: ['http://localhost:4200', 'http://10.234.51.70:4200'],
  }),
);

app.use(express.json());

// Health-check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Expense Tracker API is running',
  });
});

app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 3000;

// Start the server after connecting to MongoDB
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
