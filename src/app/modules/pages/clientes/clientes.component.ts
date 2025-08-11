import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteService } from '../../../shared/services/cliente.service';
import { ClienteDto } from './Types/ClienteDto';
import { ClientesModalComponent } from './Components/clientes-modal/clientes-modal.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
  ]
})
export class ClientesComponent implements OnInit {
  clientes: ClienteDto[] = [];

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
    const confirmacao = confirm('Tem certeza que deseja excluir este cliente?');
    if (confirmacao && cliente.id_client) {
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
}
