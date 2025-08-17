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
    const currentRoute = this.router.url;
    if(currentRoute.includes('/clientes')) {
      this.activeTab = 'users';
    } else if(currentRoute.includes('/produtos')) {
      this.activeTab = 'menu';
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    switch (tab) {
      case 'users':
        this.router.navigate(['/clientes']);
        break;
      case 'menu':
        this.router.navigate(['/produtos']);
        break;
      default:
        this.router.navigate(['/home']);
    }
    console.log('Tab ativa:', tab);
  }

  logout(): void {
    this.authService.Logout();
    console.log('Usuário deslogado, redirecionando para a página inicial');
  }

}
