import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import Chart from 'chart.js/auto';

import { Transaction } from '../../../models/transaction.model';

@Component({
  selector: 'app-expense-charts',
  templateUrl: './expense-charts.html',
  styleUrl: './expense-charts.css',
})
export class ExpenseCharts implements AfterViewInit, OnChanges {
  @Input() transactions: Transaction[] = [];

  @ViewChild('categoryCanvas')
  categoryCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('comparisonCanvas')
  comparisonCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('monthlyCanvas')
  monthlyCanvas!: ElementRef<HTMLCanvasElement>;

  private viewReady = false;

  private categoryChart: Chart | null = null;

  private comparisonChart: Chart | null = null;

  private monthlyChart: Chart | null = null;

  /* ── Premium color palette for charts ── */
  private readonly chartColors = [
    '#818cf8', // Indigo
    '#34d399', // Emerald
    '#fbbf24', // Amber
    '#fb7185', // Rose
    '#a78bfa', // Violet
    '#22d3ee', // Cyan
    '#f472b6', // Pink
    '#60a5fa', // Blue
    '#4ade80', // Green
    '#f97316', // Orange
  ];

  /* ── Dark theme defaults for all charts ── */
  private readonly darkDefaults: Partial<any> = {
    color: '#94a3b8',
    borderColor: 'rgba(255, 255, 255, 0.06)',
  };

  ngAfterViewInit(): void {
    // Apply global dark defaults
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.06)';
    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";

    this.viewReady = true;
    this.renderCharts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transactions'] && this.viewReady) {
      this.renderCharts();
    }
  }

  private renderCharts(): void {
    this.destroyCharts();

    this.renderCategoryChart();
    this.renderComparisonChart();
    this.renderMonthlyChart();
  }

  private destroyCharts(): void {
    this.categoryChart?.destroy();
    this.comparisonChart?.destroy();
    this.monthlyChart?.destroy();

    this.categoryChart = null;
    this.comparisonChart = null;
    this.monthlyChart = null;
  }

  private renderCategoryChart(): void {
    const expenses = this.transactions.filter(
      (transaction) => transaction.type === 'expense',
    );

    const totals = new Map<string, number>();

    for (const transaction of expenses) {
      const category =
        transaction.category.trim() || 'Uncategorized';

      const currentTotal = totals.get(category) ?? 0;

      totals.set(category, currentTotal + transaction.amount);
    }

    const categories = Array.from(totals.keys());

    const amounts = Array.from(totals.values());

    this.categoryChart = new Chart(
      this.categoryCanvas.nativeElement,
      {
        type: 'doughnut',

        data: {
          labels: categories,

          datasets: [
            {
              label: 'Expenses',
              data: amounts,

              backgroundColor: this.chartColors.slice(0, categories.length),

              borderWidth: 2,
              borderColor: 'rgba(12, 14, 26, 0.8)',

              hoverBorderColor: 'rgba(255, 255, 255, 0.2)',
              hoverBorderWidth: 3,
              hoverOffset: 8,
            },
          ],
        },

        options: {
          responsive: true,
          maintainAspectRatio: false,

          cutout: '65%',

          animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1000,
            easing: 'easeOutQuart',
          },

          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 16,
                usePointStyle: true,
                pointStyle: 'circle',
                font: {
                  size: 12,
                  weight: 500,
                },
              },
            },

            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              titleColor: '#f1f5f9',
              bodyColor: '#cbd5e1',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              padding: 12,
              cornerRadius: 10,
              displayColors: true,
              callbacks: {
                label: (context) => {
                  const amount = Number(context.raw);

                  return ` ${context.label}: ${this.formatCurrency(amount)}`;
                },
              },
            },
          },
        },
      },
    );
  }

  private renderComparisonChart(): void {
    const income = this.transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0);

    const expenses = this.transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0);

    this.comparisonChart = new Chart(
      this.comparisonCanvas.nativeElement,
      {
        type: 'bar',

        data: {
          labels: ['Income', 'Expenses'],

          datasets: [
            {
              label: 'Amount',

              data: [income, expenses],

              backgroundColor: [
                'rgba(52, 211, 153, 0.7)',
                'rgba(251, 113, 133, 0.7)',
              ],

              hoverBackgroundColor: [
                'rgba(52, 211, 153, 0.9)',
                'rgba(251, 113, 133, 0.9)',
              ],

              borderRadius: 12,
              borderSkipped: false,

              maxBarThickness: 80,
            },
          ],
        },

        options: {
          responsive: true,
          maintainAspectRatio: false,

          animation: {
            duration: 1200,
            easing: 'easeOutQuart',
          },

          plugins: {
            legend: {
              display: false,
            },

            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              titleColor: '#f1f5f9',
              bodyColor: '#cbd5e1',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              padding: 12,
              cornerRadius: 10,
              callbacks: {
                label: (context) => {
                  return ` ${this.formatCurrency(Number(context.raw))}`;
                },
              },
            },
          },

          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                font: {
                  weight: 600,
                },
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.04)',
              },
              ticks: {
                callback: (value) => this.formatCompact(Number(value)),
              },
            },
          },
        },
      },
    );
  }

  private renderMonthlyChart(): void {
    const monthlyTotals = new Map<string, number>();

    for (const transaction of this.transactions) {
      if (transaction.type !== 'expense') {
        continue;
      }

      const month = transaction.date.slice(0, 7);

      if (!/^\d{4}-\d{2}$/.test(month)) {
        continue;
      }

      const currentTotal = monthlyTotals.get(month) ?? 0;

      monthlyTotals.set(
        month,
        currentTotal + transaction.amount,
      );
    }

    const months = Array.from(monthlyTotals.keys()).sort();

    const labels = months.map((month) => {
      const date = new Date(`${month}-01T00:00:00`);

      return date.toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric',
      });
    });

    const amounts = months.map(
      (month) => monthlyTotals.get(month) ?? 0,
    );

    // Create gradient fill
    const ctx = this.monthlyCanvas.nativeElement.getContext('2d');
    let gradient: CanvasGradient | string = 'rgba(129, 140, 248, 0.08)';
    if (ctx) {
      gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, 'rgba(129, 140, 248, 0.2)');
      gradient.addColorStop(1, 'rgba(129, 140, 248, 0.0)');
    }

    this.monthlyChart = new Chart(
      this.monthlyCanvas.nativeElement,
      {
        type: 'line',

        data: {
          labels,

          datasets: [
            {
              label: 'Monthly Expenses',

              data: amounts,

              borderColor: '#818cf8',

              backgroundColor: gradient,

              fill: true,

              tension: 0.4,

              pointRadius: 5,
              pointHoverRadius: 8,
              pointBackgroundColor: '#818cf8',
              pointBorderColor: 'rgba(12, 14, 26, 0.8)',
              pointBorderWidth: 3,
              pointHoverBackgroundColor: '#a5b4fc',
              pointHoverBorderColor: '#fff',

              borderWidth: 2.5,
            },
          ],
        },

        options: {
          responsive: true,
          maintainAspectRatio: false,

          animation: {
            duration: 1500,
            easing: 'easeOutQuart',
          },

          interaction: {
            intersect: false,
            mode: 'index',
          },

          plugins: {
            legend: {
              display: false,
            },

            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              titleColor: '#f1f5f9',
              bodyColor: '#cbd5e1',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              padding: 12,
              cornerRadius: 10,
              callbacks: {
                label: (context) => {
                  return ` ${this.formatCurrency(Number(context.raw))}`;
                },
              },
            },
          },

          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                font: {
                  size: 11,
                },
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.04)',
              },
              ticks: {
                callback: (value) => this.formatCompact(Number(value)),
              },
            },
          },
        },
      },
    );
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  }

  private formatCompact(amount: number): string {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  }
}