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
  mar25: number | string;
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
}
