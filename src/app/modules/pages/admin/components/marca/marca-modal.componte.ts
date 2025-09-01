import { Component, inject, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from '../../../../../shared/services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface MarcaModalData {
  nome?: string;
}

@Component({
  selector: 'app-marca-modal',
  templateUrl: './marca-modal.component.html',
  styleUrls: ['./marca-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule
  ]
})
export class MarcaModalComponent {
  marcaForm = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.maxLength(50)])
  });
  private snackBar =  inject(MatSnackBar);

  constructor(
    public dialogRef: MatDialogRef<MarcaModalComponent>,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: MarcaModalData
  ) {
    if (data?.nome) {
      this.marcaForm.patchValue({ nome: data.nome });
    }
  }

  async onSave(): Promise<void> {
    if (this.marcaForm.valid) {
      try {
        const marcaResponse = await this.productService.createBrand(this.marcaForm.value.nome ?? '');
        if (marcaResponse.success) {
          this.snackBar.open('Marca criada com sucesso', 'Fechar', { duration: 3000 });
          console.log('marcaResponse', marcaResponse);
        }
        this.dialogRef.close(marcaResponse);
      } catch (error) {
        this.snackBar.open('Erro ao salvar marca', 'Fechar', { duration: 3000 });
        console.error('Erro ao salvar marca:', error);
      }
      this.marcaForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
