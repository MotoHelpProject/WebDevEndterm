import { Component, OnInit, OnDestroy, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './map.html',
  styleUrls: ['./map.css'],
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private auth = inject(AuthService);
  private requestService = inject(RequestService);
  private router = inject(Router);

  user: any = null;
  lat = 51.18;
  lon = 71.45;

  private map: any = null;
  private userMarker: any = null;
  private nearbyMarkers: any[] = [];

  showSosPanel = false;
  selectedCategory = '';
  sosDescription = '';
  sosLoading = false;

  nearbyRequests: any[] = [];
  myActiveRequest: any = null;

  private nearbyInterval: any;

  categories = [
    { value: 'GAS', label: 'Бензин', icon: '⛽' },
    { value: 'TOOL', label: 'Инструмент', icon: '🔧' },
    { value: 'EVAC', label: 'Эвакуация', icon: '🚛' },
  ];

  ngOnInit() {
    this.user = this.auth.getUser();
    this.loadMyRequests();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initMap();
    }
  }

  private initMap() {
    import('leaflet').then((L) => {
      this.map = L.map('leaflet-map').setView([this.lat, this.lon], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(this.map);

      this.locateUser(L);
    });
  }

  private locateUser(L: any) {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.lat = pos.coords.latitude;
        this.lon = pos.coords.longitude;
        this.map.setView([this.lat, this.lon], 14);
        this.auth.updateLocation(this.lat, this.lon).subscribe();
        this.placeUserMarker(L);
        this.loadNearby();
        this.nearbyInterval = setInterval(() => this.loadNearby(), 15000);
      },
      () => {
        this.placeUserMarker(L);
        this.loadNearby();
        this.nearbyInterval = setInterval(() => this.loadNearby(), 15000);
      }
    );
  }

  private placeUserMarker(L: any) {
    if (this.userMarker) this.userMarker.remove();
    const icon = L.divIcon({ className: '', html: '<div class="u-marker">YOU</div>', iconSize: [48, 24] });
    this.userMarker = L.marker([this.lat, this.lon], { icon })
      .addTo(this.map)
      .bindPopup(`<b>${this.user?.username || 'You'}</b>`);
  }

  loadNearby() {
    this.requestService.getNearby(this.lat, this.lon).subscribe({
      next: (data) => {
        this.nearbyRequests = data;
        this.drawNearbyMarkers(data);
      },
    });
  }

  private drawNearbyMarkers(requests: any[]) {
    import('leaflet').then((L) => {
      this.nearbyMarkers.forEach((m) => m.remove());
      this.nearbyMarkers = [];
      for (const r of requests) {
        const icon = L.divIcon({ className: '', html: `<div class="req-marker">${r.category}</div>`, iconSize: [48, 24] });
        const m = L.marker([r.latitude, r.longitude], { icon }).addTo(this.map);
        m.bindPopup(`<b>${r.category_display}</b><br>${r.requester.username}<br>${r.distance_km} km`);
        this.nearbyMarkers.push(m);
      }
    });
  }

  loadMyRequests() {
    this.requestService.getMyRequests().subscribe({
      next: (data) => {
        this.myActiveRequest = data.find((r: any) => ['PENDING', 'ACCEPTED'].includes(r.status)) ?? null;
      },
    });
  }

  submitSos() {
    if (!this.selectedCategory) return;
    this.sosLoading = true;
    this.requestService
      .createRequest({
        category: this.selectedCategory,
        latitude: this.lat,
        longitude: this.lon,
        description: this.sosDescription,
        radius_km: 15,
      })
      .subscribe({
        next: (res) => {
          this.myActiveRequest = res;
          this.showSosPanel = false;
          this.sosDescription = '';
          this.selectedCategory = '';
          this.sosLoading = false;
        },
        error: () => { this.sosLoading = false; },
      });
  }

  cancelRequest() {
    if (!this.myActiveRequest) return;
    this.requestService.cancelRequest(this.myActiveRequest.id).subscribe(() => {
      this.myActiveRequest = null;
    });
  }

  goToChat() {
    this.router.navigate(['/chat', this.myActiveRequest.id]);
  }

  logout() {
    this.auth.logout();
  }

  getCategoryIcon(cat: string): string {
    return { GAS: '⛽', TOOL: '🔧', EVAC: '🚛' }[cat] ?? '🆘';
  }

  ngOnDestroy() {
    clearInterval(this.nearbyInterval);
    if (this.map) this.map.remove();
  }
}
