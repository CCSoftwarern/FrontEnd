import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Movimentacao } from '../models/movimentacao';
import { Correntista } from '../models/correntista';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApibancoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

login(usuario: string, senha: string): Observable<any> {
    const body = {
      username: usuario,
      password: senha
    };

    return this.http.post<any>(`${this.apiUrl}/login/`, body);
  }

movimentacoes(correntistaId: number): Observable<Movimentacao[]> {
  const token = localStorage.getItem('token'); // pega o token
  const headers = new HttpHeaders({
    'Authorization': `Token ${token}` 
  });

  return this.http.get<Movimentacao[]>(
    `${this.apiUrl}/extratos/${correntistaId}/extrato/`,
    { headers }  // passa o headers
  );
}

correntistas(): Observable<Correntista[]> {
  const token = localStorage.getItem('token'); // pega o token
  const headers = new HttpHeaders({
    'Authorization': `Token ${token}` 
  });

  return this.http.get<Correntista[]>(
    `${this.apiUrl}/correntistas/`,
    { headers }
  );
}

correntistaDetalhes(correntistaId: number): Observable<Correntista> {
  const token = localStorage.getItem('token'); // pega o token
  const headers = new HttpHeaders({
    'Authorization': `Token ${token}` 
  }); 
  return this.http.get<Correntista>(
    `${this.apiUrl}/correntistas/${correntistaId}/`,
    { headers }
  );
}

sacar(correntistaId: number, valor: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Token ${token}`
  });

  const body = {
    correntista_id: correntistaId,
		valor_saque: valor
    };
  return this.http.post<any>(
    `${this.apiUrl}/saques/sacar/`,
    body,
    { headers }
  );
}

depositar(correntistaId: number, valor: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Token ${token}`
  }); 
  const body = {
    correntista_id: correntistaId,
    valor_deposito: valor 
    };
  return this.http.post<any>(
    `${this.apiUrl}/depositos/depositar/`,
    body,
    { headers }
  );
}

transferir(correntistaIdOrigem: number, correntistaIdDestino: number, valor: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Token ${token}`
  });
  const body = {
    correntista_id: correntistaIdOrigem,
    valor_operacao: valor,
    CorrentistaBeneficiari_id: correntistaIdDestino
    };
  return this.http.post<any>(
    `${this.apiUrl}/transferencias/transferir/`,
    body,
    { headers }
  );
}

pagar(correntistaId: number, valor: number, descricao:string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Token ${token}`
  });

  const body = {
    correntista_id: correntistaId,
		valor_operacao: valor,
    descricao: descricao
    };
  return this.http.post<any>(
    `${this.apiUrl}/pagamentos/pagar/`,
    body,
    { headers }
  );
}



}
