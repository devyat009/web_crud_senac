import { CommonModule } from '@angular/common';
import { Component, OnInit, NgModule } from '@angular/core';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { MatDialog } from '@angular/material/dialog';
import { ProdutosModalComponent } from './Components/produtos-modal/produtos-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../shared/services/product.service';
import { ConfirmModalComponent, ConfirmModalData } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class ProdutosComponent implements OnInit {

  produtos: any[] = [];
  produtosFiltrados: any[] = [];
  categorias: string[] = [
    'Eletrônicos',
    'Roupas',
    'Casa'
  ];
  marcas: string[] = [];
  filtroCategoria: string = '';
  filtroMarca: string = '';
  filtroSearch: string = '';
  filtroPrecoMin: number | null = null;
  filtroPrecoMax: number | null = null;

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
      this.produtosFiltrados = [...this.produtos]; // Inicializa com todos os produtos
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
    console.log('Aplicando filtro com termos:', {
      search: this.filtroSearch,
      categoria: this.filtroCategoria,
      marca: this.filtroMarca,
      precoMin: this.filtroPrecoMin,
      precoMax: this.filtroPrecoMax
    });

    this.produtosFiltrados = this.produtos.filter(produto => {
      // Filtro por texto (nome, modelo, marca, descrição)
      let matchTexto = true;
      if (this.filtroSearch && this.filtroSearch.trim()) {
        const termo = this.filtroSearch.toLowerCase().trim();
        const nome = (produto.nome_item || '').toLowerCase();
        const modelo = (produto.modelo || '').toLowerCase();
        const marca = (produto.marca || '').toLowerCase();
        const descricao = (produto.descricao || '').toLowerCase();
        
        matchTexto = nome.includes(termo) || 
                    modelo.includes(termo) || 
                    marca.includes(termo) || 
                    descricao.includes(termo);
      }

      // Filtro por categoria
      let matchCategoria = true;
      if (this.filtroCategoria && this.filtroCategoria.trim()) {
        matchCategoria = produto.categoria === this.filtroCategoria;
      }

      // Filtro por marca
      let matchMarca = true;
      if (this.filtroMarca && this.filtroMarca.trim()) {
        matchMarca = produto.marca === this.filtroMarca;
      }

      // Filtro por preço mínimo
      let matchPrecoMin = true;
      if (this.filtroPrecoMin !== null && this.filtroPrecoMin > 0) {
        matchPrecoMin = produto.preco >= this.filtroPrecoMin;
      }

      // Filtro por preço máximo
      let matchPrecoMax = true;
      if (this.filtroPrecoMax !== null && this.filtroPrecoMax > 0) {
        matchPrecoMax = produto.preco <= this.filtroPrecoMax;
      }

      return matchTexto && matchCategoria && matchMarca && matchPrecoMin && matchPrecoMax;
    });

    console.log('Produtos filtrados:', this.produtosFiltrados.length);
  }
}
