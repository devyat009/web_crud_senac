import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    ButtonModule
  ]
})
export class HomeComponent {
}
