import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ApibancoService } from '../../services/apibanco.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginform: FormGroup;
  isloading = false;

  constructor(private apiBancoService: ApibancoService, private toastr: ToastrService, private router: Router) {
    this.loginform = new FormGroup({
      usuario: new FormControl(''),
      senha: new FormControl('')
    });
  }   
   

onLogin(): void {
  // Validação simples antes da requisição
  if (!this.loginform.value.usuario|| !this.loginform.value.senha) {
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

onteste()
{
  alert(this.loginform.value.usuario + ' - ' + this.loginform.value.senha);
}
}
