import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../shared/services/auth.service';
import { CreateAccountRequestDto, LoginRequestDto } from './types/login.types';
import { UserService } from '../../../shared/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
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

  forgotPasswordForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    cpf: new FormControl<string>('', [Validators.required, Validators.pattern('^[0-9]{11}$')]),
    data_nascimento: new FormControl<string>('', [Validators.required]),
  });

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private snackBar: MatSnackBar,
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
          localStorage.setItem('loggedInUser', JSON.stringify({
            email: response.email,
            user_id: response.user_id,
            nome: response.nome
          }));
          // redirect to home or dashboard (to do)
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
    }
  }

  onForgotPassword() {
    // Password recovery logic
    console.log('Recuperação de senha solicitada');
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
