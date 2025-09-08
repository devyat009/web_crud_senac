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

  mostrarCategorias: boolean = false;
  categorias: any[] = [];

  mostrarMarcas: boolean = false;
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
      console.log('Categorias listadas:', this.categorias);
    } catch (error) {
      this.snackBar.open('Erro ao listar categorias', 'Fechar', { duration: 3000 });
    }
  }

  async excluirCategoria(item: any): Promise<void> {
    try {
      const response = await this.productService.deleteCategory(item.id_category);
      if (response.success) {
        this.snackBar.open('Categoria excluída com sucesso!', 'Fechar', { duration: 3000 });
        this.listarCategorias();
        this.mostrarCategorias = false;
        setTimeout(() => {
          this.mostrarCategorias = true;
        }, 3000);
      } else {
        this.snackBar.open('Erro ao excluir categoria: ' + (response.message || 'Erro desconhecido'), 'Fechar', { duration: 3000 });
      }
    } catch (error) {
      console.error(error);
      this.snackBar.open('Erro ao excluir categoria', 'Fechar', { duration: 3000 });
    }
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

  async editarCategoria(item: any): Promise<void> {
    try {
      const dialogRef = this.dialog.open(CategoriaModalComponent, {
        width: '900px',
        maxWidth: 'none',
        data: {
          isEdit: true,
          categoria: item
        }
      });
      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) {
          console.log('Categoria editada:', result);
          // const response = await this.productService.editCategory(result);
          //this.listarCategorias();
          this.mostrarCategorias = false;
          setTimeout(() => {
            this.mostrarCategorias = true;
          }, 3000);
        }
      });
    } catch (error) {
      console.error(error);
      this.snackBar.open('Erro ao editar categoria', 'Fechar', { duration: 3000 });
    }
  }

  toggleListarCategorias() {
    this.mostrarCategorias = !this.mostrarCategorias;
    if (this.mostrarCategorias) {
      this.mostrarNotificacoes = false;
      this.mostrarMarcas = false;
      this.listarCategorias();
    }
  }

  toggleListarMarcas() {
    this.mostrarMarcas = !this.mostrarMarcas;
    if (this.mostrarMarcas) {
      this.mostrarNotificacoes = false;
      this.mostrarCategorias = false;
      this.listarMarcas();
    }
  }

  async listarMarcas() {
    try {
      const response = await this.productService.listBrand();
      this.marcas = response.data || [];
      console.log('Marcas listadas:', this.marcas);
    } catch (error) {
      this.snackBar.open('Erro ao listar marcas', 'Fechar', { duration: 3000 });
    }
  }
  async editarMarca(item: any) {
    try {
      const dialogRef = this.dialog.open(MarcaModalComponent, {
        width: '900px',
        maxWidth: 'none',
        data: {
          isEdit: true,
          marca: item // Exemplo: passando a primeira marca para edição
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log('Marca editada:', result);
          //const response = await this.productService.editBrand(result);
          //this.listarMarcas();
        }
      });
    } catch (error) {
      console.error(error);
      this.snackBar.open('Erro ao editar marca', 'Fechar', { duration: 3000 });
    }
  }

  async excluirMarca(item: any) {
    try {
      const response = await this.productService.deleteBrand(item.id_brand);
      if (response.success) {
        this.snackBar.open('Marca excluída com sucesso!', 'Fechar', { duration: 3000 });
        //this.listarMarcas();
      } else {
        this.snackBar.open('Erro ao excluir marca: ' + (response.message || 'Erro desconhecido'), 'Fechar', { duration: 3000 });
      }
    } catch (error) {
      console.error(error);
      this.snackBar.open('Erro ao excluir marca', 'Fechar', { duration: 3000 });
    }
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
