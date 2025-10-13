import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteService } from '../../../shared/services/cliente.service';
import { ClienteDto } from './Types/ClienteDto';
import { ClientesModalComponent } from './Components/clientes-modal/clientes-modal.component';
import { ConfirmModalComponent, ConfirmModalData } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskPipe } from 'ngx-mask';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    NgxMaskPipe,
    FormsModule
  ]
})
export class ClientesComponent implements OnInit {
  clientes: ClienteDto[] = [];
  filtroPesquisa: string = '';
  clientesFiltrados: ClienteDto[] = [];
  // Paginação
  paginaAtualClientes: number = 1;
  itensPorPagina: number = 10;

  get clientesPaginados(): ClienteDto[] {
    const inicio = (this.paginaAtualClientes - 1) * this.itensPorPagina;
    return this.clientesFiltrados.slice(inicio, inicio + this.itensPorPagina);
  }

  get clientesPageCount(): number {
    return Math.ceil(this.clientesFiltrados.length / this.itensPorPagina);
  }

  getPaginasArray(totalPaginas: number): number[] {
    return Array.from({length: totalPaginas}, (_, i) => i + 1);
  }

  mudarPaginaClientes(novaPagina: number) {
    this.paginaAtualClientes = novaPagina;
  }

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private readonly clienteService: ClienteService
  ) {}

  async ngOnInit() {
    console.log('loading clients');
    await this.listarClientes();
  }

  async listarClientes(): Promise<void> {
    try {
      const response = await this.clienteService.listCliente();
      if (response.success) {
        this.clientes = response.data;
        this.clientesFiltrados = [...this.clientes]; // Inicializa com todos os clientes
       // console.log('clientes carregados:', this.clientes);
      }
      console.log('clientes', this.clientes);
    } catch (error: any) {
      const errorMessage = error?.error?.detail?.message || error?.message || 'Erro desconhecido';
      this.snackBar.open('Erro ao listar clientes: ' + errorMessage, 'Fechar', {
        duration: 4200,
      });
    }
  }

  adicionarCliente(): void {
    // Aqui você pode abrir um modal semelhante ao ProdutosModalComponent para adicionar cliente
    // Exemplo:
    const dialogRef = this.dialog.open(ClientesModalComponent, { data: { isEdit: false } });
    dialogRef.afterClosed().subscribe(result => { if (result) this.listarClientes(); });
  }

  editarCliente(cliente: ClienteDto): void {
    const dialogRef = this.dialog.open(ClientesModalComponent, { data: { cliente, isEdit: true } });
    dialogRef.afterClosed().subscribe(result => { if (result) this.listarClientes(); });
  }

  async excluirCliente(cliente: ClienteDto): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
          width: '350px',
          data: {
            title: 'Excluir Cliente',
            message: 'Tem certeza que deseja excluir este cliente?',
            confirmText: 'Excluir',
            cancelText: 'Cancelar'
          } as ConfirmModalData
        });
    const confirmed = await dialogRef.afterClosed().toPromise();
    if (confirmed && cliente.id_client) {
      try {
        await this.clienteService.deleteCliente(cliente.id_client);
        this.snackBar.open('Cliente excluído com sucesso!', 'Fechar', {
          duration: 3000
        });
        this.listarClientes();
      } catch (error: any) {
        const errorMessage = error?.error?.detail?.message || error?.message || 'Erro desconhecido';
        this.snackBar.open('Erro ao excluir cliente: ' + errorMessage, 'Fechar', {
          duration: 4200,
        });
      }
    }
  }

  aplicarFiltro(): void {
    console.log('Aplicando filtro com termo:', this.filtroPesquisa);
    console.log('Total de clientes:', this.clientes.length);

    if (!this.filtroPesquisa || this.filtroPesquisa.trim() === '') {
      this.clientesFiltrados = [...this.clientes];
      this.paginaAtualClientes = 1;
      return;
    }

    const termoPesquisa = this.filtroPesquisa.toLowerCase().trim();
    const termoNumerico = termoPesquisa.replace(/\D/g, '');

    this.clientesFiltrados = this.clientes.filter(cliente => {
      const nome = (cliente.nome || '').toLowerCase();
      const email = (cliente.email || '').toLowerCase();
      const cpf = (cliente.cpf || '').replace(/\D/g, '');

      const matchNome = nome.includes(termoPesquisa);
      const matchEmail = email.includes(termoPesquisa);
      const matchCpf = termoNumerico && cpf.includes(termoNumerico);

      return matchNome || matchEmail || matchCpf;
    });
    // Resetar para primeira página ao aplicar filtro
    this.paginaAtualClientes = 1;
  }
}
