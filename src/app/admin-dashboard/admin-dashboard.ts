import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective, provideCharts } from 'ng2-charts';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartType,
  ChartConfiguration,
  BarController
} from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { verticalHoverPlugin } from '../plugins/chart-plugin';
import {
  DashboardPayable,
  DashboardReceivable,
  DashboardSnapshotCard,
  MisDashboardResponse,
  MisService
} from '../services/mis';

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  verticalHoverPlugin,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [provideCharts()],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.less']
})
export class AdminDashboard implements OnInit {
  availableMonths: string[] = [];
  selectedMonth = '';
  lastUpdated = '';
  isLoading = false;
  loadError = '';

  overdueReceivables: DashboardReceivable[] = [];
  upcomingPayables: DashboardPayable[] = [];

  snapshotCards: DashboardSnapshotCard[] = [
    { title: 'Net Profit', value: '₹ 4,25,78,000', change: '3.2%', subtitle: 'vs. previous month', color: 'blue', icon: 'attach_money', trend: 'up' },
    { title: 'Cash Profit', value: '₹ 37,00,000', change: '2%', subtitle: 'vs. previous month', color: 'green', icon: 'calendar_today', trend: 'up' },
    { title: 'EBIDTA', value: '₹ 73,50,000', change: '8.5%', subtitle: 'vs. previous month', color: 'orange', icon: 'error_outline', trend: 'down' },
    { title: 'Gross Profit', value: '₹ 61,45,000', change: '12.3%', subtitle: 'vs. previous month', color: 'purple', icon: 'email', trend: 'up' },
    { title: 'Sales', value: '₹18,20,000', icon: 'payments', change: '5.1%', subtitle: 'vs. previous month', color: 'teal', trend: 'up' },
    { title: 'Receivables', value: '₹12,80,000', icon: 'credit_card', change: '2.4%', subtitle: 'vs. previous month', color: 'pink', trend: 'up' },
    { title: 'Purchase', value: '₹12,467', icon: 'description', change: '9%', subtitle: 'vs. previous month', color: 'indigo', trend: 'up' },
    { title: 'Payables', value: '₹96,990/mo', icon: 'currency_rupee', change: '1.2%', subtitle: 'vs. previous month', color: 'lime', trend: 'down' }
  ];

  barChartType: ChartType = 'bar';

  barChartData: ChartConfiguration['data'] = {
    labels: [
      'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5',
      'Week 6', 'Week 7', 'Week 8', 'Week 9',
      'Week 10', 'Week 11', 'Week 12', 'Week 13'
    ],
    datasets: [
      {
        label: 'Inflow',
        data: [
          120000, 95000, 130000, 85000, 110000, 78000,
          125000, 98000, 112000, 140000, 90000, 115000, 122000
        ],
        backgroundColor: 'rgb(16, 185, 129)',
        barPercentage: 0.6,
        categoryPercentage: 0.7
      },
      {
        label: 'Net',
        data: [
          25000, -10000, 30000, 12000, 15000, -5000,
          18000, 8000, -2000, 22000, 9000, 11000, 14000
        ],
        backgroundColor: '#3B82F6',
        barPercentage: 0.6,
        categoryPercentage: 0.7
      },
      {
        label: 'Outflow',
        data: [
          -90000, -110000, -95000, -75000, -105000, -88000,
          -115000, -100000, -120000, -110000, -85000, -98000, -105000
        ],
        backgroundColor: '#EF4444',
        barPercentage: 0.6,
        categoryPercentage: 0.7
      }
    ]
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    scales: {
      y: {
        min: -140000,
        max: 140000,
        ticks: {
          stepSize: 70000,
          callback: (value: string | number) => {
            const num = Number(value);

            if (num === 0) return '₹0';
            const abs = Math.abs(num);

            if (abs === 70000) return num > 0 ? '₹70K' : '-₹70K';
            if (abs === 140000) return num > 0 ? '₹1.4L' : '-₹1.4L';

            return '';
          },
          color: '#6B7280',
          font: { size: 12 }
        },
        grid: {
          color: '#E5E7EB',
          ...({ borderDash: [4, 4] } as any)
        },
        border: {
          display: false
        }
      },
      x: {
        ticks: {
          color: '#6B7280',
          font: { size: 12 },
          callback: function (_value, index) {
            return `Week${index + 1}`;
          }
        },
        grid: {
          display: false
        }
      }
    },
    plugins: {
      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        titleColor: '#111827',
        bodyColor: '#111827',
        cornerRadius: 8,
        padding: 14,
        displayColors: false,
        titleFont: {
          size: 16,
          weight: 600
        },
        bodyFont: {
          size: 14,
          weight: 500
        },
        callbacks: {
          title: (items) => items[0].label,
          label: (context) => {
            const value = context.raw as number;
            const label = context.dataset.label || '';

            return `${label}: ₹${Math.abs(value).toLocaleString('en-IN')}`;
          },
          labelTextColor: (context) => {
            const label = context.dataset.label;

            if (label === 'Inflow') return '#22C55E';
            if (label === 'Outflow') return '#EF4444';
            if (label === 'Net') return '#3B82F6';
            return '#111827';
          },
          labelColor: (context) => {
            const label = context.dataset.label;

            if (label === 'Inflow') {
              return { borderColor: '#22C55E', backgroundColor: '#22C55E' };
            }
            if (label === 'Outflow') {
              return { borderColor: '#EF4444', backgroundColor: '#EF4444' };
            }
            if (label === 'Net') {
              return { borderColor: '#3B82F6', backgroundColor: '#3B82F6' };
            }
            return { borderColor: '#111827', backgroundColor: '#111827' };
          }
        }
      },
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          pointStyle: 'rect'
        }
      }
    }
  };

  constructor(private misService: MisService) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard(month = this.selectedMonth) {
    this.isLoading = true;
    this.loadError = '';

    this.misService.getDashboard(month).subscribe({
      next: (dashboard) => {
        this.applyDashboard(dashboard);
        this.isLoading = false;
      },
      error: () => {
        this.loadError = 'Dashboard data is unavailable. Showing the last local values.';
        this.isLoading = false;
      }
    });
  }

  onMonthChange(event: Event) {
    const month = (event.target as HTMLSelectElement).value;
    this.selectedMonth = month;
    this.loadDashboard(month);
  }

  refreshData() {
    this.loadDashboard(this.selectedMonth);
  }

  trendIcon(card: DashboardSnapshotCard) {
    if (card.trend === 'down') return 'arrow_downward';
    if (card.trend === 'flat') return 'remove';
    return 'arrow_upward';
  }

  private applyDashboard(dashboard: MisDashboardResponse) {
    this.availableMonths = dashboard.periods || [];
    this.selectedMonth = dashboard.selectedMonth || this.availableMonths[this.availableMonths.length - 1] || '';
    this.lastUpdated = this.formatDateTime(dashboard.updatedAt || dashboard.lastSyncedAt);
    this.snapshotCards = dashboard.snapshotCards?.length ? dashboard.snapshotCards : this.snapshotCards;
    this.overdueReceivables = dashboard.overdueReceivables || [];
    this.upcomingPayables = dashboard.upcomingPayables || [];

    if (dashboard.cashFlow) {
      this.barChartData = {
        labels: dashboard.cashFlow.labels,
        datasets: [
          { ...this.barChartData.datasets[0], data: dashboard.cashFlow.inflow },
          { ...this.barChartData.datasets[1], data: dashboard.cashFlow.net },
          { ...this.barChartData.datasets[2], data: dashboard.cashFlow.outflow }
        ]
      };
    }
  }

  private formatDateTime(value: string) {
    if (!value) return 'Not available';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  }
}
