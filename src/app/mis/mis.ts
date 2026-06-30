import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { forkJoin } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AdditionalValueRow, AgingRow, JdeDirectIncomeRow, JdePurchaseReceiptRow, JdeSupplierLedgerRow, MisPlNotesRow, MisPlRow, MisService, PlHrDataRow } from '../services/mis';
export interface ExpenseRow {
  type: 'section' | 'item' | 'total';
  particulars: string;

  marAmount?: any;
  aprAmount?: any;
  mayAmount?: any;
}
@Component({
  selector: 'app-mis',
  imports: [MatTabsModule, MatTableModule, CommonModule, FormsModule],
  templateUrl: './mis.html',
  styleUrl: './mis.less',
})
export class MIS implements OnInit {
  activeTab = 'pl';
  plLoading = false;
  plError = '';
  plLastSyncedAt = '';
  plNotesLoading = false;
  plNotesError = '';
  plNotesLastSyncedAt = '';
  additionalNotesLoading = false;
  additionalNotesError = '';
  additionalNotesLastSyncedAt = '';
  plHrDataLoading = false;
  plHrDataError = '';
  plHrDataLastSyncedAt = '';
  jdeDirectIncomeLoading = false;
  jdeDirectIncomeMonthLoading: Record<'mar' | 'apr' | 'may', boolean> = {
    mar: false,
    apr: false,
    may: false
  };
  jdeDirectIncomeError = '';
  jdeDirectIncomeStatus = '';
  jdeDirectIncomeMarFromDate = '2024-03-05';
  jdeDirectIncomeMarToDate = '2024-04-05';
  jdeDirectIncomeAprFromDate = '2024-04-05';
  jdeDirectIncomeAprToDate = '2024-05-05';
  jdeDirectIncomeMayFromDate = '2024-05-05';
  jdeDirectIncomeMayToDate = '2024-06-05';
  jdeTargetMonth: 'mar' | 'apr' | 'may' = 'may';
  jdeSupplierLedgerLoading = false;
  jdeSupplierLedgerError = '';
  jdeSupplierLedgerStatus = '';
  jdeSupplierAccount = 'JAY002.7313';
  jdeSupplierFromDate = '01/04/22';
  jdeSupplierThruDate = '31/03/23';
  jdeSupplierAddressNumber = '36731';
  jdeSupplierTargetRow = 'Manufacturing Wages (Prachi)';
  jdePurchaseReceiptLoading = false;
  jdePurchaseReceiptError = '';
  jdePurchaseReceiptStatus = '';
  jdePurchaseFromDate = '22/04/20';
  jdePurchaseToDate = '22/04/24';
  jdePurchaseBusinessUnit = '4000';
  jdePurchaseOrderTypes = 'OT';
  jdePurchaseTargetRow = 'RM Purchase EPIP';
  private directIncomeMappings = [
    { particular: 'Ikea', accountNumber: '2400.6060', customerCode: 22073 },
    { particular: 'Lamplight', accountNumber: '2400.6060', customerCode: 21298 },
    { particular: 'LG Sourcing', accountNumber: '2400.6060', customerCode: 22637 },
    { particular: 'Zenith Home Corp.', accountNumber: '2400.6060', customerCode: 22357 },
    { particular: 'Rev-A-Shelf, LLC.', accountNumber: '2400.6060', customerCode: 22611 },
    { particular: 'Sales Domestic Local', accountNumber: '2400.6040' },
    { particular: 'Sales Scrap', accountNumber: '2400.6050' },
    { particular: 'Interbranch Transfers', accountNumber: '2400.6065' }
  ];

  constructor(private router: Router, private misService: MisService) {

  }

  ngOnInit(): void {
    this.loadPlData();
    this.loadPlNotesData();
    this.loadAdditionalNotesData();
    this.loadPlHrData();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;

        if (url === '/pl') {
          this.activeTab = 'pl';
        }
        else if (url.startsWith('/plNotes')) {
          this.activeTab = 'plNotes';
        }
        else if (url.startsWith('/additionalNotes')) {
          this.activeTab = 'additionalNotes';
        }
        else if (url.startsWith('/plHrData')) {
          this.activeTab = 'plHrData';
        }
        else if (url.startsWith('/stock')) {
          this.activeTab = 'stock';
        }
      });
  }
  groupHeaderColumns = ['particular', 'marGroup', 'aprGroup', 'mayGroup'];

  subHeaderColumns = [
    'marAmount',
    'marRatio',
    'aprAmount',
    'aprRatio',
    'mayAmount',
    'mayRatio'
  ];

  displayedColumns = [
    'particular',
    'marAmount',
    'marRatio',
    'aprAmount',
    'aprRatio',
    'mayAmount',
    'mayRatio'
  ];

  dataSource: MisPlRow[] = [
    // ===== PROFIT =====
    {
      particular: 'Net Profit',
      marAmount: '4,24,404', marRatio: '97%',
      aprAmount: '-30,241', aprRatio: '-727%',
      mayAmount: '1,97,361', mayRatio: '4744%',
      total: true
    },
    {
      particular: 'Cash Profit',
      marAmount: '4,24,504', marRatio: '97%',
      aprAmount: '-30,141', aprRatio: '-725%',
      mayAmount: '1,97,461', mayRatio: '4747%'
    },
    {
      particular: 'EBITDA',
      marAmount: '4,24,604', marRatio: '97%',
      aprAmount: '-30,041', aprRatio: '-722%',
      mayAmount: '1,97,561', mayRatio: '4749%'
    },
    {
      particular: 'Gross Profit',
      marAmount: '4,25,504', marRatio: '98%',
      aprAmount: '-29,141', aprRatio: '-701%',
      mayAmount: '1,98,461', mayRatio: '4771%'
    },

    // ===== DIRECT INCOME =====
    { particular: 'Direct Income', section: true },

    {
      particular: 'Ikea',
      marAmount: '1,000', marRatio: '0%',
      aprAmount: '1,000', aprRatio: '24%',
      mayAmount: '1,000', mayRatio: '24%'
    },
    {
      particular: 'Lamplight',
      marAmount: '1,000', marRatio: '0%',
      aprAmount: '1,000', aprRatio: '24%',
      mayAmount: '1,000', mayRatio: '24%'
    },
    {
      particular: 'Maytex',
      marAmount: '-', marRatio: '0%',
      aprAmount: '-', aprRatio: '0%',
      mayAmount: '-', mayRatio: '0%'
    },
    {
      particular: 'Zenith Home Corp.',
      marAmount: '-', marRatio: '0%',
      aprAmount: '1,000', aprRatio: '24%',
      mayAmount: '1,000', mayRatio: '24%'
    },
    {
      particular: 'Sales Domestic Local',
      marAmount: '1,000', marRatio: '0%',
      aprAmount: '100', aprRatio: '2%',
      mayAmount: '1,000', mayRatio: '24%'
    },
    {
      particular: 'Sales Domestic Local – Scrap',
      marAmount: '-', marRatio: '0%',
      aprAmount: '1,000', aprRatio: '24%',
      mayAmount: '1,000', mayRatio: '24%'
    },
    {
      particular: 'Total Direct Income',
      marAmount: '3,000',
      aprAmount: '4,100',
      mayAmount: '5,000',
      total: true
    },

    // ===== INDIRECT INCOME =====
    { particular: 'Indirect Income', section: true },

    {
      particular: 'Duty Drawback',
      marAmount: '4,59,224', marRatio: '105%',
      aprAmount: '45', aprRatio: '1%',
      mayAmount: '45', mayRatio: '1%'
    },
    {
      particular: 'Export Incentive (RODTEP)',
      marAmount: '-26,237', marRatio: '-6%',
      aprAmount: '15', aprRatio: '0%',
      mayAmount: '15', mayRatio: '0%'
    },
    {
      particular: 'Other (Services + Freight)',
      marAmount: '-', marRatio: '',
      aprAmount: '-', aprRatio: '',
      mayAmount: '1,99,701', mayRatio: ''
    },
    {
      particular: 'Total Indirect Income',
      marAmount: '4,32,987',
      aprAmount: '60',
      mayAmount: '1,99,761',
      total: true
    },

    // ===== COST OF GOODS =====
    { particular: 'Cost of Goods', section: true },

    {
      particular: 'Opening Stock',
      marAmount: '32,684', marRatio: '7%',
      aprAmount: '28,501', aprRatio: '685%',
      mayAmount: '500', mayRatio: '1.2%'
    },
    {
      particular: 'Closing Stock',
      marAmount: '-28,501',
      aprAmount: '-500',
      mayAmount: '-500'
    },
    {
      particular: 'Manufacturing Wages',
      marAmount: '1,000',
      aprAmount: '1,000',
      mayAmount: '1,000'
    },
    {
      particular: 'Electricity Expenses',
      marAmount: '1,000',
      aprAmount: '1,000',
      mayAmount: '1,000'
    },
    {
      particular: 'Total Cost of Goods',
      marAmount: '10,483',
      aprAmount: '33,301',
      mayAmount: '6,300',
      total: true
    },

    // ===== INDIRECT EXPENSES =====
    { particular: 'Indirect Expenses', section: true },

    {
      particular: 'Indirect Salaries',
      marAmount: '400',
      aprAmount: '400',
      mayAmount: '400'
    },
    {
      particular: 'Interest on WC Loan',
      marAmount: '400',
      aprAmount: '400',
      mayAmount: '400'
    },
    {
      particular: 'Rent (Warehousing)',
      marAmount: '400',
      aprAmount: '400',
      mayAmount: '400'
    },
    {
      particular: 'Total Indirect Expenses',
      marAmount: '1,200',
      aprAmount: '1,200',
      mayAmount: '1,200',
      total: true
    }
  ];

  private loadPlData() {
    this.plLoading = true;
    this.plError = '';

    this.misService.getPl().subscribe({
      next: (res) => {
        if (Array.isArray(res.rows) && res.rows.length) {
          this.dataSource = res.rows;
          this.plLastSyncedAt = res.lastSyncedAt;
        }

        this.plLoading = false;
      },
      error: () => {
        this.plError = 'Unable to load live P&L data. Showing cached fallback data.';
        this.plLoading = false;
      }
    });
  }

  loadDirectIncomeFromJde(month?: 'mar' | 'apr' | 'may') {
    this.jdeDirectIncomeError = '';
    this.jdeDirectIncomeStatus = '';

    if (month && this.jdeDirectIncomeMonthLoading[month]) {
      return;
    }

    if (!month && this.jdeDirectIncomeLoading) {
      return;
    }

    const periods = month
      ? this.getDirectIncomePeriods().filter(period => period.month === month)
      : this.getDirectIncomePeriods();

    if (periods.some(period => !period.fromDate || !period.toDate)) {
      this.jdeDirectIncomeError = 'Select Direct Income from and to dates before loading.';
      return;
    }

    if (month) {
      this.jdeDirectIncomeMonthLoading[month] = true;
    } else {
      this.jdeDirectIncomeLoading = true;
      this.jdeDirectIncomeMonthLoading = { mar: true, apr: true, may: true };
    }

    this.jdeDirectIncomeStatus = '';
    const accountNumbers = ['2400.6060', '2400.6040', '2400.6050', '2400.6065'];
    const requests = periods.flatMap(period =>
      accountNumbers.map(accountNumber =>
        this.misService.getJdeDirectIncome({
          fromDate: this.toJdeDate(period.fromDate),
          toDate: this.toJdeDate(period.toDate),
          accountNumber,
          username: '',
          password: ''
        })
      )
    );

    forkJoin(requests).subscribe({
      next: (response) => {
        const responseRowsByPeriod = new Map<string, Map<string, JdeDirectIncomeRow[]>>();

        response.forEach((item, index) => {
          const period = periods[Math.floor(index / accountNumbers.length)];
          const accountNumber = accountNumbers[index % accountNumbers.length];
          const rows = item.ServiceRequest2?.fs_DATABROWSE_F0911?.data?.gridData?.rowset || [];
          const rowsByAccount = responseRowsByPeriod.get(period.month) || new Map<string, JdeDirectIncomeRow[]>();

          rowsByAccount.set(accountNumber, rows);
          responseRowsByPeriod.set(period.month, rowsByAccount);
        });

        this.dataSource = this.replaceDirectIncomeForMonths(this.dataSource, responseRowsByPeriod, periods.map(period => period.month));
        this.jdeDirectIncomeStatus = 'Direct Income loaded from JDE.';
        this.clearDirectIncomeLoading(month);
      },
      error: (error) => {
        this.jdeDirectIncomeError = error?.status === 0
          ? 'Unable to call JDE from browser. Check client network, CORS, and JDE API access.'
          : 'Unable to load Direct Income from JDE.';
        this.clearDirectIncomeLoading(month);
      }
    });
  }

  private clearDirectIncomeLoading(month?: 'mar' | 'apr' | 'may') {
    if (month) {
      this.jdeDirectIncomeMonthLoading[month] = false;
    } else {
      this.jdeDirectIncomeLoading = false;
      this.jdeDirectIncomeMonthLoading = { mar: false, apr: false, may: false };
    }
  }

  private getDirectIncomePeriods(): Array<{ month: 'mar' | 'apr' | 'may'; fromDate: string; toDate: string }> {
    return [
      { month: 'mar', fromDate: this.jdeDirectIncomeMarFromDate, toDate: this.jdeDirectIncomeMarToDate },
      { month: 'apr', fromDate: this.jdeDirectIncomeAprFromDate, toDate: this.jdeDirectIncomeAprToDate },
      { month: 'may', fromDate: this.jdeDirectIncomeMayFromDate, toDate: this.jdeDirectIncomeMayToDate }
    ];
  }

  private sumJdeRows(rows: JdeDirectIncomeRow[], accountNumber: string, customerCode?: number) {
    return rows.reduce((sum, row) => {
      const accountMatches = String(row.F0911_ANI || '').trim() === accountNumber;
      const customerMatches = !customerCode || Number(row.F0911_AN8) === customerCode;
      const amount = Number(row.F0911_AA);

      return accountMatches && customerMatches && Number.isFinite(amount) ? sum + amount : sum;
    }, 0);
  }

  loadSupplierLedgerFromJde() {
    this.jdeSupplierLedgerError = '';
    this.jdeSupplierLedgerStatus = '';

    if (!this.jdeSupplierFromDate || !this.jdeSupplierThruDate || !this.jdeSupplierAccount || !this.jdeSupplierAddressNumber) {
      this.jdeSupplierLedgerError = 'Enter date, account, and address number before loading Supplier Ledger.';
      return;
    }

    this.jdeSupplierLedgerLoading = true;
    this.misService.getJdeSupplierLedger({
      account: this.jdeSupplierAccount,
      fromDate: this.jdeSupplierFromDate,
      thruDate: this.jdeSupplierThruDate,
      addressNumber: this.jdeSupplierAddressNumber,
      username: '',
      password: ''
    }).subscribe({
      next: (response) => {
        const rows = response.ServiceRequest1?.forms?.[0]?.fs_P09200_W09200A?.data?.gridData?.rowset || [];
        const amount = this.sumSupplierLedgerRows(rows, this.jdeSupplierAddressNumber);

        this.dataSource = this.upsertCostOfGoodsRow(this.dataSource, this.jdeSupplierTargetRow, amount);
        this.jdeSupplierLedgerStatus = `Loaded Supplier Ledger from JDE. ${this.jdeSupplierTargetRow}: ${this.formatAmount(amount)}. Rows: ${rows.length}.`;
        this.jdeSupplierLedgerLoading = false;
      },
      error: (error) => {
        this.jdeSupplierLedgerError = error?.status === 0
          ? 'Unable to call JDE from browser. Check client network, CORS, and JDE API access.'
          : 'Unable to load Supplier Ledger from JDE.';
        this.jdeSupplierLedgerLoading = false;
      }
    });
  }

  private sumSupplierLedgerRows(rows: JdeSupplierLedgerRow[], addressNumber: string) {
    return rows.reduce((sum, row) => {
      const addressMatches = Number(row.z_AN8_38) === Number(addressNumber);
      const amount = Number(row.z_AA_22);

      return addressMatches && Number.isFinite(amount) ? sum + amount : sum;
    }, 0);
  }

  loadPurchaseReceiptFromJde() {
    this.jdePurchaseReceiptError = '';
    this.jdePurchaseReceiptStatus = '';

    const orderTypes = this.getPurchaseOrderTypes();
    if (!this.jdePurchaseFromDate || !this.jdePurchaseToDate || !this.jdePurchaseBusinessUnit || !orderTypes.length) {
      this.jdePurchaseReceiptError = 'Enter date, business unit, and order type before loading Purchase Receipt.';
      return;
    }

    this.jdePurchaseReceiptLoading = true;
    const requests = orderTypes.map(orderType => this.misService.getJdePurchaseReceipt({
      fromDate: this.jdePurchaseFromDate,
      toDate: this.jdePurchaseToDate,
      businessUnit: this.jdePurchaseBusinessUnit,
      orderType,
      username: '',
      password: ''
    }));

    forkJoin(requests).subscribe({
      next: (responses) => {
        const rows = responses.flatMap(response => response.ServiceRequest1?.fs_DATABROWSE_V43121A?.data?.gridData?.rowset || []);
        const amount = this.sumPurchaseReceiptRows(rows);

        this.dataSource = this.upsertCostOfGoodsRow(this.dataSource, this.jdePurchaseTargetRow, amount);
        this.jdePurchaseReceiptStatus = `Loaded Purchase Receipt from JDE. ${this.jdePurchaseTargetRow}: ${this.formatAmount(amount)}. Rows: ${rows.length}.`;
        this.jdePurchaseReceiptLoading = false;
      },
      error: (error) => {
        this.jdePurchaseReceiptError = error?.status === 0
          ? 'Unable to call JDE from browser. Check client network, CORS, and JDE API access.'
          : 'Unable to load Purchase Receipt from JDE.';
        this.jdePurchaseReceiptLoading = false;
      }
    });
  }

  private getPurchaseOrderTypes() {
    return this.jdePurchaseOrderTypes
      .split(',')
      .map(orderType => orderType.trim())
      .filter(Boolean);
  }

  private sumPurchaseReceiptRows(rows: JdePurchaseReceiptRow[]) {
    return rows.reduce((sum, row) => {
      const openAmount = Number(row.F43121_AOPN);
      const receivedAmount = Number(row.F43121_AREC);
      const amount = (Number.isFinite(openAmount) ? openAmount : 0) + (Number.isFinite(receivedAmount) ? receivedAmount : 0);

      return sum + amount;
    }, 0);
  }

  private upsertCostOfGoodsRow(rows: MisPlRow[], particular: string, amount: number) {
    const amountKey = `${this.jdeTargetMonth}Amount` as keyof MisPlRow;
    const ratioKey = `${this.jdeTargetMonth}Ratio` as keyof MisPlRow;
    const totalDirectIncome = this.getAmountForParticular(rows, 'Total Direct Income', amountKey);
    const aliases = particular === 'Manufacturing Wages (Prachi)'
      ? ['Manufacturing Wages (Prachi)', 'Manufacturing Wages']
      : [particular];
    const rowIndex = rows.findIndex(row => aliases.includes(row.particular));
    const updatedRow: MisPlRow = {
      particular,
      [amountKey]: this.formatAmount(amount),
      [ratioKey]: this.formatRatio(amount, totalDirectIncome)
    };

    if (rowIndex !== -1) {
      return rows.map((row, index) => index === rowIndex ? { ...row, ...updatedRow } : row);
    }

    const totalCostIndex = rows.findIndex(row => row.total && row.particular === 'Total Cost of Goods');
    if (totalCostIndex === -1) {
      return [...rows, updatedRow];
    }

    return [
      ...rows.slice(0, totalCostIndex),
      updatedRow,
      ...rows.slice(totalCostIndex)
    ];
  }

  private getAmountForParticular(rows: MisPlRow[], particular: string, amountKey: keyof MisPlRow) {
    const row = rows.find(item => item.particular === particular);
    const rawAmount = row?.[amountKey];

    if (typeof rawAmount === 'number') return rawAmount;
    if (typeof rawAmount !== 'string') return 0;

    const amount = Number(rawAmount.replace(/,/g, ''));
    return Number.isFinite(amount) ? amount : 0;
  }

  private replaceDirectIncomeSection(rows: MisPlRow[], directIncomeRows: Array<{ particular: string; amount: number }>, totalDirectIncome: number) {
    const directIncomeIndex = rows.findIndex(row => row.section && row.particular === 'Direct Income');
    const indirectIncomeIndex = rows.findIndex(row => row.section && row.particular === 'Indirect Income');
    const amountKey = `${this.jdeTargetMonth}Amount` as keyof MisPlRow;
    const ratioKey = `${this.jdeTargetMonth}Ratio` as keyof MisPlRow;
    const insertRows: MisPlRow[] = [
      ...directIncomeRows.map(row => ({
        particular: row.particular,
        [amountKey]: this.formatAmount(row.amount),
        [ratioKey]: this.formatRatio(row.amount, totalDirectIncome)
      })),
      {
        particular: 'Total Direct Income',
        [amountKey]: this.formatAmount(totalDirectIncome),
        total: true
      }
    ];

    if (directIncomeIndex === -1) {
      return [{ particular: 'Direct Income', section: true }, ...insertRows, ...rows];
    }

    return [
      ...rows.slice(0, directIncomeIndex + 1),
      ...insertRows,
      ...rows.slice(indirectIncomeIndex === -1 ? directIncomeIndex + 1 : indirectIncomeIndex)
    ];
  }

  private replaceDirectIncomeForMonths(rows: MisPlRow[], responseRowsByPeriod: Map<string, Map<string, JdeDirectIncomeRow[]>>, months: Array<'mar' | 'apr' | 'may'>) {
    const directIncomeIndex = rows.findIndex(row => row.section && row.particular === 'Direct Income');
    const indirectIncomeIndex = rows.findIndex(row => row.section && row.particular === 'Indirect Income');
    const periods = this.getDirectIncomePeriods().filter(period => months.includes(period.month));
    const existingRows = directIncomeIndex === -1
      ? []
      : rows.slice(directIncomeIndex + 1, indirectIncomeIndex === -1 ? rows.length : indirectIncomeIndex);
    const directRows = this.directIncomeMappings.map(mapping => {
      const row: MisPlRow = {
        ...(existingRows.find(item => item.particular === mapping.particular) || {}),
        particular: mapping.particular
      };

      periods.forEach(period => {
        const amountKey = `${period.month}Amount` as keyof MisPlRow;
        const rowsByAccount = responseRowsByPeriod.get(period.month);
        const amount = this.sumJdeRows(rowsByAccount?.get(mapping.accountNumber) || [], mapping.accountNumber, mapping.customerCode);

        row[amountKey] = this.formatAmount(amount) as never;
      });

      return row;
    });

    periods.forEach(period => {
      const amountKey = `${period.month}Amount` as keyof MisPlRow;
      const ratioKey = `${period.month}Ratio` as keyof MisPlRow;
      const total = directRows.reduce((sum, row) => sum + this.parseFormattedAmount(row[amountKey]), 0);

      directRows.forEach(row => {
        row[ratioKey] = this.formatRatio(this.parseFormattedAmount(row[amountKey]), total) as never;
      });
    });

    const totalRow: MisPlRow = {
      ...(existingRows.find(item => item.particular === 'Total Direct Income') || {}),
      particular: 'Total Direct Income',
      total: true
    };

    periods.forEach(period => {
      const amountKey = `${period.month}Amount` as keyof MisPlRow;
      totalRow[amountKey] = this.formatAmount(directRows.reduce((sum, row) => sum + this.parseFormattedAmount(row[amountKey]), 0)) as never;
    });

    const insertRows = [...directRows, totalRow];

    if (directIncomeIndex === -1) {
      return [{ particular: 'Direct Income', section: true }, ...insertRows, ...rows];
    }

    return [
      ...rows.slice(0, directIncomeIndex + 1),
      ...insertRows,
      ...rows.slice(indirectIncomeIndex === -1 ? directIncomeIndex + 1 : indirectIncomeIndex)
    ];
  }

  private formatAmount(value: number) {
    return Math.round(value).toLocaleString('en-IN');
  }

  private parseFormattedAmount(value: unknown) {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return 0;

    const parsed = Number(value.replace(/,/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private toJdeDate(value: string) {
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year.slice(-2)}`;
  }

  private formatRatio(value: number, total: number) {
    if (!total) return '0.00%';
    return `${((value / total) * 100).toFixed(2)}%`;
  }

  setActive(tab: string) {
    this.activeTab = tab;
  }

  isDirectIncomeSkeletonRow(row: MisPlRow, month: 'mar' | 'apr' | 'may') {
    return this.jdeDirectIncomeMonthLoading[month] && (
      row.particular === 'Total Direct Income' ||
      this.directIncomeMappings.some(mapping => mapping.particular === row.particular)
    );
  }

  // onTabChange(index: number) {
  //   const routes = [
  //     '/preview',
  //     '/processing',
  //     '/exceptions',
  //     '/review-jvs',
  //     '/reco-report'
  //   ];
  //   this.router.navigate([routes[index]]);
  // }

  groupHeaderColumnsPlNotes = ['particulars', 'marGroup', 'aprGroup', 'mayGroup'];

  subHeaderColumnsPlNotes = [
    'marAmount',
    'aprAmount',
    'mayAmount',
  ];

  displayedPlNotesColumns = ['particulars', 'marAmount', 'aprAmount', 'mayAmount'];
  dataSourcePlNotes: MisPlNotesRow[] = [

    // =========================
    // 01 - Other Indirect Expenses
    // =========================
    { type: 'section', particulars: '01 - Other Indirect Expenses' },

    { type: 'item', particulars: 'Printing And Stationery', marAmount: 1200, aprAmount: 900, mayAmount: 1100 },
    { type: 'item', particulars: 'Travelling Exps (Local)', marAmount: 1800, aprAmount: 1500, mayAmount: 1700 },
    { type: 'item', particulars: 'Medical Expenses', marAmount: 600, aprAmount: 400, mayAmount: 500 },
    { type: 'item', particulars: 'Conveyance Local Exp', marAmount: 950, aprAmount: 850, mayAmount: 900 },
    { type: 'item', particulars: 'Car Running exp.-director', marAmount: 2200, aprAmount: 2100, mayAmount: 2300 },
    { type: 'item', particulars: 'Car Running exp.-staff', marAmount: 1600, aprAmount: 1400, mayAmount: 1500 },
    { type: 'item', particulars: 'Bank Charges', marAmount: 300, aprAmount: 280, mayAmount: 310 },

    { type: 'total', particulars: 'TOTAL', marAmount: 8950, aprAmount: 7430, mayAmount: 8310 },

    // =========================
    // 02 - Marketing Expenses
    // =========================
    { type: 'section', particulars: '02 - Marketing Expenses' },

    { type: 'item', particulars: 'Travelling Expenses (Foreign)', marAmount: 8500, aprAmount: 6200, mayAmount: 7400 },
    { type: 'item', particulars: 'Commission on Export Sales', marAmount: 4200, aprAmount: 3900, mayAmount: 4100 },
    { type: 'item', particulars: 'Sales Promotion', marAmount: 3100, aprAmount: 2800, mayAmount: 3000 },
    { type: 'item', particulars: 'Incentive on Sale', marAmount: 2600, aprAmount: 2400, mayAmount: 2500 },

    { type: 'total', particulars: 'TOTAL', marAmount: 18400, aprAmount: 15300, mayAmount: 17000 },

    // =========================
    // 03 - Repair and Maintenance
    // =========================
    { type: 'section', particulars: '03 - Repair and Maintenance' },

    { type: 'item', particulars: 'Repair & Maintenance – Plant & Machinery', marAmount: 5200, aprAmount: 4800, mayAmount: 5100 },
    { type: 'item', particulars: 'Repair & Maintenance – Building', marAmount: 2100, aprAmount: 1900, mayAmount: 2000 },
    { type: 'item', particulars: 'Repair & Maintenance – Office Equipment', marAmount: 1400, aprAmount: 1300, mayAmount: 1350 },
    { type: 'item', particulars: 'Repair & Maintenance – Vehicle', marAmount: 1800, aprAmount: 1700, mayAmount: 1750 },

    { type: 'total', particulars: 'TOTAL', marAmount: 10500, aprAmount: 9700, mayAmount: 10200 },

    // =========================
    // 04 - Other Direct Expenses
    // =========================
    { type: 'section', particulars: '04 - Other Direct Expenses' },

    { type: 'item', particulars: 'Clearing & Forwarding Charges – Export', marAmount: 4600, aprAmount: 4300, mayAmount: 4500 },
    { type: 'item', particulars: 'Clearing Charges – Import', marAmount: 3900, aprAmount: 3600, mayAmount: 3800 },
    { type: 'item', particulars: 'Custom Duty on Imports', marAmount: 7200, aprAmount: 6900, mayAmount: 7100 },
    { type: 'item', particulars: 'Testing Charges', marAmount: 1200, aprAmount: 1000, mayAmount: 1100 },

    { type: 'total', particulars: 'TOTAL', marAmount: 16900, aprAmount: 15800, mayAmount: 16500 }

  ];

  private loadPlNotesData() {
    this.plNotesLoading = true;
    this.plNotesError = '';

    this.misService.getPlNotes().subscribe({
      next: (res) => {
        if (Array.isArray(res.rows) && res.rows.length) {
          this.dataSourcePlNotes = res.rows;
          this.plNotesLastSyncedAt = res.lastSyncedAt;
        }

        this.plNotesLoading = false;
      },
      error: () => {
        this.plNotesError = 'Unable to load live P&L Notes data. Showing cached fallback data.';
        this.plNotesLoading = false;
      }
    });
  }

  displayedAdditionalColumns = ['months', 'dec25'];;

  sundryDebtorsData: AgingRow[] = [
    { months: '0-30 days', dec25: 9.10 },
    { months: '31-60 days', dec25: 5.50 },
    { months: '61-90 days', dec25: 3.22 },
    { months: '91-120 days', dec25: 0.48 },
    { months: '120 days or more', dec25: 0.00 },
    { months: 'TOTAL', dec25: 18.30, total: true }
  ];

  sundryCreditorsData: AgingRow[] = [
    { months: '0-30 days', dec25: 4.74 },
    { months: '31-60 days', dec25: 3.18 },
    { months: '61-90 days', dec25: 1.83 },
    { months: '91-120 days', dec25: 0.34 },
    { months: '120 days or more', dec25: 0.13 },
    { months: 'TOTAL', dec25: 10.22, total: true }
  ];

  netCurrentAssetsDS = [
    { label: 'Bank Balance', value: 1.60 },
    { label: 'Stock', value: 5.25 },
    { label: 'Sundry Debtors', value: 18.30 },
    { label: 'GST Refund', value: 2.76 },
    { label: 'Advances', value: 1.54 },
    { label: 'Mutual Fund', value: 1.00 },
    { label: 'Duty Drawback', value: 0.19 },
    { label: 'JAYANITA Payables', value: -0.83 },
    { label: 'Sundry Creditors', value: -10.22 },
    { label: 'Limits Used – BILL Disc', value: -4.44 },
    { label: 'Limits Used – OD', value: -1.95 },
    { label: 'SIDBI Loan', value: -1.85 },
    { label: 'PC Loan', value: -3.07 },
    { label: 'Net Current Asset', value: 10.36, total: true }
  ];

  dutyDrawbackDS = [
    { label: 'DRAWBACK SHIPPING BILL (MUNDRA)-25013', value: '-' },
    { label: 'DRAWBACK SHIPPING BILL (BOM)-25005', value: '-' },
    { label: 'DRAWBACK SHIPPING BILL (DADRI)-25011', value: '6,00,000.00' },
    { label: 'DRAWBACK SHIPPING – PROVISION', value: '13,33,984.04' },
    { label: 'Total', value: '19,33,984', total: true }
  ];

  displayedNcaColumns = ['particulars', 'mar25'];

  netCurrentAssetsData: AdditionalValueRow[] = [
    { particulars: 'Bank Balance', mar25: 1.60 },
    { particulars: 'Stock', mar25: 5.25 },
    { particulars: 'Sundry Debtors', mar25: 18.30 },
    { particulars: 'GST Refund', mar25: 2.76 },
    { particulars: 'Advances', mar25: 1.54 },
    { particulars: 'Mutual Fund', mar25: 1.00 },
    { particulars: 'Duty Drawback', mar25: 0.19 },

    { particulars: 'JEPL 2400 FD Ag Sidbi loan', mar25: 1.00 },
    { particulars: 'JEPL 2200 receivable Ag Sidbi loan', mar25: 1.00 },

    { particulars: 'JAYANITA payables', mar25: -0.83 },
    { particulars: 'Sundry Creditors', mar25: -10.22 },
    { particulars: 'Limits Used - BILL Disc', mar25: -4.44 },
    { particulars: 'Limits Used - OD', mar25: -1.95 },
    { particulars: 'SIDBI Loan', mar25: -1.85 },
    { particulars: 'PC Loan', mar25: -3.07 },

    { particulars: 'Advances Payment', mar25: 0.08 },
    { particulars: 'Self assessment tax', mar25: 0.00 },

    { particulars: 'Net Current Asset', mar25: 10.36, total: true }
  ];

  displayedDutyColumns = ['particulars', 'mar25'];

  dutyDrawbackData: AdditionalValueRow[] = [
    { particulars: 'DRAWBACK SHIPPING BILL (MUNDRA) - 25013', mar25: '-' },
    { particulars: 'DRAWBACK SHIPPING BILL (BOM) - 25005', mar25: '-' },
    { particulars: 'DRAWBACK SHIPPING BILL (DADRI) - 25011', mar25: '6,00,000.00' },
    { particulars: 'DRAWBACK SHIPPING - PROVISION', mar25: '13,33,984.04' },
    { particulars: 'Total', mar25: '19,33,984', total: true }
  ];

  private loadAdditionalNotesData() {
    this.additionalNotesLoading = true;
    this.additionalNotesError = '';

    this.misService.getAdditionalNotes().subscribe({
      next: (res) => {
        if (res.data) {
          this.sundryDebtorsData = Array.isArray(res.data.sundryDebtors) ? res.data.sundryDebtors : this.sundryDebtorsData;
          this.sundryCreditorsData = Array.isArray(res.data.sundryCreditors) ? res.data.sundryCreditors : this.sundryCreditorsData;
          this.netCurrentAssetsData = Array.isArray(res.data.netCurrentAssets) ? res.data.netCurrentAssets : this.netCurrentAssetsData;
          this.dutyDrawbackData = Array.isArray(res.data.dutyDrawback) ? res.data.dutyDrawback : this.dutyDrawbackData;
          this.additionalNotesLastSyncedAt = res.lastSyncedAt;
        }

        this.additionalNotesLoading = false;
      },
      error: () => {
        this.additionalNotesError = 'Unable to load live Additional Notes data. Showing cached fallback data.';
        this.additionalNotesLoading = false;
      }
    });
  }

  displayedColumnsPlHr = ['particulars', 'company', 'dec25'];

  salaryData: PlHrDataRow[] = [
    {
      particulars: 'Contractor Workers’ Wages Cost - Prachi',
      company: 'Jayanita',
      dec25: 5047202
    },
    {
      particulars: 'Contractor Workers’ Attendance Award - Prachi',
      company: 'Jayanita',
      dec25: 33040
    },
    {
      particulars: 'Manufacturing Wages (A)',
      company: '',
      dec25: 5080242
    },
    {
      particulars: 'Company-Roll Manufacturing Workers’ Wages Cost - Jayanita',
      company: 'Jayanita',
      dec25: 714119
    },
    {
      particulars: 'Company-Roll Workers Attendance Award - Jayanita',
      company: 'Jayanita',
      dec25: 6712
    },
    {
      particulars: 'Incentive',
      company: '',
      dec25: 215653
    },
    {
      particulars: 'Manufacturing Salaries (B)',
      company: '',
      dec25: 2692184
    },
    {
      particulars: 'Office-2400 Staff Salary Cost',
      company: 'JEPL',
      dec25: 1010019
    },
    {
      particulars: 'Indirect Salaries (C)',
      company: '',
      dec25: 1010019
    },
    {
      particulars: 'G. TOTAL (A+B+C)',
      company: '',
      dec25: 8782445,
      total: true
    }
  ];

  private loadPlHrData() {
    this.plHrDataLoading = true;
    this.plHrDataError = '';

    this.misService.getPlHrData().subscribe({
      next: (res) => {
        if (Array.isArray(res.rows) && res.rows.length) {
          this.salaryData = res.rows;
          this.plHrDataLastSyncedAt = res.lastSyncedAt;
        }

        this.plHrDataLoading = false;
      },
      error: () => {
        this.plHrDataError = 'Unable to load live P&L HR data. Showing cached fallback data.';
        this.plHrDataLoading = false;
      }
    });
  }
}
