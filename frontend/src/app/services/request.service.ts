import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HelpRequest } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class RequestService {
  private http = inject(HttpClient);
  private api = 'http://localhost:8000/api';

  createRequest(data: {
    category: string;
    latitude: number;
    longitude: number;
    radius_km?: number;
    description?: string;
  }): Observable<HelpRequest> {
    return this.http.post<HelpRequest>(`${this.api}/requests/`, data);
  }

  getMyRequests(): Observable<HelpRequest[]> {
    return this.http.get<HelpRequest[]>(`${this.api}/requests/`);
  }

  getNearby(lat: number, lon: number, radius = 20): Observable<HelpRequest[]> {
    return this.http.get<HelpRequest[]>(`${this.api}/requests/nearby/?lat=${lat}&lon=${lon}&radius=${radius}`);
  }

  getRequest(id: number): Observable<HelpRequest> {
    return this.http.get<HelpRequest>(`${this.api}/requests/${id}/`);
  }

  acceptRequest(id: number): Observable<HelpRequest> {
    return this.http.patch<HelpRequest>(`${this.api}/requests/${id}/`, { action: 'accept' });
  }

  completeRequest(id: number): Observable<HelpRequest> {
    return this.http.patch<HelpRequest>(`${this.api}/requests/${id}/`, { action: 'complete' });
  }

  cancelRequest(id: number): Observable<HelpRequest> {
    return this.http.patch<HelpRequest>(`${this.api}/requests/${id}/`, { action: 'cancel' });
  }
}
