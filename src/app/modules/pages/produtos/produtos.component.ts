import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { MatDialog } from '@angular/material/dialog';
import { ProdutosModalComponent } from './Components/produtos-modal/produtos-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../shared/services/product.service';
import { ConfirmModalComponent, ConfirmModalData } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
  ]
})
export class ProdutosComponent implements OnInit {

  produtos: any[] = [];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private readonly productService: ProductService
  ) {}

  async ngOnInit() {
    await this.listarProdutos();
  }

  async listarProdutos(): Promise<void> {
    console.log('Listar produtos');
    try {
      const response = await this.productService.listProduct();
      this.produtos = response.data;
      console.log('Produtos listados com sucesso:', this.produtos);
    } catch (error:any) {
      console.error('Erro ao listar produtos:', error);
      const errorMessage = error?.error?.detail?.message || error?.message || 'Erro desconhecido';
      this.snackBar.open('Erro ao listar produtos: ' + errorMessage, 'Fechar', {
        duration: 4200,
      });
    }
  }

  adicionarProduto(): void {
    const dialogRef = this.dialog.open(ProdutosModalComponent, {
      width: '900px',
      maxWidth: 'none',
      data: {
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Produto adicionado:', result);
        this.listarProdutos();
      }
    });
  }

  editarProduto(produto: any): void {
    const dialogRef = this.dialog.open(ProdutosModalComponent, {
      width: '900px',
      maxWidth: 'none',
      data: {
        produto: produto,
        isEdit: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Produto editado:', result);
        // Aqui você atualizaria o produto na lista ou faria a chamada para a API
        const index = this.produtos.findIndex(p => p === produto);
        if (index !== -1) {
          this.produtos[index] = { ...this.produtos[index], ...result };
        }
      }
    });
  }

  async excluirProduto(produto: any): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '350px',
      data: {
        title: 'Excluir Produto',
        message: 'Tem certeza que deseja excluir este produto?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      } as ConfirmModalData
    });
    const confirmed = await dialogRef.afterClosed().toPromise();
    if (confirmed) {
      try {
        await this.productService.deleteProduct(produto.id);
        this.snackBar.open('Produto excluído com sucesso!', 'Fechar', {
          duration: 3000
        });
        this.listarProdutos();
      } catch (error:any) {
        console.error('Erro ao excluir produto:', error);
        const errorMessage = error?.error?.detail?.message || error?.message || 'Erro desconhecido';
        this.snackBar.open('Erro ao excluir produto: ' + errorMessage, 'Fechar', {
          duration: 4200,
        });
      }
    }
  }

  aplicarFiltro(): void {
    console.log('Aplicar filtros');
  }
}
