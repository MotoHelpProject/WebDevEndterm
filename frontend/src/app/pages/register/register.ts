import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  phone = '';
  errorMessage = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onRegister() {
    if (!this.username || !this.email || !this.password) {
      this.errorMessage = 'Заполните все поля';
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.auth
      .register({ username: this.username, email: this.email, password: this.password, phone: this.phone })
      .subscribe({
        next: () => {
          // JWT сохранён в auth.service, сразу переходим к добавлению транспорта
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          this.loading = false;
          this.errorMessage =
            err.error?.username?.[0] || err.error?.email?.[0] || 'Ошибка регистрации';
        },
      });
  }
}
