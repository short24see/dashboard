import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { AdditionalValueRow, MisService } from '../services/mis';

@Component({
  selector: 'app-asset',
  imports: [CommonModule, MatTableModule],
  templateUrl: './asset.html',
  styleUrl: './asset.less',
})
export class Asset implements OnInit {
  displayedNcaColumns = ['particulars', 'dec25'];

  netCurrentAssetsData: AdditionalValueRow[] = [];
  period = 'Dec-25';
  lastUpdated = '';
  isLoading = false;
  loadError = '';

  constructor(private misService: MisService) {}

  ngOnInit() {
    this.loadNetCurrentAssets();
  }

  loadNetCurrentAssets() {
    this.isLoading = true;
    this.loadError = '';

    this.misService.getNetCurrentAssets().subscribe({
      next: (response) => {
        this.period = response.period || this.period;
        this.netCurrentAssetsData = response.rows || [];
        this.lastUpdated = this.formatDateTime(response.lastSyncedAt);
        this.isLoading = false;
      },
      error: () => {
        this.loadError = 'Net Current Assets data is unavailable. Please try Refresh again.';
        this.isLoading = false;
      }
    });
  }

  valueFor(row: AdditionalValueRow) {
    return row.dec25 ?? row.mar25 ?? '';
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
