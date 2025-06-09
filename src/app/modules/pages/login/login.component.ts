import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule
  ]
})
export class LoginComponent {

  loginForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    senha: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
  });

  toggleCreate = false;

  createAccountForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    senha: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    cpf: new FormControl<string>('', [Validators.required, Validators.pattern('^[0-9]{11}$')]),
    cnpj: new FormControl<string>('', [Validators.pattern('^[0-9]{14}$')]),
    nome: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    telefone: new FormControl<string>('', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]),
  });

  constructor() { }

  ngOnInit() {

  }

  onSubmit() {
    // Lógica de login aqui
    console.log(this.loginForm.value);
    if (this.loginForm.get('senha')?.value === '123456')
      {
        alert('O email teste@teste ja utiliza a senha 123456');
        this.loginForm.reset();
    }
  }

}
