import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MisService, StockRow } from '../services/mis';

@Component({
  selector: 'app-stock',
  imports: [CommonModule, MatTableModule],
  templateUrl: './stock.html',
  styleUrl: './stock.less',
})
export class Stock implements OnInit {
  displayedStockColumns = ['particulars', 'dec25'];

  stockData: StockRow[] = [];
  agingData: StockRow[] = [];
  period = 'Dec-25';
  lastUpdated = '';
  isLoading = false;
  loadError = '';

  constructor(private misService: MisService) {}

  ngOnInit() {
    this.loadStock();
  }

  loadStock() {
    this.isLoading = true;
    this.loadError = '';

    this.misService.getStock().subscribe({
      next: (response) => {
        this.period = response.period || this.period;
        this.stockData = response.data?.stock || [];
        this.agingData = response.data?.aging || [];
        this.lastUpdated = this.formatDateTime(response.lastSyncedAt);
        this.isLoading = false;
      },
      error: () => {
        this.loadError = 'Stock data is unavailable. Please try Refresh again.';
        this.isLoading = false;
      }
    });
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
