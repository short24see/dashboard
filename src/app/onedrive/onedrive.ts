import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../environment/env';
import { Login } from '../services/login';
import { OneDriveAccount, OneDriveItem, OneDrivePreviewResponse, OneDriveService } from '../services/onedrive';

@Component({
  selector: 'app-onedrive',
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './onedrive.html',
  styleUrl: './onedrive.less',
})
export class OneDrive implements OnInit {
  userId = '';
  tenantId = 'common';
  clientId = '';
  clientSecret = '';
  redirectUri = `${environment.API_URL}/onedrive/callback`;
  department = 'General';
  tableName = '';
  replaceExisting = true;

  accounts: OneDriveAccount[] = [];
  items: OneDriveItem[] = [];
  folderStack: Array<{ id?: string; name: string }> = [{ name: 'Root' }];
  selectedAccountId = '';
  selectedFile: OneDriveItem | null = null;
  preview: OneDrivePreviewResponse | null = null;

  configLoading = false;
  accountsLoading = false;
  itemsLoading = false;
  previewLoading = false;
  syncLoading = false;
  status = '';
  error = '';

  constructor(private oneDriveService: OneDriveService, private loginService: Login) {}

  ngOnInit() {
    const user = this.loginService.getCurrentUser();
    this.userId = user.id;
    this.loadConfig();
    this.loadAccounts();
  }

  saveConfig() {
    this.error = '';
    this.status = '';

    if (!this.userId || !this.clientId || !this.clientSecret || !this.redirectUri) {
      this.error = 'User, client ID, client secret, and redirect URI are required.';
      return;
    }

    this.configLoading = true;
    this.oneDriveService.saveConfig({
      userId: this.userId,
      tenantId: this.tenantId || 'common',
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      redirectUri: this.redirectUri
    }).subscribe({
      next: () => {
        this.status = 'OneDrive configuration saved.';
        this.configLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Unable to save OneDrive configuration.';
        this.configLoading = false;
      }
    });
  }

  connect() {
    this.error = '';
    this.status = '';
    this.oneDriveService.getLoginUrl(this.userId, this.department).subscribe({
      next: (res) => {
        window.location.href = res.authUrl;
      },
      error: (err) => {
        this.error = err.error?.message || 'Unable to start Microsoft login.';
      }
    });
  }

  loadAccounts() {
    if (!this.userId) return;

    this.accountsLoading = true;
    this.oneDriveService.getAccounts(this.userId).subscribe({
      next: (res) => {
        this.accounts = res.oneDrives || [];
        this.selectedAccountId = this.selectedAccountId || this.accounts.find(account => account.active)?.accountId || this.accounts[0]?.accountId || '';
        this.accountsLoading = false;

        if (this.selectedAccountId) {
          this.loadItems();
        }
      },
      error: () => {
        this.accounts = [];
        this.accountsLoading = false;
      }
    });
  }

  loadItems(folderId?: string, folderName?: string) {
    if (!this.userId || !this.selectedAccountId) return;

    this.itemsLoading = true;
    this.selectedFile = null;
    this.preview = null;
    this.oneDriveService.getItems(this.userId, this.selectedAccountId, folderId).subscribe({
      next: (res) => {
        this.items = res.items || [];
        if (folderName) {
          this.folderStack.push({ id: folderId, name: folderName });
        }
        this.itemsLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Unable to load OneDrive files.';
        this.itemsLoading = false;
      }
    });
  }

  jumpToFolder(index: number) {
    const target = this.folderStack[index];
    this.folderStack = this.folderStack.slice(0, index + 1);
    this.loadItems(target.id);
  }

  selectItem(item: OneDriveItem) {
    if (item.type === 'folder') {
      this.loadItems(item.id, item.name);
      return;
    }

    if (!item.isExcel) return;

    this.selectedFile = item;
    this.preview = null;
  }

  previewSelectedFile() {
    if (!this.selectedFile || !this.selectedAccountId) return;

    this.previewLoading = true;
    this.oneDriveService.previewExcel(this.userId, this.selectedAccountId, this.selectedFile.id).subscribe({
      next: (res) => {
        this.preview = res;
        this.previewLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Unable to preview Excel file.';
        this.previewLoading = false;
      }
    });
  }

  syncSelectedFile() {
    if (!this.selectedFile || !this.selectedAccountId) return;

    this.error = '';
    this.status = '';
    this.syncLoading = true;
    this.oneDriveService.syncExcel({
      userId: this.userId,
      accountId: this.selectedAccountId,
      itemId: this.selectedFile.id,
      department: this.department || 'OneDrive',
      tableName: this.tableName.trim() || undefined,
      replaceExisting: this.replaceExisting
    }).subscribe({
      next: (res) => {
        this.status = res.message;
        this.syncLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || err.error?.error || 'Unable to sync Excel file.';
        this.syncLoading = false;
      }
    });
  }

  formatSize(size?: number) {
    if (!size) return '-';
    if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  private loadConfig() {
    if (!this.userId) return;

    this.oneDriveService.getConfig(this.userId).subscribe({
      next: (res) => {
        if (!res.config) return;
        this.tenantId = res.config.tenantId || 'common';
        this.clientId = res.config.clientId || '';
        this.redirectUri = res.config.redirectUri || this.redirectUri;
      }
    });
  }
}
