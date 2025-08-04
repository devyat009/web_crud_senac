import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../shared/services/auth.service';
import { CreateAccountRequestDto, LoginRequestDto, ForgotPasswordRequestDto, ChangePasswordRequestDto } from './types/login.types';
import { UserService } from '../../../shared/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from '../../../shared/services/storage.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    ButtonModule,
    CommonModule
  ]
})
export class LoginComponent {

  loginForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
  });

  toggleCreate$ = new BehaviorSubject<boolean>(false);
  toggleForgot$ = new BehaviorSubject<boolean>(false);


  createAccountForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    confirm_password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    cpf: new FormControl<string>('', [Validators.required, Validators.pattern('^[0-9]{11}$')]),
    cnpj: new FormControl<string>('', [Validators.pattern('^[0-9]{14}$')]),
    nome: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    telefone: new FormControl<string>('', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]),
    data_nascimento: new FormControl<string>('', [Validators.required]),
  });

  forgotStep$ = new BehaviorSubject<number>(1); // 1: verify data, 2: change password

  forgotPasswordForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    cpf: new FormControl<string>('', [Validators.required, Validators.pattern('^[0-9]{11}$')]),
    data_nascimento: new FormControl<string>('', [Validators.required]),
  });

  forgotResponseData: any;

  resetPasswordForm = new FormGroup({
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    confirm_password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private snackBar: MatSnackBar,
    private readonly storageService: StorageService,
    private readonly router: Router
  ) {
    this.toggleCreate$.subscribe(value => {
      if (!value) {
        this.createAccountForm.reset();
        Object.values(this.createAccountForm.controls).forEach(control => {
          control.setErrors(null);
          control.markAsUntouched();
          control.markAsPristine();
        });
        console.log('Create account form reset');
      }
    });


    this.toggleForgot$.subscribe(value => {
      if (!value) {
        this.forgotPasswordForm.reset();
        Object.values(this.forgotPasswordForm.controls).forEach(control => {
          control.setErrors(null);
          control.markAsUntouched();
          control.markAsPristine();
        });

      }
    });
  }

  ngOnInit() {

  }

  async onCreateAccount() {
    console.log('creating account...');
    if (this.createAccountForm.valid) {
      const createAccountRequest: CreateAccountRequestDto = this.createAccountForm.value as CreateAccountRequestDto;
      try {
        if (createAccountRequest.password !== createAccountRequest.confirm_password) {
          this.snackBar.open('As senhas não coincidem.', 'Fechar', {
            duration: 3000,
          });
          return;
        }
        if (createAccountRequest.cpf && createAccountRequest.cpf.length !== 11) {
          this.snackBar.open('CPF deve ter 11 dígitos.', 'Fechar', {
            duration: 3000,
          });
          return;
        }
        if (createAccountRequest.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createAccountRequest.email)) {
          this.snackBar.open('Email inválido.', 'Fechar', {
            duration: 3000,
          });
          return;
        }
        const response = await this.userService.createAccount(createAccountRequest);
        if (response.id_user) {
          console.log('Account created successfully:', response);
          this.snackBar.open('Conta criada com sucesso!', 'Fechar', {
            duration: 3000,
          });
          this.createAccountForm.reset();
          this.setToggleCreate(false);
        } else {
          console.warn('Account creation failed:', response);
          this.snackBar.open('Erro ao criar conta: ' + response.detail.message, 'Fechar', {
            duration: 4200
          });
        }
      } catch (error: any) {
        console.error('Account creation failed:', error);
        const errorMessage = error?.error?.detail?.message || error?.message || 'Erro desconhecido';
        this.snackBar.open('Erro ao criar conta: ' + errorMessage, 'Fechar', {
          duration: 4200,
        });
      }
    } else {
      this.snackBar.open('Por favor, preencha todos os campos corretamente.', 'Fechar', {
        duration: 3000,
      });
      Object.values(this.createAccountForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
          control.updateValueAndValidity();
        }
      });
    }
  }

  async onLogin() {
    console.log('logging in...');
    if (this.loginForm.valid) {
      const loginRequest: LoginRequestDto = this.loginForm.value as LoginRequestDto;
      try {
        const response = await this.authService.Login(loginRequest);
        if (response.success) {
          this.snackBar.open('Login realizado com sucesso!', 'Fechar', {
            duration: 3000,
          });
          console.log('Login successful:', response);
          this.storageService.setItem('loggedInUser', JSON.stringify({
            email: response.email,
            user_id: response.user_id,
            nome: response.nome
          }));
          this.router.navigate(['/home']);
        }
      } catch (error: any) {
        console.error('Account creation failed:', error);
        const errorMessage = error?.error?.detail?.message || error?.message || 'Erro desconhecido';
        this.snackBar.open('Erro ao realizar login: ' + errorMessage, 'Fechar', {
          duration: 4200,
        });
      }
    } else {
      this.snackBar.open('Por favor, preencha todos os campos corretamente.', 'Fechar', {
        duration: 3000,
      });
    }
  }

async onForgotPassword() {
  if (this.forgotPasswordForm.valid) {
    try {
      const forgotData: ForgotPasswordRequestDto = {
        email: this.forgotPasswordForm.value.email ?? '',
        cpf: this.forgotPasswordForm.value.cpf ?? '',
        data_nascimento: this.forgotPasswordForm.value.data_nascimento ?? ''
      };
      const response = await this.authService.ConfirmDataForgotPassword(forgotData);
      if (response.success) {
        this.forgotResponseData = response;
        console.log('Dados verificados com sucesso:', response);
        this.snackBar.open('Dados verificados com sucesso!', 'Fechar', { duration: 2000 });
        this.forgotStep$.next(2);
      } else {
        console.warn('Erro ao verificar dados:', response);
        this.snackBar.open('Erro ao verificar dados: ' + response.detail.message, 'Fechar', { duration: 4200 });
      }
    } catch (error: any) {
      console.error('Erro ao verificar dados:', error);
      const errorMessage = error?.error?.detail?.message || error?.message || 'Erro desconhecido';
      this.snackBar.open('Erro ao verificar dados: ' + errorMessage, 'Fechar', { duration: 4200 });
    }
  } else {
    this.snackBar.open('Preencha todos os campos corretamente.', 'Fechar', { duration: 3000 });
    Object.values(this.forgotPasswordForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });
  }
}

  onResetPassword() {
    if (this.resetPasswordForm.valid) {
      const { password, confirm_password } = this.resetPasswordForm.value;
      if (password !== confirm_password) {
        this.resetPasswordForm.get('confirm_password')?.setErrors({ invalid: true });
        this.snackBar.open('As senhas não coincidem.', 'Fechar', { duration: 3000 });
        return;
      }
      try {
        const changePasswordRequest: ChangePasswordRequestDto = {
          user_id: this.forgotResponseData.user_id,
          password: this.resetPasswordForm.value.password ?? '',
          confirm_password: this.resetPasswordForm.value.confirm_password ?? ''
        };
        this.authService.ChangePassword(changePasswordRequest).then(response => {
          if (response.success) {
            console.log('Senha alterada com sucesso:', response);
            this.snackBar.open('Senha alterada com sucesso!', 'Fechar', { duration: 3000 });
            this.setToggleForgot(false);
            this.forgotStep$.next(1);
            this.forgotPasswordForm.reset();
            this.resetPasswordForm.reset();
          } else {
            console.warn('Erro ao alterar senha:', response);
            this.snackBar.open('Erro ao alterar senha: ' + response.detail.message, 'Fechar', { duration: 4200 });
          }
        });
      } catch (error: any) {
        console.error('Erro ao alterar senha:', error);
        const errorMessage = error?.error?.detail?.message || error?.message || 'Erro desconhecido';
        this.snackBar.open('Erro ao alterar senha: ' + errorMessage, 'Fechar', { duration: 4200 });
        return;
      }
      this.snackBar.open('Senha alterada com sucesso!', 'Fechar', { duration: 3000 });
      this.setToggleForgot(false);
      this.forgotStep$.next(1);
      this.forgotPasswordForm.reset();
      this.resetPasswordForm.reset();
    } else {
      this.snackBar.open('Preencha todos os campos corretamente.', 'Fechar', { duration: 3000 });
      Object.values(this.resetPasswordForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
          control.updateValueAndValidity();
        }
      });
    }
  }
  backForgotStep() {
    if (this.forgotStep$.value === 2) {
      this.forgotStep$.next(1);
      this.resetPasswordForm.reset();
    } else {
      this.setToggleForgot(false);
    }
  }

  isValid(controlName: string, form: FormGroup): boolean {
    const control = form.get(controlName);
    return !!( control && control.valid && (control.touched || control.dirty) );
  }

  isInvalid(controlName: string, form: FormGroup): boolean {
    const control = form.get(controlName);
    return !!( control && control.invalid && (control.touched || control.dirty) );
  }

  setToggleCreate(value: boolean) {
    this.toggleCreate$.next(value);
  }

  setToggleForgot(value: boolean) {
    this.toggleForgot$.next(value);
  }

}
