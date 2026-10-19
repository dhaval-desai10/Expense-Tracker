import { Router } from 'express';

import {
  getTransactions,
  getTransactionById,
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from '../controllers/transaction.controller.js';

const router = Router();

router.get('/', getTransactions);

router.get('/:id', getTransactionById);

router.post('/', createTransaction);
router.delete('/:id', deleteTransaction);
router.put('/:id', updateTransaction);
export default router;
