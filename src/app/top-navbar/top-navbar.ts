import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Login } from '../services/login';

@Component({
  selector: 'app-top-navbar',
  imports: [CommonModule, MatIconModule, RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule, MatTooltipModule],
  templateUrl: './top-navbar.html',
  styleUrl: './top-navbar.less',
})
export class TopNavbar implements OnInit {
  workflowOpen = false;
  activeNav = '';
  userEmail = '';
  userName = '';
  avatarInitial = 'U';

  constructor(private router: Router, private loginService: Login) {

  }

  ngOnInit() {
   this.loadCurrentUser();

   this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.loadCurrentUser();
      const url = event.urlAfterRedirects;

      if (url === '/dashboard') {
        this.activeNav = 'dashboard';
      } 
      else if (url.startsWith('/mis')) {
        this.activeNav = 'mis';
        this.workflowOpen = true;
      } 
      else if (url.startsWith('/bom')) {
        this.activeNav = 'bom';
      }
      else if (url.startsWith('/stock')) {
        this.activeNav = 'stock';
      }
      else if (url.startsWith('/asset')) {
        this.activeNav = 'asset';
      }
      else if (url.startsWith('/onedrive')) {
        this.activeNav = 'onedrive';
      }
      else if (url.startsWith('/configuration')) {
        this.activeNav = 'configuration';
      }
    });
  }
  setActive(nav: string) {
    this.activeNav = nav;
  }

  toggleWorkflow() {
    this.workflowOpen = !this.workflowOpen;
  }

  logout(){
    this.loginService.clearInvalidSession();
    this.router.navigate(['/dashboard']);
  }

  private loadCurrentUser() {
    const user = this.loginService.getCurrentUser();
    const email = user.email || 'client@local';
    const fallbackName = email.includes('@') ? email.split('@')[0] : 'User';

    this.userEmail = email;
    this.userName = user.name || fallbackName;
    this.avatarInitial = (this.userName || email || 'U').trim().charAt(0).toUpperCase();
  }
}
