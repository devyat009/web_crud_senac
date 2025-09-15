import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteService } from '../../../../../shared/services/cliente.service';
import { ClienteDto } from '../../Types/ClienteDto';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

export interface ClienteModalData {
  cliente?: ClienteDto;
  isEdit?: boolean;
}

@Component({
  selector: 'app-clientes-modal',
  templateUrl: './clientes-modal.component.html',
  styleUrls: ['./clientes-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    NgxMaskDirective,
  ]
})
export class ClientesModalComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private clienteService = inject(ClienteService);

  clienteForm = new FormGroup({
    nome: new FormControl('', [Validators.required]),
    cpf: new FormControl('', [Validators.required, Validators.minLength(11)]),
    cnpj: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    endereco: new FormControl('', [Validators.required]),
    telefone: new FormControl('', [Validators.required]),
    data_nascimento: new FormControl('', [Validators.required]),
    perfil: new FormControl({ value: 'user', disabled: true }, Validators.required),
    ativo: new FormControl(true, [Validators.required])
  });

  constructor(
    public dialogRef: MatDialogRef<ClientesModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: ClienteModalData
  ) {}

  ngOnInit(): void {
    if (this.data.isEdit && this.data.cliente) {
      const cliente = { ...this.data.cliente };
      // data_nascimento deve ser string yyyy-MM-dd
      let dataNascimentoStr = '';
      if (
        typeof cliente.data_nascimento === 'object' &&
        cliente.data_nascimento !== null &&
        'getFullYear' in cliente.data_nascimento
      ) {
        const d = cliente.data_nascimento as Date;
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        dataNascimentoStr = `${yyyy}-${mm}-${dd}`;
      } else if (typeof cliente.data_nascimento === 'string') {
        dataNascimentoStr = cliente.data_nascimento;
      }
      this.clienteForm.patchValue({ ...cliente, data_nascimento: dataNascimentoStr });
    }
  }

  async onSave(): Promise<void> {
    if (this.clienteForm.valid) {
      const formValue = this.clienteForm.value;
      const clienteData: ClienteDto = {
        nome: formValue.nome ?? '',
        cpf: formValue.cpf ?? '',
        cnpj: formValue.cnpj ?? '',
        email: formValue.email ?? '',
        endereco: formValue.endereco ?? '',
        telefone: formValue.telefone ?? '',
        data_nascimento: formValue.data_nascimento ?? '',
        perfil: formValue.perfil ?? '',
        ativo: formValue.ativo ?? true
      };
      if (this.data.isEdit && this.data.cliente?.id_client) {
        clienteData.id_client = this.data.cliente.id_client;
        try {
          const editResponse: any = await this.clienteService.editCliente(clienteData);
          if (editResponse.success) {
            this.snackBar.open('Cliente editado com sucesso!', 'Fechar', { duration: 3000 });
          } else {
            this.snackBar.open('Erro ao editar cliente: ' + (editResponse.message || 'Erro desconhecido'), 'Fechar', { duration: 4200 });
          }
        } catch (error: any) {
          const errorMessage = error?.error?.detail?.message || error?.message || 'Erro desconhecido';
          this.snackBar.open('Erro ao editar cliente: ' + errorMessage, 'Fechar', { duration: 4200 });
        }
      } else {
        try {
          const createResponse: any = await this.clienteService.createCliente(clienteData);
          if (createResponse.success) {
            this.snackBar.open('Cliente criado com sucesso!', 'Fechar', { duration: 3000 });
          } else {
            this.snackBar.open('Erro ao criar cliente: ' + (createResponse.message || 'Erro desconhecido'), 'Fechar', { duration: 4200 });
          }
        } catch (error: any) {
          const errorMessage = error?.error?.detail?.message || error?.message || 'Erro desconhecido';
          this.snackBar.open('Erro ao criar cliente: ' + errorMessage, 'Fechar', { duration: 4200 });
        }
      }
      this.dialogRef.close(clienteData);
    } else {
      this.snackBar.open('Preencha todos os campos obrigatórios corretamente.', 'Fechar', { duration: 3000 });
      Object.values(this.clienteForm.controls).forEach(control => control.markAsTouched());
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
