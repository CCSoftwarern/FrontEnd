

import { Component, OnDestroy } from '@angular/core';
import { WebsocketService } from '../../services/websocket-service.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

interface MensagemChat {
  autor: 'me' | 'other';
  texto: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnDestroy {

  mensagem = '';
  mensagens: MensagemChat[] = [];
  private sub!: Subscription;

  constructor(
    private ws: WebsocketService,
    private toastr: ToastrService,
    private router: Router
  ) {
    // mensagens recebidas
    this.sub = this.ws.listen().subscribe((msg) => {
      this.mensagens.push({
        autor: 'other',
        texto: msg.message
      });

      this.toastr.info(`Mensagem recebida`, 'WebSocket');
    });
  }

  enviar() {
    if (!this.mensagem.trim()) return;

    // adiciona local (direita)
    this.mensagens.push({
      autor: 'me',
      texto: this.mensagem
    });

    // envia para o websocket
    this.ws.send({
      type: 'client',
      message: this.mensagem
    });

    this.mensagem = '';
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.ws.close();
  }
}

