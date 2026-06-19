import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/env';

export interface MisPlRow {
  particular: string;
  marAmount?: string;
  marRatio?: string;
  aprAmount?: string;
  aprRatio?: string;
  mayAmount?: string;
  mayRatio?: string;
  section?: boolean;
  total?: boolean;
}

export interface MisPlNotesRow {
  type: 'section' | 'item' | 'total';
  particulars: string;
  marAmount?: number | string;
  aprAmount?: number | string;
  mayAmount?: number | string;
}

export interface MisPlResponse {
  key: string;
  source: string;
  periods: string[];
  lastSyncedAt: string;
  rows: MisPlRow[];
}

export interface MisPlNotesResponse {
  key: string;
  source: string;
  periods: string[];
  lastSyncedAt: string;
  rows: MisPlNotesRow[];
}

export interface AgingRow {
  months: string;
  dec25: number;
  total?: boolean;
}

export interface AdditionalValueRow {
  particulars: string;
  mar25?: number | string;
  dec25?: number | string;
  total?: boolean;
}

export interface PlHrDataRow {
  particulars: string;
  company: string;
  dec25: number;
  total?: boolean;
}

export interface MisAdditionalNotesResponse {
  key: string;
  source: string;
  period: string;
  lastSyncedAt: string;
  data: {
    sundryDebtors: AgingRow[];
    sundryCreditors: AgingRow[];
    netCurrentAssets: AdditionalValueRow[];
    dutyDrawback: AdditionalValueRow[];
  };
}

export interface MisPlHrDataResponse {
  key: string;
  source: string;
  period: string;
  lastSyncedAt: string;
  rows: PlHrDataRow[];
}

export interface DashboardSnapshotCard {
  title: string;
  value: string;
  change: string;
  subtitle: string;
  color: string;
  icon: string;
  trend?: 'up' | 'down' | 'flat';
}

export interface DashboardCashFlow {
  labels: string[];
  inflow: number[];
  net: number[];
  outflow: number[];
}

export interface DashboardReceivable {
  name: string;
  invoiceNumber: string;
  overdueDays: number;
  amount: number;
}

export interface DashboardPayable {
  name: string;
  poNumber: string;
  dueIn: number;
  amount: number;
}

export interface MisDashboardResponse {
  key: string;
  source: string;
  periods: string[];
  selectedMonth: string;
  lastSyncedAt: string;
  updatedAt: string;
  snapshotCards: DashboardSnapshotCard[];
  cashFlow: DashboardCashFlow;
  overdueReceivables: DashboardReceivable[];
  upcomingPayables: DashboardPayable[];
}

export interface BomRow {
  mainPart: number | string;
  subPart: number | string;
  qty: number | string;
  rate: number | string;
  cost: number | string;
  salePrice: number | string;
  total?: boolean;
}

export interface MisBomResponse {
  key: string;
  source: string;
  lastSyncedAt: string;
  data: {
    freeze: BomRow[];
    dynamic: BomRow[];
  };
}

export interface StockRow {
  particulars: string;
  dec25: number | string;
  total?: boolean;
}

export interface MisStockResponse {
  key: string;
  source: string;
  period: string;
  lastSyncedAt: string;
  data: {
    stock: StockRow[];
    aging: StockRow[];
  };
}

export interface MisNetCurrentAssetsResponse {
  key: string;
  source: string;
  period: string;
  lastSyncedAt: string;
  rows: AdditionalValueRow[];
}

@Injectable({ providedIn: 'root' })
export class MisService {
  private api = `${environment.API_URL}/mis`;

  constructor(private http: HttpClient) {}

  getPl() {
    return this.http.get<MisPlResponse>(`${this.api}/pl`);
  }

  getPlNotes() {
    return this.http.get<MisPlNotesResponse>(`${this.api}/pl-notes`);
  }

  getAdditionalNotes() {
    return this.http.get<MisAdditionalNotesResponse>(`${this.api}/additional-notes`);
  }

  getPlHrData() {
    return this.http.get<MisPlHrDataResponse>(`${this.api}/pl-hr-data`);
  }

  getDashboard(month?: string) {
    const url = month
      ? `${this.api}/dashboard?month=${encodeURIComponent(month)}`
      : `${this.api}/dashboard`;

    return this.http.get<MisDashboardResponse>(url);
  }

  getBom() {
    return this.http.get<MisBomResponse>(`${this.api}/bom`);
  }

  getStock() {
    return this.http.get<MisStockResponse>(`${this.api}/stock`);
  }

  getNetCurrentAssets() {
    return this.http.get<MisNetCurrentAssetsResponse>(`${this.api}/additional-notes/net-current-assets`);
  }
}
