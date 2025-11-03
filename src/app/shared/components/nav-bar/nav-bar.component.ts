import { CommonModule, NgIf } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { filter } from "rxjs";
import { UserService } from "../../services/user.service";

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
  profileIncomplete = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
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

    // Fetch completeness state (best-effort)
    if (this.user?.user_id) {
      this.userService.getUserById(this.user.user_id)
        .then(u => {
          this.profileIncomplete = this.isProfileIncomplete(u);
        })
        .catch(() => {
          this.profileIncomplete = false;
        });
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

  goProfile(): void {
    this.router.navigate(['/perfil']);
  }

  private isProfileIncomplete(u: any): boolean {
    if (!u) return true;
    const telefoneOk = typeof u.telefone === 'string' && /^\d{10,11}$/.test(u.telefone);
    const nascimentoOk = !!u.data_nascimento;
    // CPF opcional, mas se existir, validar tamanho
    const cpfOk = !u.cpf || (typeof u.cpf === 'string' && /^\d{11}$/.test(u.cpf));
    return !(telefoneOk && nascimentoOk && cpfOk);
  }

}
