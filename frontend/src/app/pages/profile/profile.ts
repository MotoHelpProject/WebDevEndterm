import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class ProfileComponent implements OnInit {
  user: any = null;
  transport: any = null;
  editMode = false;

  brand = '';
  model = '';
  color = '';
  plateNumber = '';
  saveMsg = '';

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.getMe().subscribe({
      next: (u) => { this.user = u; },
      error: () => { this.auth.logout(); },
    });
    this.auth.getTransport().subscribe({
      next: (t) => {
        this.transport = t;
        if (t) {
          this.brand = t.brand;
          this.model = t.model;
          this.color = t.color;
          this.plateNumber = t.plate_number;
        }
      },
    });
  }

  saveTransport() {
    this.auth.saveTransport({ brand: this.brand, model: this.model, color: this.color, plate_number: this.plateNumber })
      .subscribe({
        next: (t) => { this.transport = t; this.editMode = false; this.saveMsg = 'Сохранено ✓'; setTimeout(() => this.saveMsg = '', 2000); },
      });
  }

  logout() {
    this.auth.logout();
  }

  getStars(rating: number): number[] {
    return Array.from({ length: Math.round(rating) }, (_, i) => i + 1);
  }
}
