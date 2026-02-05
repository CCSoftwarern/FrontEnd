import { Component, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ApibancoService } from '../../services/apibanco.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { WebsocketService } from '../../services/websocket-service.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {
  loginform: FormGroup;
  isloading = false;
  mensagem = '';
  recebidas: any[] = [];
  private sub!: Subscription;


  constructor(private apiBancoService: ApibancoService, private toastr: ToastrService, private router: Router, private ws: WebsocketService) {
    this.loginform = new FormGroup({
      usuario: new FormControl(''),
      senha: new FormControl('')
    });
    this.sub = this.ws.listen().subscribe((msg) => {
      this.recebidas.push(msg);
      this.toastr.info(`Mensagem recebida: ${msg.message}`, 'WebSocket'
      );
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.ws.close();
  }

  enviar() {
      this.ws.send({
        type: 'client',
        message: this.mensagem,
      });

      this.mensagem = '';
  }

  onLogin(): void {
    // Validação simples antes da requisição
    if (!this.loginform.value.usuario || !this.loginform.value.senha) {
      this.toastr.warning('Por favor, preencha usuário e senha.', 'Atenção');
      return;
    }
    this.isloading = true;
    this.apiBancoService.login(this.loginform.value.usuario, this.loginform.value.senha).subscribe({
      next: (res) => {
        // Exemplo: salvar token (caso o backend envie)
        if (res?.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user_id', res.user_id.toString());
          localStorage.setItem('username', res.username.toString());
          localStorage.setItem('email', res.email.toString());

        }

        this.toastr.success('Login realizado com sucesso!', 'Sucesso');
        this.isloading = false;
        // Redirecionar para página inicial
        this.router.navigate(['/principal']);
      },
      error: (err) => {
        this.isloading = false;
        console.error('Erro no login:', err);
        const msg =
          err.status === 401
            ? 'Usuário ou senha incorretos.'
            : 'Falha no login. Tente novamente.';
        this.toastr.error(msg, 'Erro');
      },
    });
  }

  onteste() {
    alert(this.loginform.value.usuario + ' - ' + this.loginform.value.senha);
  }

  onOpenChat() {
    this.router.navigate(['/chat']);
  }
}
