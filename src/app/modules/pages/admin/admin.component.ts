import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../shared/services/product.service';
import { FormsModule } from '@angular/forms';
import { MarcaModalComponent } from './components/marca/marca-modal.componte';
import { CategoriaModalComponent } from './components/categoria/categoria-modal.componte';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class AdminComponent implements OnInit {
  itensEstoqueBaixo: any[] = [];
  mostrarNotificacoes: boolean = true;

  categorias: any[] = [];
  marcas: any[] = [];

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carregarEstoqueBaixo();
  }

  async carregarEstoqueBaixo() {
    try {
      const response = await this.productService.listProduct();
      this.itensEstoqueBaixo = (response.data || []).filter(
        (item: any) => item.quantidade <= item.quantidade_minima
      );
    } catch (error) {
      this.snackBar.open(
        'Erro ao carregar notificações de estoque.',
        'Fechar',
        { duration: 3000 }
      );
    }
  }



  async adicionarCategoria() {
    // lógica para abrir modal de categoria
    const dialogRef = this.dialog.open(CategoriaModalComponent, {
      width: '900px',
      maxWidth: 'none',
      data: {
        isEdit: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Categoria adicionada:', result);
        //this.listarMarcas();
      }
    });
  }
  async listarCategorias(): Promise<void> {
    try {
      const response = await this.productService.listCategory();
      this.categorias = response.data || [];
    } catch (error) {
      this.snackBar.open('Erro ao listar categorias', 'Fechar', { duration: 3000 });
    }
  }

  async excluirCategoria(): Promise<void> {
    // lógica para excluir categoria
  }

  async adicionarMarca(): Promise<void> {
    const dialogRef = this.dialog.open(MarcaModalComponent, {
      width: '900px',
      maxWidth: 'none',
      data: {
        isEdit: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Marca adicionada:', result);
        //this.listarMarcas();
      }
    });
  }

  async listarMarcas() {
    try {
      const response = await this.productService.listBrand();
      this.marcas = response.data || [];
    } catch (error) {
      this.snackBar.open('Erro ao listar marcas', 'Fechar', { duration: 3000 });
    }
  }

  async excluirMarca() {
  }

  adicionarProduto() {
    // lógica para abrir modal de produto
  }
  adicionarCliente() {
    // lógica para abrir modal de cliente
  }
  abrirRelatorio() {
    // lógica para abrir relatórios
  }
  editarProduto(item: any) {
    // lógica para editar produto
  }
  excluirProduto(item: any) {
    // lógica para excluir produto
  }
}
