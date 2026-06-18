import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { Login } from '../services/login';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, MatFormFieldModule, MatCardModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './login.html',
  styleUrl: './login.less',
})
export class login implements OnInit {
  email = '';
  password = '';
  mode: 'login' | 'forgot' | 'reset' = 'login';
  token: string = '';
  confirmPassword = '';
  floatLabelType: any = 'never';
  constructor(private loginService: Login, private route: ActivatedRoute, private router: Router, private snack: MatSnackBar) {
    const urlToken = this.route.snapshot.params['token'];
    if (urlToken) {
      this.mode = 'reset';
      this.token = urlToken;
    }
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (this.token) {
        this.mode = 'reset';   // automatically switch to reset screen
      }
    });
    const urlToken = this.route.snapshot.params['token'];
    if (urlToken) {
      this.mode = 'reset';
      this.token = urlToken;
    }

    if (this.mode === 'login' && this.loginService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }
  login() {
    this.loginService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        this.loginService.saveSession(res);
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.snack.open(
          err.error?.message || 'Login failed. Please try again.',
          'Close',
          {
            duration: 3000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  sendResetLink() {
    this.loginService.sendResetLink(this.email)
      .subscribe({
        next: () => {
          this.snack.open(
            'Reset link sent successfully.',
            'Close',
            {
              duration: 3000,
              panelClass: ['success-snackbar']
            }
          );
        },
        error: (err: any) => {
          this.snack.open(
            err.error.message || 'Failed to send reset link.',
            'Close',
            {
              duration: 3000,
              panelClass: ['error-snackbar']
            }
          );
        }
      });
  }

  resetPassword() {
    if (this.password !== this.confirmPassword) {
      this.snack.open('Passwords do not match.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.loginService.resetPassword(this.token, this.password).subscribe({
      next: () => {
        this.password = '';
        this.confirmPassword = '';
        this.mode = 'login';
        this.snack.open(
          "Password updated successfully.",
          'Close',
          {
            duration: 3000,
            panelClass: ['success-snackbar']
          }
        );
        this.router.navigate(['/login']);
      },
      error: err => {
        this.snack.open(
          err.error?.message || 'Failed to reset password.',
          'Close',
          {
            duration: 3000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  showForgotPassword() {
    this.password = '';
    this.mode = 'forgot';
  }

  showLogin() {
    this.password = '';
    this.confirmPassword = '';
    this.mode = 'login';
  }
}
