import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private http = inject(HttpClient);
  private api = 'http://localhost:8000/api';

  getMessages(requestId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.api}/messages/?request_id=${requestId}`);
  }

  sendMessage(requestId: number, content: string): Observable<Message> {
    return this.http.post<Message>(`${this.api}/messages/`, { request_id: requestId, content });
  }

  submitRating(requestId: number, score: number, comment: string): Observable<{ status: string; score: number }> {
    return this.http.post<{ status: string; score: number }>(`${this.api}/ratings/`, { request_id: requestId, score, comment });
  }
}
