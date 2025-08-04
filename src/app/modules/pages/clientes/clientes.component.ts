import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ]
})
export class ClientesComponent implements OnInit {

  clientes = [
    { nome: 'Lorem', cpf: 'Ipsum', email: 'dolor', dataCadastro: 'sit', perfil: 'amet' }
  ];

  constructor() {}

  ngOnInit(): void {}

  adicionarCliente(): void {
    console.log('Adicionar novo cliente');
  }

  editarCliente(cliente: any): void {
    console.log('Editar cliente:', cliente);
  }

  excluirCliente(cliente: any): void {
    console.log('Excluir cliente:', cliente);
  }
}
