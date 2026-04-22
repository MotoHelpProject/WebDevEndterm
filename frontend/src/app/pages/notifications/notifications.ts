import { Component, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.css'],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private auth = inject(AuthService);
  private requestService = inject(RequestService);
  private router = inject(Router);

  requests: any[] = [];
  loading = true;
  error = '';
  lat = 51.18;
  lon = 71.45;
  private refreshInterval: any;

  ngOnInit() {
    this.locateAndLoad();
    this.refreshInterval = setInterval(() => this.loadNearby(), 15000);
  }

  private locateAndLoad() {
    this.loadNearby();
    if (isPlatformBrowser(this.platformId) && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.lat = pos.coords.latitude;
          this.lon = pos.coords.longitude;
          this.loadNearby();
        },
        () => {},
        { timeout: 5000, maximumAge: 60000 }
      );
    }
  }

  loadNearby() {
    this.loading = true;
    this.error = '';
    this.requestService.getNearby(this.lat, this.lon, 30).subscribe({
      next: (data) => {
        this.requests = data;
        this.loading = false;
        if (!data || data.length === 0) {
          this.error = 'Нет доступных запросов поблизости.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Ошибка загрузки запросов.';
      },
    });
  }

  accept(req: any) {
    this.requestService.acceptRequest(req.id).subscribe({
      next: () => this.router.navigate(['/chat', req.id]),
      error: (err) => {
        this.error = 'Ошибка принятия запроса. Возможно, он уже принят другим.';
      }
    });
  }

  getCategoryIcon(cat: string): string {
    return { GAS: '⛽', TOOL: '🔧', EVAC: '🚛' }[cat] ?? '🆘';
  }

  ngOnDestroy() {
    clearInterval(this.refreshInterval);
  }
}
