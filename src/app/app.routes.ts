import { Routes } from '@angular/router';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { MIS } from './mis/mis';
import { Configuration } from './configuration/configuration';
import { TopNavbar } from './top-navbar/top-navbar';
import { login } from './login/login';
import { Stock } from './stock/stock';
import { Asset } from './asset/asset';
import { Bom } from './bom/bom';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: login },
    { path: 'resetPassword', component: login },
    {
        path: '',
        component: TopNavbar,
        canActivate: [authGuard],
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
            { path: 'configuration', component: Configuration }
        ]
    },
    { path: '**', component: login }
];
