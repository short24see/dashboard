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

export interface MisPlResponse {
  key: string;
  source: string;
  periods: string[];
  lastSyncedAt: string;
  rows: MisPlRow[];
}

@Injectable({ providedIn: 'root' })
export class MisService {
  private api = `${environment.API_URL}/mis`;

  constructor(private http: HttpClient) {}

  getPl() {
    return this.http.get<MisPlResponse>(`${this.api}/pl`);
  }
}
