import { Component, inject, Inject, Injectable, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar} from '@angular/material/snack-bar';
import { ProductService } from '../../../../../shared/services/product.service';
import { ProductDto } from '../../Types/ProductDto';

export interface ProdutoModalData {
  produto?: any;
  isEdit?: boolean;
}

@Component({
  selector: 'app-produtos-modal',
  templateUrl: './produtos-modal.component.html',
  styleUrls: ['./produtos-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ]
})
export class ProdutosModalComponent implements OnInit {

  private snackBar =  inject(MatSnackBar);
  private productService =  inject(ProductService);

  produtoForm = new FormGroup({
    codigo_barras: new FormControl('', [Validators.required]),
    nome_item: new FormControl('', [Validators.required]),
    modelo: new FormControl('', [Validators.required]),
    codigo_sku: new FormControl(''),
    categoria: new FormControl('', [Validators.required]),
    marca: new FormControl('', [Validators.required]),
    tamanho: new FormControl(''),
    cor: new FormControl(''),
    preco: new FormControl('', [Validators.required, Validators.min(0)]),
    data: new FormControl(''),
    quantidade: new FormControl('', [Validators.required, Validators.min(0)]),
    quantidade_minima: new FormControl('', [Validators.required, Validators.min(0)]),
    descricao: new FormControl('', [Validators.required]),
    observacoes: new FormControl('')
  });

  constructor(
    public dialogRef: MatDialogRef<ProdutosModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: ProdutoModalData
  ) {}

  ngOnInit(): void {
    console.log('modal data', this.data);
    if (this.data.isEdit && this.data.produto) {
      this.produtoForm.patchValue(this.data.produto);
    }
  }

  async onSave(): Promise<void> {
    if (this.produtoForm.valid) {
      const formValue = this.produtoForm.value;
      const produtoData: ProductDto = {
        codigo_barras: formValue.codigo_barras ?? '',
        nome_item: formValue.nome_item ?? '',
        modelo: formValue.modelo ?? '',
        codigo_sku: formValue.codigo_sku ?? '',
        categoria: formValue.categoria ?? '',
        marca: formValue.marca ?? '',
        tamanho: formValue.tamanho ?? '',
        cor: formValue.cor ?? '',
        preco: Number(formValue.preco) ?? 0,
        data: new Date(formValue.data ?? new Date()),
        quantidade: Number(formValue.quantidade) ?? 0,
        quantidade_minima: Number(formValue.quantidade_minima) ?? 0,
        descricao: formValue.descricao ?? '',
        observacoes: formValue.observacoes ?? ''
      };
        // add
        if (!this.data.isEdit)
        {
          console.log('adding product');
          try {
            //logic here
            console.log('produtoData', produtoData);
            const createResponse = await this.productService.createProduct(produtoData);
            if (createResponse.success) {
              this.snackBar.open('O produto foi salvo com sucesso!', 'Fechar', {
              duration:3000
              });
              console.log('responseCreate', createResponse);
            }
            else {
              this.snackBar.open('Erro ao salvar o produto: ' + (createResponse.message || 'Erro desconhecido'), 'Fechar', {
                duration: 4200,
              });
              console.error('Product creation failed:', createResponse);
            }
          } catch (error:any) {
            console.error('Product creation failed:', error);
            const errorMessage = error?.error?.detail?.message || error?.message || 'Erro desconhecido';
            this.snackBar.open('Erro ao criar conta: ' + errorMessage, 'Fechar', {
              duration: 4200,
            });
          }
        }
        // edit
        else {
          console.log('editing:', this.produtoForm.value)
          try {
            const editResponse = await this.productService.editProduct(produtoData);
            if (editResponse.success) {
              this.snackBar.open('O produto foi editado com sucesso!', 'Fechar', {
                duration: 3000
              });
              console.log('responseEdit', editResponse);
            } else {
              this.snackBar.open('Erro ao editar o produto: ' + (editResponse.message || 'Erro desconhecido'), 'Fechar', {
                duration: 4200,
              });
              console.error('Product edition failed:', editResponse);
            }
          } catch (error:any) {
            console.error('Product edition failed:', error);
            const errorMessage = error?.error?.detail?.message || error?.message || 'Erro desconhecido';
            this.snackBar.open('Erro ao criar conta: ' + errorMessage, 'Fechar', {
              duration: 4200,
            });
          }
          this.snackBar.open('O produto foi editado com sucesso!', 'Fechar', {
            duration:3000
          });
        }
        this.dialogRef.close(produtoData);
    } else {
      this.snackBar.open('Por favor preencha corretamente todos os campos obrigatórios', 'Fechar', {
          duration:3000
        });
      Object.values(this.produtoForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  isValid(controlName: string, form: FormGroup): boolean {
    const control = form.get(controlName);
    return !!( control && control.valid && (control.touched || control.dirty) );
  }

  isInvalid(controlName: string, form: FormGroup): boolean {
    const control = form.get(controlName);
    return !!( control && control.invalid && (control.touched || control.dirty) );
  }

}
