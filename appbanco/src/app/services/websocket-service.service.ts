import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService{
  private socket$!: WebSocketSubject<any>;

  constructor() {
    this.socket$ = webSocket({
      url: 'ws://127.0.0.1:8000/ws/chat/',
      deserializer: e => JSON.parse(e.data),
      serializer: value => JSON.stringify(value)
    });
  }

  // Recebe mensagens do servidor
  listen() {
    return this.socket$.pipe(
      retry({ delay: 2000 }) // Reconnect automático
    );
  }

  // Envia mensagens para o servidor
  send(message: any) {
    this.socket$.next(message);
  }

  close() {
    this.socket$.complete();
  }
}
