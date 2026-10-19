import { Component, output, inject, input, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Transaction, TransactionType } from '../../../models/transaction.model';
import { TransactionServe } from '../../../core/services/transaction-serve';

@Component({
  selector: 'app-transaction-form',
  imports: [ReactiveFormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.css',
})
export class TransactionForm {
  private formBuilder = inject(FormBuilder);

  transactionSaved = output<Transaction>();
  cancelled = output<void>();

  private transactionService = inject(TransactionServe);

  transactionForm = this.formBuilder.nonNullable.group({
    title: ['', Validators.required],

    amount: [0, [Validators.required, Validators.min(0.01)]],

    type: ['expense' as TransactionType, Validators.required],

    category: ['', Validators.required],

    date: [new Date().toISOString().slice(0, 10), Validators.required],

    note: [''],
  });

  categories = [
    'Food',
    'Travel',
    'Shopping',
    'Bills',
    'Salary',
    'Freelance',
    'Entertainment',
    'Health',
    'Education',
    'Other',
  ];

  transaction = input<Transaction | null>(null);

  constructor() {
    effect(() => {
      const transaction = this.transaction();
      if (!transaction) {
        return;
      }
      this.transactionForm.patchValue({
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        date: transaction.date.slice(0, 10),
        note: transaction.note ?? '',
      });
    });
  }

  saveTransaction(): void {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    const formValue = this.transactionForm.getRawValue();

    const selectedTransaction = this.transaction();

    const transactionData: Transaction = {
      id: selectedTransaction?.id ?? crypto.randomUUID(),
      title: formValue.title,
      amount: Number(formValue.amount),
      type: formValue.type,
      category: formValue.category,
      date: formValue.date,
      note: formValue.note ?? '',
    };

    if (selectedTransaction) {
      this.transactionService.updateTransaction(selectedTransaction.id, transactionData).subscribe({
        next: (response) => {
          const updatedTransaction: Transaction = {
            ...response.data,
            id:
              (response.data as typeof response.data & { _id?: string })._id ??
              selectedTransaction.id,
            date: transactionData.date,
          };
          
          this.transactionService.updateSavedTransaction(
            selectedTransaction.id,
            updatedTransaction,
          );

          this.transactionSaved.emit(updatedTransaction);
        },
        error: (error) => {
          console.error('Failed to update transaction:', error);
        },
      });
    } else {
      // ADD a new transaction
      this.transactionService.addTransaction(transactionData).subscribe({
        next: (response) => {
          const savedTransaction: Transaction = {
            ...response.data,
            id:
              (response.data as typeof response.data & { _id?: string })._id ?? transactionData.id,
            date: transactionData.date,
          };

          this.transactionService.addSavedTransaction(savedTransaction);
          this.transactionSaved.emit(savedTransaction);

          this.transactionForm.reset({
            type: 'expense',
            category: '',
            date: new Date().toISOString().slice(0, 10),
            title: '',
            amount: 0,
            note: '',
          });
        },
        error: (error) => {
          console.error('Failed to save transaction:', error);
        },
      });
    }
  }
  cancelForm() {
    this.cancelled.emit();
  }
}
