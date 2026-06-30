import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
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

export interface MisPlDirectIncomeSyncRequest {
  fromDate: string;
  toDate: string;
  period?: string;
  username?: string;
  password?: string;
  ratioBaseAmount?: number;
}

export interface MisPlDirectIncomeSyncResponse extends MisPlResponse {
  message: string;
  period: string;
  totalDirectIncome: number;
  directIncomeRows: Array<{
    particular: string;
    accountNumber: string;
    customerCode?: number;
    amount: number;
  }>;
  jdeResponses: Array<{
    accountNumber: string;
    rowCount: number;
    records?: number;
    jdeStatus?: string;
    serverExecutionSeconds?: number;
  }>;
}

export interface JdeDirectIncomeRequest {
  fromDate: string;
  toDate: string;
  accountNumber: string;
  username: string;
  password: string;
}

export interface JdeDirectIncomeRow {
  F0911_ANI: string;
  F0911_AA: number;
  F0911_EXA: string;
  F0911_AN8: number;
}

export interface JdeDirectIncomeResponse {
  ServiceRequest2?: {
    fs_DATABROWSE_F0911?: {
      data?: {
        gridData?: {
          rowset?: JdeDirectIncomeRow[];
          summary?: {
            records?: number;
            moreRecords?: boolean;
          };
        };
      };
    };
  };
  jde__status?: string;
  jde__serverExecutionSeconds?: number;
}

export interface JdeSupplierLedgerRequest {
  account: string;
  fromDate: string;
  thruDate: string;
  addressNumber: string;
  username: string;
  password: string;
}

export interface JdeSupplierLedgerRow {
  z_AN8_38: number;
  z_EXA_94: string;
  z_AA_22: number;
}

export interface JdeSupplierLedgerResponse {
  ServiceRequest1?: {
    forms?: Array<{
      fs_P09200_W09200A?: {
        data?: {
          gridData?: {
            rowset?: JdeSupplierLedgerRow[];
            summary?: {
              records?: number;
              moreRecords?: boolean;
            };
          };
        };
      };
    }>;
  };
  jde__status?: string;
  jde__serverExecutionSeconds?: number;
}

export interface JdePurchaseReceiptRequest {
  fromDate: string;
  toDate: string;
  businessUnit: string;
  orderType: string;
  username: string;
  password: string;
}

export interface JdePurchaseReceiptRow {
  F43121_AN8: number;
  F43121_ANI: string;
  F43121_AOPN: number;
  F43121_AREC: number;
}

export interface JdePurchaseReceiptResponse {
  ServiceRequest1?: {
    fs_DATABROWSE_V43121A?: {
      data?: {
        gridData?: {
          rowset?: JdePurchaseReceiptRow[];
          summary?: {
            records?: number;
            moreRecords?: boolean;
          };
        };
      };
    };
  };
  jde__status?: string;
  jde__serverExecutionSeconds?: number;
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
  private jdeUsername = 'jdetest';
  private jdePassword = 'Deco@2026';

  constructor(private http: HttpClient) {}

  getPl() {
    if (!environment.USE_BACKEND_API) {
      return of({
        key: 'pl',
        source: 'local',
        periods: ['MAR-24', 'APR-24', 'MAY-24'],
        lastSyncedAt: '',
        rows: []
      });
    }

    return this.http.get<MisPlResponse>(`${this.api}/pl`);
  }

  syncPlDirectIncome(payload: MisPlDirectIncomeSyncRequest) {
    return this.http.post<MisPlDirectIncomeSyncResponse>(`${this.api}/pl/direct-income/sync`, payload);
  }

  getJdeDirectIncome(payload: JdeDirectIncomeRequest) {
    const auth = btoa(`${this.jdeUsername}:${this.jdePassword}`);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Basic ${auth}`
    });

    return this.http.post<JdeDirectIncomeResponse>(
      environment.JDE_DIRECT_INCOME_URL,
      {
        fromDate: payload.fromDate,
        toDate: payload.toDate,
        'Account Number 1': payload.accountNumber
      },
      { headers }
    );
  }

  getJdeSupplierLedger(payload: JdeSupplierLedgerRequest) {
    const auth = btoa(`${this.jdeUsername}:${this.jdePassword}`);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Basic ${auth}`
    });

    return this.http.post<JdeSupplierLedgerResponse>(
      environment.JDE_SUPPLIER_LEDGER_URL,
      {
        Account: payload.account,
        From_Date: payload.fromDate,
        Thru_Date: payload.thruDate,
        Address_Number: payload.addressNumber
      },
      { headers }
    );
  }

  getJdePurchaseReceipt(payload: JdePurchaseReceiptRequest) {
    const auth = btoa(`${this.jdeUsername}:${this.jdePassword}`);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Basic ${auth}`
    });

    return this.http.post<JdePurchaseReceiptResponse>(
      environment.JDE_PURCHASE_RECEIPT_URL,
      {
        fromDate: payload.fromDate,
        toDate: payload.toDate,
        'BusinessUnit ': payload.businessUnit,
        OrderType: payload.orderType
      },
      { headers }
    );
  }

  getPlNotes() {
    if (!environment.USE_BACKEND_API) {
      return of({
        key: 'pl-notes',
        source: 'local',
        periods: ['MAR-24', 'APR-24', 'MAY-24'],
        lastSyncedAt: '',
        rows: []
      });
    }

    return this.http.get<MisPlNotesResponse>(`${this.api}/pl-notes`);
  }

  getAdditionalNotes() {
    if (!environment.USE_BACKEND_API) {
      return of({
        key: 'additional-notes',
        source: 'local',
        period: 'Dec-25',
        lastSyncedAt: '',
        data: {
          sundryDebtors: [],
          sundryCreditors: [],
          netCurrentAssets: [],
          dutyDrawback: []
        }
      });
    }

    return this.http.get<MisAdditionalNotesResponse>(`${this.api}/additional-notes`);
  }

  getPlHrData() {
    if (!environment.USE_BACKEND_API) {
      return of({
        key: 'pl-hr-data',
        source: 'local',
        period: 'Dec-25',
        lastSyncedAt: '',
        rows: []
      });
    }

    return this.http.get<MisPlHrDataResponse>(`${this.api}/pl-hr-data`);
  }

  getDashboard(month?: string) {
    if (!environment.USE_BACKEND_API) {
      return of({
        key: 'dashboard',
        source: 'local',
        periods: ['Dec-25'],
        selectedMonth: month || 'Dec-25',
        lastSyncedAt: '',
        updatedAt: '',
        snapshotCards: [],
        cashFlow: {
          labels: [],
          inflow: [],
          net: [],
          outflow: []
        },
        overdueReceivables: [],
        upcomingPayables: []
      });
    }

    const url = month
      ? `${this.api}/dashboard?month=${encodeURIComponent(month)}`
      : `${this.api}/dashboard`;

    return this.http.get<MisDashboardResponse>(url);
  }

  getBom() {
    if (!environment.USE_BACKEND_API) {
      return of({
        key: 'bom',
        source: 'local',
        lastSyncedAt: '',
        data: {
          freeze: [],
          dynamic: []
        }
      });
    }

    return this.http.get<MisBomResponse>(`${this.api}/bom`);
  }

  getStock() {
    if (!environment.USE_BACKEND_API) {
      return of({
        key: 'stock',
        source: 'local',
        period: 'Dec-25',
        lastSyncedAt: '',
        data: {
          stock: [],
          aging: []
        }
      });
    }

    return this.http.get<MisStockResponse>(`${this.api}/stock`);
  }

  getNetCurrentAssets() {
    if (!environment.USE_BACKEND_API) {
      return of({
        key: 'net-current-assets',
        source: 'local',
        period: 'Dec-25',
        lastSyncedAt: '',
        rows: []
      });
    }

    return this.http.get<MisNetCurrentAssetsResponse>(`${this.api}/additional-notes/net-current-assets`);
  }
}
