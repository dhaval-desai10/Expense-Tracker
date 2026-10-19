import mongoose from 'mongoose';
import Transaction from '../models/transaction.model.js';

// GET /api/transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({
      date: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
    });
  }
};

// GET /api/transactions/:id
export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID',
      });
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction',
    });
  }
};

// POST /api/transactions
export const createTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, note } = req.body;

    // Basic request validation
    if (typeof title !== 'string' || !title.trim() || title.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid transaction title',
      });
    }

    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number',
      });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be income or expense',
      });
    }

    if (typeof category !== 'string' || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category is required',
      });
    }

    if (
      category.trim().length > 50 ||
      (note !== undefined && (typeof note !== 'string' || note.length > 500))
    ) {
      return res.status(400).json({
        success: false,
        message: 'Category or note is too long or invalid',
      });
    }

    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Date must use YYYY-MM-DD format',
      });
    }

    const parsedDate = new Date(`${date}T00:00:00.000Z`);

    if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid transaction date',
      });
    }

    const transaction = await Transaction.create({
      title: title.trim(),
      amount,
      type,
      category: category.trim(),
      date: parsedDate,
      note: note?.trim() ?? '',
    });

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Create transaction error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to create transaction',
    });
  }
};
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID',
      });
    }

    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
      data: transaction,
    });
  } catch (error) {
    console.error('Delete transaction error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete transaction',
    });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, type, category, date, note } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID',
      });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      {
        title,
        amount,
        type,
        category,
        date,
        note,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction,
    });
  } catch (error) {
    console.error('Update transaction error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to update transaction',
    });
  }
};
