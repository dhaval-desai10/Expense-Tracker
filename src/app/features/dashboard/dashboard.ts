import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { TransactionForm } from '../transactions/transaction-form/transaction-form';
import { Transaction } from '../../models/transaction.model';
import { TransactionServe } from '../../core/services/transaction-serve';
import { single } from 'rxjs';
import { ExpenseCharts } from './expense-charts/expense-charts';

type TransactionFilter = 'all' | 'income' | 'expense';
type TransactionSort = 'newest' | 'oldest' | 'amountHigh' | 'amountLow' | 'title';

@Component({
  imports: [DatePipe, CurrencyPipe, TransactionForm, ExpenseCharts],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  appName = 'Expense Tracker';
  currentYear = new Date().getFullYear();

  transactionService = inject(TransactionServe);

  showTransactionForm = signal(false);

  selectedTransaction = signal<Transaction | null>(null);

  transacations = this.transactionService.transactions;

  totalIncome = this.transactionService.totalIncome;
  totalExpenses = this.transactionService.totalExpenses;
  totalBalance = this.transactionService.totalBalance;

  // Currently selected filter
  selectedFilter = signal<TransactionFilter>('all');

  // Search text entered by the user
  searchTerm = signal('');

  startDate = signal('');
  endDate = signal('');

  selectedSort = signal<TransactionSort>('newest');

  selectedCategory = signal('all');

  // Pagination & View Mode
  currentPage = signal(1);
  pageSize = signal(8);
  viewMode = signal<'table' | 'cards'>('table');

  categories = computed(() => {
    const categories = this.transacations()
      .map((transaction) => transaction.category.trim())
      .filter((category) => category.length > 0);

    return [...new Set(categories)].sort((a, b) => a.localeCompare(b));
  });

  spendingByCategory = computed(() => {
    const totals = new Map<string, number>();

    for (const transaction of this.transacations()) {
      if (transaction.type !== 'expense') {
        continue;
      }

      const category = transaction.category.trim() || 'Uncategorized';

      const currentTotal = totals.get(category) ?? 0;

      totals.set(category, currentTotal + transaction.amount);
    }

    return Array.from(totals, ([category, total]) => ({
      category,
      total,
    })).sort((a, b) => b.total - a.total);
  });

  // Transactions displayed according to the selected filter
  filteredTransactions = computed(() => {
    const transactions = this.transacations();
    const filter = this.selectedFilter();

    const category = this.selectedCategory();

    const search = this.searchTerm().trim().toLowerCase();

    const start = this.startDate();
    const end = this.endDate();

    const sort = this.selectedSort();

    // Step 1: Filter transactions
    const filtered = transactions.filter((transaction) => {
      const matchesType = filter === 'all' || transaction.type === filter;

      const matchesSearch = transaction.title.toLowerCase().includes(search);

      const transactionDate = transaction.date.slice(0, 10);

      const matchesStartDate = !start || transactionDate >= start;

      const matchesEndDate = !end || transactionDate <= end;

      const matchesCategory = category === 'all' || transaction.category === category;

      return matchesType && matchesSearch && matchesStartDate && matchesEndDate && matchesCategory;
    });

    // Step 2: Sort the filtered transactions
    return filtered.sort((a, b) => {
      switch (sort) {
        case 'newest':
          return b.date.localeCompare(a.date);

        case 'oldest':
          return a.date.localeCompare(b.date);

        case 'amountHigh':
          return b.amount - a.amount;

        case 'amountLow':
          return a.amount - b.amount;

        case 'title':
          return a.title.localeCompare(b.title);

        default:
          return 0;
      }
    });
  });

  // Total pages based on filtered transactions
  totalPages = computed(() => {
    const total = this.filteredTransactions().length;
    const size = this.pageSize();
    return Math.max(1, Math.ceil(total / size));
  });

  // Slice of transactions for current page
  paginatedTransactions = computed(() => {
    const transactions = this.filteredTransactions();
    const safePage = Math.min(Math.max(1, this.currentPage()), this.totalPages());
    const size = this.pageSize();
    const start = (safePage - 1) * size;
    return transactions.slice(start, start + size);
  });

  // 1-based start index of current page
  paginationStart = computed(() => {
    if (this.filteredTransactions().length === 0) return 0;
    const safePage = Math.min(Math.max(1, this.currentPage()), this.totalPages());
    return (safePage - 1) * this.pageSize() + 1;
  });

  // 1-based end index of current page
  paginationEnd = computed(() => {
    const start = this.paginationStart();
    if (start === 0) return 0;
    return Math.min(start + this.pageSize() - 1, this.filteredTransactions().length);
  });

  // Current page income & expense summary
  pageIncome = computed(() => {
    return this.paginatedTransactions()
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
  });

  pageExpense = computed(() => {
    return this.paginatedTransactions()
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
  });

  // Smart page numbers array for paginator
  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = Math.min(Math.max(1, this.currentPage()), total);
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - 2) pages.push('...');
      pages.push(total);
    }
    return pages;
  });

  ngOnInit(): void {
    this.transactionService.loadTransactions();
  }

  // Change the selected filter
  setFilter(filter: TransactionFilter): void {
    this.selectedFilter.set(filter);
    this.currentPage.set(1);
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  onCategoryChange(value: string): void {
    this.selectedCategory.set(value);
    this.currentPage.set(1);
  }

  onSortChange(value: TransactionSort): void {
    this.selectedSort.set(value);
    this.currentPage.set(1);
  }

  onStartDateChange(value: string): void {
    this.startDate.set(value);
    this.currentPage.set(1);
  }

  onEndDateChange(value: string): void {
    this.endDate.set(value);
    this.currentPage.set(1);
  }

  resetFilters(): void {
    this.searchTerm.set('');
    this.startDate.set('');
    this.endDate.set('');
    this.selectedFilter.set('all');
    this.selectedSort.set('newest');
    this.selectedCategory.set('all');
    this.currentPage.set(1);
  }

  goToPage(page: number | string): void {
    if (typeof page !== 'number') return;
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }

  changePageSize(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  setViewMode(mode: 'table' | 'cards'): void {
    this.viewMode.set(mode);
  }

  // Open the form for editing
  editTransaction(transaction: Transaction): void {
    this.selectedTransaction.set(transaction);
    this.showTransactionForm.set(true);
  }

  // Open the form for adding a new transaction
  startAddTransaction(): void {
    this.selectedTransaction.set(null);
    this.showTransactionForm.set(true);
  }
}

