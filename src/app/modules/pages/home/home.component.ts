import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { StorageService } from '../../../shared/services/storage.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    RouterModule,
    MatSnackBarModule
  ]
})
export class HomeComponent implements OnInit {

  constructor(
    private readonly storageService: StorageService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private snackBar: MatSnackBar
  ) {

  }

  ngOnInit(): void {
    if (!this.storageService.getItem('loggedInUser')) {
      console.log('No user logged in, redirecting to login page');
      // this.snackBar.open('Você precisa estar logado para acessar esta página.', 'Fechar', {
      //   duration: 3000,
      // });
      this.router.navigate(['/login']);
    }
  }
}
