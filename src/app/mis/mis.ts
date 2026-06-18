import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AdditionalValueRow, AgingRow, MisPlNotesRow, MisPlRow, MisService, PlHrDataRow } from '../services/mis';
export interface ExpenseRow {
  type: 'section' | 'item' | 'total';
  particulars: string;

  marAmount?: any;
  aprAmount?: any;
  mayAmount?: any;
}
@Component({
  selector: 'app-mis',
  imports: [MatTabsModule, MatTableModule, CommonModule],
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

  setActive(tab: string) {
    this.activeTab = tab;
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
