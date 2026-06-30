import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/env';

export interface OneDriveConfigPayload {
  userId: string;
  tenantId: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface OneDriveAccount {
  accountId: string;
  email: string;
  department?: string;
  expiry?: string;
  connected: boolean;
  active: boolean;
}

export interface OneDriveItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  isExcel: boolean;
  size?: number;
  webUrl?: string;
  lastModifiedDateTime?: string;
}

export interface OneDrivePreviewResponse {
  success: boolean;
  sheetName: string;
  columns: string[];
  totalRows: number;
  rows: Record<string, unknown>[];
}

@Injectable({ providedIn: 'root' })
export class OneDriveService {
  private api = `${environment.API_URL}/onedrive`;

  constructor(private http: HttpClient) {}

  getConfig(userId: string) {
    return this.http.get<{ success: boolean; configured: boolean; config: Partial<OneDriveConfigPayload> | null }>(
      `${this.api}/config`,
      { params: { userId } }
    );
  }

  saveConfig(payload: OneDriveConfigPayload) {
    return this.http.post<{ success: boolean; message: string; config: Partial<OneDriveConfigPayload> }>(
      `${this.api}/config`,
      payload
    );
  }

  getLoginUrl(userId: string, department: string) {
    const params = new HttpParams()
      .set('userId', userId)
      .set('department', department || 'General')
      .set('json', 'true');

    return this.http.get<{ success: boolean; authUrl: string }>(`${this.api}/login-url`, { params });
  }

  getAccounts(userId: string) {
    return this.http.get<{ success: boolean; oneDrives: OneDriveAccount[] }>(
      `${this.api}/accounts`,
      { params: { userId } }
    );
  }

  getItems(userId: string, accountId: string, folderId?: string) {
    let params = new HttpParams()
      .set('userId', userId)
      .set('accountId', accountId);

    if (folderId) {
      params = params.set('folderId', folderId);
    }

    return this.http.get<{ success: boolean; items: OneDriveItem[]; folderId: string }>(
      `${this.api}/items`,
      { params }
    );
  }

  previewExcel(userId: string, accountId: string, itemId: string) {
    const params = new HttpParams()
      .set('userId', userId)
      .set('accountId', accountId)
      .set('itemId', itemId)
      .set('limit', '20');

    return this.http.get<OneDrivePreviewResponse>(`${this.api}/excel/preview`, { params });
  }

  syncExcel(payload: {
    userId: string;
    accountId: string;
    itemId: string;
    department: string;
    tableName?: string;
    replaceExisting: boolean;
  }) {
    return this.http.post<{
      success: boolean;
      message: string;
      fileName: string;
      totalRows: number;
      collectionName: string;
    }>(`${this.api}/excel/sync`, payload);
  }
}
