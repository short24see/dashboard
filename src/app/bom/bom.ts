import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { BomRow, MisService } from '../services/mis';

@Component({
  selector: 'app-bom',
  imports: [CommonModule, MatTableModule],
  templateUrl: './bom.html',
  styleUrl: './bom.less',
})
export class Bom implements OnInit {
  displayedColumns: string[] = [
    'mainPart',
    'subPart',
    'qty',
    'rate',
    'cost',
    'salePrice'
  ];

  freezeData: BomRow[] = [];
  dynamicData: BomRow[] = [];
  isLoading = false;
  loadError = '';
  lastUpdated = '';

  constructor(private misService: MisService) {}

  ngOnInit() {
    this.loadBom();
  }

  loadBom() {
    this.isLoading = true;
    this.loadError = '';

    this.misService.getBom().subscribe({
      next: (response) => {
        this.freezeData = response.data?.freeze || [];
        this.dynamicData = response.data?.dynamic || [];
        this.lastUpdated = this.formatDateTime(response.lastSyncedAt);
        this.isLoading = false;
      },
      error: () => {
        this.loadError = 'BOM data is unavailable. Please try Refresh again.';
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
