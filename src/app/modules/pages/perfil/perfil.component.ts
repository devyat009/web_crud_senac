import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../shared/services/user.service';
import { StorageService } from '../../../shared/services/storage.service';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskDirective
  ]
})
export class PerfilComponent implements OnInit {
  loading = true;
  userId?: number;

  form = new FormGroup({
    nome: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl<string>({value: '', disabled: true}, [Validators.required, Validators.email]),
    telefone: new FormControl<string>('', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]),
    cpf: new FormControl<string | null>(null, [Validators.pattern('^[0-9]{11}$')]),
    data_nascimento: new FormControl<string>('', [Validators.required])
  });

  constructor(
    private readonly userService: UserService,
    private readonly storage: StorageService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    const cached = this.storage.getItem('loggedInUser');
    if (!cached) {
      this.router.navigate(['/login']);
      return;
    }
    const current = JSON.parse(cached);
    this.userId = current?.user_id;

    try {
      const user = await this.userService.getUserById(this.userId as number);
      this.form.patchValue({
        nome: user?.nome ?? '',
        email: user?.email ?? '',
        telefone: user?.telefone ?? '',
        cpf: user?.cpf ?? null,
        data_nascimento: user?.data_nascimento ?? ''
      });
    } catch (e) {
      this.snackBar.open('Não foi possível carregar seus dados.', 'Fechar', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  async salvar(): Promise<void> {
    if (this.form.invalid || !this.userId) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: any = {
      id_user: this.userId,
      nome: this.form.value.nome,
      telefone: this.form.value.telefone,
      cpf: this.form.value.cpf,
      data_nascimento: this.form.value.data_nascimento,
    };

    try {
      const updatedUser = await this.userService.updateUser(payload);
      // Atualiza o cache do usuário no localStorage/storage
      const cached = this.storage.getItem('loggedInUser');
      if (cached) {
        const userCache = JSON.parse(cached);
        // Atualiza os campos relevantes
        userCache.nome = updatedUser?.nome ?? payload.nome;
        userCache.telefone = updatedUser?.telefone ?? payload.telefone;
        userCache.cpf = updatedUser?.cpf ?? payload.cpf;
        userCache.data_nascimento = updatedUser?.data_nascimento ?? payload.data_nascimento;
        this.storage.setItem('loggedInUser', JSON.stringify(userCache));
      }
      this.snackBar.open('Dados atualizados!', 'Fechar', { duration: 2000 });
      this.router.navigate(['/home']);
    } catch (e: any) {
      const msg = e?.error?.detail?.message || 'Erro ao salvar dados';
      this.snackBar.open(msg, 'Fechar', { duration: 4000 });
    }
  }

  isInvalid(name: string): boolean {
    const c = this.form.get(name);
    return !!(c && c.invalid && (c.touched || c.dirty));
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
