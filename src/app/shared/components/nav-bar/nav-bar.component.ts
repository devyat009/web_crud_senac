import { NgIf } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component ({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  standalone: true,
  imports: []
})
export class NavBarComponent implements OnInit {
  activeTab: string = 'users';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Initialization logic can go here
  }

  ngOnInit(): void {
    // Logic to execute on component initialization
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    console.log('Tab ativa:', tab);
  }

  logout(): void {
    // this.authService.Logout();
    console.log('Usuário deslogado, redirecionando para a página inicial');
  }

}
