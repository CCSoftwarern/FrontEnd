import { Component, OnInit,  inject, signal, TemplateRef, WritableSignal  } from '@angular/core';
import { Movimentacao } from '../../models/movimentacao';
import { Correntista } from '../../models/correntista';
import { ApibancoService } from '../../services/apibanco.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, ReactiveFormsModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent implements OnInit {
  movimentacoes: Movimentacao[] = [];
  correntistas: Correntista[] = [];
 correntistaid: number | null = null;
 saqueform: FormGroup;
 depositoform: FormGroup;
 transferirform: FormGroup;
 pagarform: FormGroup;

 private modalService = inject(NgbModal);
	closeResult: WritableSignal<string> = signal('');

  constructor(private apiBancoService: ApibancoService, private toastr: ToastrService) {
    // Inicializa o formulário de saque
    this.saqueform= new FormGroup({
      valor: new FormControl(0),
    });
    // Inicializa o formulário de depósito
    this.depositoform= new FormGroup({
      valor_deposito: new FormControl(0),
    });
    // Inicializa o formulário de transferência
    this.transferirform= new FormGroup({
      valor_transferencia: new FormControl(0),
      correntista_destino: new FormControl(0),
    });
    // Inicializa o formulário de pagamento
    this.pagarform= new FormGroup({
      valor_pagamento: new FormControl(0),
      descricao: new FormControl(''),
    });
  }
  ngOnInit(): void {

    this.onGetCorrentistaDetalhes();
    this.onGetMovimentacoes(localStorage.getItem('user_id') || '');
   
  }

  onGetMovimentacoes(id: string): void {
    // const correntistaId = 1; // Exemplo fixo, ajustar conforme necessário
    this.correntistaid = id ? Number(id) : null;
    if (this.correntistaid === null) {
      // no correntista selected — clear list and don't call the API
      this.movimentacoes = [];
      return;
    }
    this.apiBancoService.movimentacoes(this.correntistaid).subscribe({
      next: (data) => {
        console.log('Movimentações recebidas:', data);
        this.movimentacoes = data;
        this.toastr.success('Movimentações carregadas com sucesso!', 'Sucesso');
      },
      error: (err) => {
        console.error('Erro ao carregar movimentações:', err);
        this.toastr.error('Falha ao carregar movimentações.', 'Erro');
      }
    });

  }

  onGetCorrentistaDetalhes(): void {
    this.correntistaid = localStorage.getItem('user_id') ? Number(localStorage.getItem('user_id')) : null;
    if (this.correntistaid === null) {
      this.toastr.warning('Correntista ID não definido.', 'Atenção');
      return;
    } 
    this.apiBancoService.correntistaDetalhes(this.correntistaid).subscribe({
      next: (data) => {
        console.log('Detalhes do correntista recebidos:', data);
        this.correntistas = [data]; // Coloca o correntista em um array
        this.toastr.success('Detalhes do correntista carregados com sucesso!', 'Sucesso');
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes do correntista:', err);
        this.toastr.error('Falha ao carregar detalhes do correntista.', 'Erro');
      }
    });
  }

  onSacar(): void {
    if (this.correntistaid === null) {
      this.toastr.warning('Correntista ID não definido.', 'Atenção');
      return;
    }
    if (this.saqueform.value.valor <= 0) {
      this.toastr.warning('O valor do saque deve ser maior que zero.', 'Atenção');
      return;
    }
    if (this.saqueform.value.valor > this.correntistas[0].saldo) {
      this.toastr.warning('O valor do saque não pode ser maior que o saldo', 'Atenção');
      return;
    }
    this.apiBancoService.sacar(this.correntistaid, this.saqueform.value.valor).subscribe({
      next: (data) => {
        console.log('Saque realizado com sucesso:', data);
        this.toastr.success('Saque realizado com sucesso!', 'Sucesso');
        this.onGetCorrentistaDetalhes(); // Atualiza os detalhes do correntista
        this.onGetMovimentacoes(this.correntistaid!.toString()); // Atualiza as movimentações
        this.modalService.dismissAll() // Fecha o modal após o saque
      },
      error: (err) => {
        console.error('Erro ao realizar saque:', err);  
        this.toastr.error('Falha ao realizar saque.', 'Erro');
      }
    });
  }

 onDepositar(): void {
    if (this.correntistaid === null) {
      this.toastr.warning('Correntista ID não definido.', 'Atenção');
      return;
    }
    if (this.depositoform.value.valor_deposito <= 0) {
      this.toastr.warning('O valor do deposito deve ser maior que zero.', 'Atenção');
      return;
    }
    this.apiBancoService.depositar(this.correntistaid, this.depositoform.value.valor_deposito).subscribe({
      next: (data) => {
        console.log('Deposito realizado com sucesso:', data);
        this.toastr.success('Deposito realizado com sucesso!', 'Sucesso');
        this.onGetCorrentistaDetalhes(); // Atualiza os detalhes do correntista
        this.onGetMovimentacoes(this.correntistaid!.toString()); // Atualiza as movimentações
        this.modalService.dismissAll() // Fecha o modal após o saque
      },
      error: (err) => {
        console.error('Erro ao realizar o deposito:', err);  
        this.toastr.error('Falha ao realizar o deposito.', 'Erro');
      }
    });
  }

  onTransferir(): void {
    if (this.correntistaid === null) {
      this.toastr.warning('Correntista ID não definido.', 'Atenção');
      return;
    }
    if (this.transferirform.value.valor_operacao <= 0) {
      this.toastr.warning('O valor da transferência não pode ser menor ou igual a 0.', 'Atenção');
      return;
    }
    this.apiBancoService.transferir(this.correntistaid, this.transferirform.value.correntista_destino, this.transferirform.value.valor_transferencia).subscribe({
      next: (data) => {
        console.log('Transferência realizada com sucesso:', data);
        this.toastr.success('Transferência realizada com sucesso!', 'Sucesso');
        this.onGetCorrentistaDetalhes(); // Atualiza os detalhes do correntista
        this.onGetMovimentacoes(this.correntistaid!.toString()); // Atualiza as movimentações
        this.modalService.dismissAll() // Fecha o modal após o saque
      },
      error: (err) => {
        console.error('Erro ao realizar a transferência:', err);  
        this.toastr.error('Falha ao realizar a transferência.', 'Erro');
      }
    });
  }


  open(content: TemplateRef<any>) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult.set(`Closed with: ${result}`);
			},
			(reason) => {
				this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
			},
		);
	}

  onPagar(): void {
     if (this.correntistaid === null) {
      this.toastr.warning('Correntista ID não definido.', 'Atenção');
      return;
    }
    if (this.pagarform.value.valor_deposito <= 0) {
      this.toastr.warning('O valor do pagamento deve ser maior que zero.', 'Atenção');
      return;
    }
    if (this.pagarform.value.valor_pagamento > this.correntistas[0].saldo) {
      this.toastr.warning('O valor do pagamento não pode ser maior que o saldo', 'Atenção');
      return;
    }
    if (!this.pagarform.value.descricao || this.pagarform.value.descricao.trim() === '') {
      this.toastr.warning('A descrição do pagamento é obrigatória.', 'Atenção');
      return;
    }
    this.apiBancoService.pagar(this.correntistaid, this.pagarform.value.valor_pagamento, this.pagarform.value.descricao).subscribe({
      next: (data) => {
        console.log('Pagamento realizado com sucesso:', data);
        this.toastr.success('Pagamento realizado com sucesso!', 'Sucesso');
        this.onGetCorrentistaDetalhes(); // Atualiza os detalhes do correntista
        this.onGetMovimentacoes(this.correntistaid!.toString()); // Atualiza as movimentações
        this.modalService.dismissAll() // Fecha o modal após o saque
      },
      error: (err) => {
        console.error('Erro ao realizar pagamento:', err);  
        this.toastr.error('Falha ao realizar pagamento.', 'Erro');
      }
    });

  }

  private getDismissReason(reason: any): string {
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}
}
  
  // onGetCorrentistas(): void {
  //   this.apiBancoService.correntistas().subscribe({
  //     next: (data) => { 
  //       console.log('Correntistas recebidos:', data);
  //       this.correntistas = data;
  //       this.toastr.success('Correntistas carregados com sucesso!', 'Sucesso');
  //     },
  //     error: (err) => {
  //       console.error('Erro ao carregar correntistas:', err);
  //       this.toastr.error('Falha ao carregar correntistas.', 'Erro');
  //     }
  //   });
  // }
