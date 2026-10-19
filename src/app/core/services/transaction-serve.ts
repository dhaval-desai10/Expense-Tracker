import { computed, inject, Service } from '@angular/core';
import { signal } from '@angular/core';
import { Transaction } from '../../models/transaction.model';
import { TransactionApi } from './transaction-api';

@Service()
export class TransactionServe {
  private transactionsState = signal<Transaction[]>([
    {
      id: '1',
      title: 'Monthly Salary',
      category: 'Salary',
      date: '2026-10-01',
      amount: 30000,
      type: 'income',
    },
    {
      id: '2',
      title: 'Grocery Shopping',
      category: 'Food',
      date: '2026-10-03',
      amount: 2500,
      type: 'expense',
    },
  ]);

  transactions = this.transactionsState.asReadonly();

  private api = inject(TransactionApi);

  isLoading = signal(false);

  errorMessage = signal<string | null>(null);

  totalIncome = computed(() =>
    this.transactionsState()
      .filter((transaction) => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0),
  );

  totalExpenses = computed(() =>
    this.transactionsState()
      .filter((transaction) => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0),
  );

  totalBalance = computed(() => this.totalIncome() - this.totalExpenses());

  loadTransactions(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.api.getTransactions().subscribe({
      next: (response) => {
        const transactions = response.data.map((transaction) => ({
          ...transaction,
          id: (transaction as Transaction & { _id?: string })._id ?? transaction.id,
          date: transaction.date.slice(0, 10),
        }));

        this.transactionsState.set(transactions);
        this.isLoading.set(false);
      },

      error: (error) => {
        console.error('Failed to load transactions:', error);

        this.errorMessage.set('Unable to load transactions. Please check the backend server.');

        this.isLoading.set(false);
      },
    });
  }

 

  addTransaction(transaction: Transaction) {
    this.errorMessage.set(null);

    const { id, ...payload } = transaction;

    return this.api.createTransaction(payload);
  }
  addSavedTransaction(transaction: Transaction): void {
    this.transactionsState.update((transactions) => [transaction, ...transactions]);
  }

  deleteTransaction(id: string): void {
    this.errorMessage.set(null);

    this.api.deleteTransaction(id).subscribe({
      next: () => {
        this.transactionsState.update((transactions) =>
          transactions.filter((transaction) => transaction.id !== id),
        );
      },
      error: (error) => {
        console.error('Failed to delete transaction:', error);

        this.errorMessage.set('Unable to delete transaction. Please try again.');
      },
    });
  }

  updateTransaction(id: string, transaction: Transaction) {
    this.errorMessage.set(null);

    const { id: _id, ...payload } = transaction;

    return this.api.updateTransaction(id, payload);
  }
  updateSavedTransaction(id: string, updatedTransaction: Transaction): void {
    this.transactionsState.update((transactions) =>
      transactions.map((transaction) => (transaction.id === id ? updatedTransaction : transaction)),
    );
  }
}
