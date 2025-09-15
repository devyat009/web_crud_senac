import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../../../shared/services/user.service';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-usuarios-modal-edit',
  templateUrl: './usuarios-modal-edit.component.html',
  styleUrls: ['./usuarios-modal-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgxMaskDirective,
  ]
})
export class UsuariosModalEditComponent implements OnInit {
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UsuariosModalEditComponent>,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    const u = this.data.user;
    this.form = this.fb.group({
      nome: [u?.nome || '', [Validators.required]],
      email: [u?.email || '', [Validators.required, Validators.email]],
      role: [u?.role || 'user', [Validators.required]],
      telefone: [u?.telefone || '', [Validators.required]],
      cpf: [u?.cpf || '', [Validators.required, Validators.minLength(11)]],
      is_active: [{ value: u?.is_active ? 'Ativo' : 'Inativo', disabled: true }]
    });
  }
  salvar() {
    if (this.form.invalid) return;
    const payload = {
      id_user: this.data.user.id_user,
      ...this.form.getRawValue(),
      is_active: this.data.user.is_active
    };
    this.userService.updateUser(payload).then((res: any) => {
      if (res?.success !== false) {
        this.snackBar.open('Usuário atualizado', 'Fechar', { duration: 3000 });
        this.dialogRef.close(true);
      } else {
        this.snackBar.open('Erro ao atualizar usuário', 'Fechar', { duration: 3000 });
      }
    }).catch(() => {
      this.snackBar.open('Erro ao atualizar usuário', 'Fechar', { duration: 3000 });
    });
  }
  fechar() {
    this.dialogRef.close(false);
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
