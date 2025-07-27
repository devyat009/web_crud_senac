import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../shared/services/auth.service';
import { CreateAccountRequestDto, LoginRequestDto } from './types/login.types';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    ButtonModule
  ]
})
export class LoginComponent {

  loginForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
  });

  toggleCreate = false;
  toggleForgot = false;

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
        private readonly userService: UserService
  ) {
  }

  ngOnInit() {

  }

  onSubmit() {
    // Lógica de login aqui
    // console.log(this.loginForm.value);
    // if (this.loginForm.get('senha')?.value === '123456')
    //   {
    //     alert('O email teste@teste ja utiliza a senha 123456');
    //     this.loginForm.reset();
    // }
  }

  async onCreateAccount() {
    console.log('creating account...');
    if (this.createAccountForm.valid) {
      const createAccountRequest: CreateAccountRequestDto = this.createAccountForm.value as CreateAccountRequestDto;
      try {
        const response = await this.userService.createAccount(createAccountRequest);
        console.log('Account created successfully:', response);
        // redirect to home or dashboard (to do)
      } catch (error) {
        console.error('Account creation failed:', error);
      }
    }
  }

  async onLogin() {
    console.log('logging in...');
    if (this.loginForm.valid) {
      const loginRequest: LoginRequestDto = this.loginForm.value as LoginRequestDto;
      try {
        const response = await this.authService.Login(loginRequest);
        console.log('Login successful:', response);
        // redirect to home or dashboard (to do)
      } catch (error) {
        console.error('Login failed:', error);
      }
    }
  }

  onForgotPassword() {
    // Password recovery logic
    console.log('Recuperação de senha solicitada');
  }

}
