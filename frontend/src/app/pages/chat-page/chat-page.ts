import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './chat-page.html',
  styleUrls: ['./chat-page.css'],
})
export class ChatPageComponent implements OnInit, OnDestroy {
  @ViewChild('messagesEnd') messagesEnd!: ElementRef;

  requestId!: number;
  request: any = null;
  messages: any[] = [];
  newMessage = '';
  currentUser: any = null;
  sending = false;
  error = '';
  accessDenied = false;

  showRating = false;
  ratingScore = 5;
  ratingComment = '';
  ratingDone = false;

  private pollInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private requestService: RequestService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.currentUser = this.auth.getUser();
    this.requestId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRequest();
    this.loadMessages();
    this.pollInterval = setInterval(() => this.loadMessages(), 4000);
  }

  loadRequest() {
    this.requestService.getRequest(this.requestId).subscribe({
      next: (r) => {
        this.request = r;
        // Проверка доступа: только requester или helper могут видеть чат
        if (!r || !this.currentUser || (r.requester?.id !== this.currentUser.id && r.helper?.id !== this.currentUser.id)) {
          this.accessDenied = true;
          this.error = 'У вас нет доступа к этому чату.';
        }
      },
      error: (err) => {
        this.error = 'Ошибка загрузки запроса.';
        this.accessDenied = true;
      }
    });
  }

  loadMessages() {
    if (this.accessDenied) return;
    this.chatService.getMessages(this.requestId).subscribe({
      next: (msgs) => {
        this.messages = msgs;
        setTimeout(() => this.scrollToBottom(), 50);
      },
      error: (err) => {
        this.error = 'Ошибка загрузки сообщений.';
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || this.sending || this.accessDenied) return;
    this.sending = true;
    const content = this.newMessage.trim();
    this.newMessage = '';
    this.chatService.sendMessage(this.requestId, content).subscribe({
      next: (msg) => {
        this.messages.push(msg);
        this.sending = false;
        setTimeout(() => this.scrollToBottom(), 50);
      },
      error: () => {
        this.sending = false;
        this.error = 'Ошибка отправки сообщения.';
      },
    });
  }

  completeRequest() {
    this.requestService.completeRequest(this.requestId).subscribe({
      next: (r) => { this.request = r; this.showRating = true; },
    });
  }

  submitRating() {
    this.chatService.submitRating(this.requestId, this.ratingScore, this.ratingComment).subscribe({
      next: () => { this.ratingDone = true; this.showRating = false; },
    });
  }

  isOwnMessage(msg: any): boolean {
    return msg.sender?.id === this.currentUser?.id;
  }

  isRequester(): boolean {
    return this.request?.requester?.id === this.currentUser?.id;
  }

  canComplete(): boolean {
    return this.request?.status === 'ACCEPTED' && this.isRequester();
  }

  scrollToBottom() {
    this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
  }

  goBack() {
    this.router.navigate(['/map']);
  }

  ngOnDestroy() {
    clearInterval(this.pollInterval);
  }
}
