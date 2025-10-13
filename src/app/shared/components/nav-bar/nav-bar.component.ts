import { CommonModule, NgIf } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { filter } from "rxjs";

@Component ({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class NavBarComponent implements OnInit {
  activeTab: string = 'users';
  user: any;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Initialization logic can go here
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    if(this.user.role === 'admin') {
      // Logic to execute for admin users
    }
    // Logic to execute on component initialization
    this.setActiveTabByUrl(this.router.url);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.setActiveTabByUrl(event.urlAfterRedirects || event.url);
      });
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
      case 'home':
        this.router.navigate(['/home']);
        break;
      case 'admin':
        if (this.user.role === 'admin') {
          this.router.navigate(['/admin']);
        }
        break;
      default:
        this.router.navigate(['/home']);
    }
    console.log('Tab ativa:', tab);
  }

  setActiveTabByUrl(url: string): void {
    if (url.includes('/clientes')) {
      this.activeTab = 'users';
    } else if (url.includes('/produtos')) {
      this.activeTab = 'menu';
    } else if (url.includes('/home')) {
      this.activeTab = 'home';
    } else if (url.includes('/admin')) {
      this.activeTab = 'admin';
    } else {
      this.activeTab = '';
    }
  }

  logout(): void {
    this.authService.Logout();
    console.log('Usuário deslogado, redirecionando para a página inicial');
  }

}
