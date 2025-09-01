import { Component, inject, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from '../../../../../shared/services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface CategoriaModalData {
  nome?: string;
}

@Component({
  selector: 'app-categoria-modal',
  templateUrl: './categoria-modal.component.html',
  styleUrls: ['./categoria-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule
  ]
})
export class CategoriaModalComponent {
  categoriaForm = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.maxLength(50)])
  });
  private snackBar =  inject(MatSnackBar);

  constructor(
    public dialogRef: MatDialogRef<CategoriaModalComponent>,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: CategoriaModalData
  ) {
    if (data?.nome) {
      this.categoriaForm.patchValue({ nome: data.nome });
    }
  }

  async onSave(): Promise<void> {
    if (this.categoriaForm.valid) {
      try {
        const categoriaResponse = await this.productService.createCategory(this.categoriaForm.value.nome ?? '');
        if (categoriaResponse.success) {
          this.snackBar.open('Categoria criada com sucesso', 'Fechar', { duration: 3000 });
          console.log('categoriaResponse', categoriaResponse);
        }
        this.dialogRef.close(categoriaResponse);
      } catch (error) {
        this.snackBar.open('Erro ao salvar categoria', 'Fechar', { duration: 3000 });
        console.error('Erro ao salvar categoria:', error);
      }
      this.categoriaForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
