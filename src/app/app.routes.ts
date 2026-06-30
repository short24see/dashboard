import { Routes } from '@angular/router';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { MIS } from './mis/mis';
import { Configuration } from './configuration/configuration';
import { TopNavbar } from './top-navbar/top-navbar';
import { Stock } from './stock/stock';
import { Asset } from './asset/asset';
import { Bom } from './bom/bom';
import { OneDrive } from './onedrive/onedrive';

export const routes: Routes = [
    { path: 'login', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'resetPassword', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: '',
        component: TopNavbar,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AdminDashboard },
            {
                path: 'mis', component: MIS,
                // children: [
                //     { path: 'pl', component: MIS }
                // ]
            },
            { path: 'stock', component: Stock },
            { path: 'bom', component: Bom },
            { path: 'asset', component: Asset },
            { path: 'onedrive', component: OneDrive },
            { path: 'configuration', component: Configuration }
        ]
    },
    { path: '**', redirectTo: 'dashboard' }
];
