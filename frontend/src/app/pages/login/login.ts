import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  remember = false;
  errorMessage = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Заполните все поля';
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.auth.login({ username: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        if (res.user?.has_transport) {
          this.router.navigate(['/map']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Неверный логин или пароль';
      },
    });
  }
}
