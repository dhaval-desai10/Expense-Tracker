import { Service } from '@angular/core';

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Transaction } from '../../models/transaction.model';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
}

@Service()
export class TransactionApi {
  private http = inject(HttpClient);

  private readonly apiUrl = 'http://10.234.51.70:3000/api/transactions';

  getTransactions(): Observable<ApiResponse<Transaction[]>> {
    return this.http.get<ApiResponse<Transaction[]>>(this.apiUrl);
  }

  createTransaction(transaction: Omit<Transaction, 'id'>): Observable<ApiResponse<Transaction>> {
    return this.http.post<ApiResponse<Transaction>>(this.apiUrl, transaction);
  }

  deleteTransaction(id: string): Observable<ApiResponse<Transaction>> {
    return this.http.delete<ApiResponse<Transaction>>(`${this.apiUrl}/${id}`);
  }
  updateTransaction(
    id: string,
    transacation: Omit<Transaction, 'id'>,
  ): Observable<ApiResponse<Transaction>> {
    return this.http.put<ApiResponse<Transaction>>(`${this.apiUrl}/${id}`, transacation);
  }
}
