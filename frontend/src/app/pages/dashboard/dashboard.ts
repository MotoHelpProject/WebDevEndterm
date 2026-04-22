import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {
  brand = '';
  model = '';
  color = '';
  plateNumber = '';
  errorMessage = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.auth.getTransport().subscribe({
      next: (t: any) => {
        if (t) {
          this.brand = t.brand;
          this.model = t.model;
          this.color = t.color;
          this.plateNumber = t.plate_number;
        }
      },
    });
  }

  saveBikeInfo() {
    if (!this.brand || !this.model || !this.color || !this.plateNumber) {
      this.errorMessage = 'Заполните все поля';
      return;
    }
    this.loading = true;
    this.auth
      .saveTransport({ brand: this.brand, model: this.model, color: this.color, plate_number: this.plateNumber })
      .subscribe({
        next: () => this.router.navigate(['/map']),
        error: () => {
          this.loading = false;
          this.errorMessage = 'Ошибка сохранения';
        },
      });
  }
}
