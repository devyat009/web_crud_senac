import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { StorageService } from './shared/services/storage.service';
import { NavBarComponent } from "./shared/components/nav-bar/nav-bar.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavBarComponent,
    NgIf
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app-crud';
  userLoggedIn: boolean = false;
  constructor(
    private router: Router,
    private storageService: StorageService

  ) {}

  ngOnInit() {
    console.log('AppComponent initialized');
    const storedUser = this.storageService.getItem('loggedInUser');
    this.userLoggedIn = !!storedUser;
    let initialized = false;
    let prev = this.userLoggedIn;
    this.storageService.loggedIn$.subscribe(logged => {
      if (!initialized) { initialized = true; return; }
      this.userLoggedIn = logged;
      if (!logged) {
        if (this.router.url !== '/login') this.router.navigate(['/login']);
      } else if (!prev && logged && this.router.url === '/login') {
        this.router.navigate(['/home']);
      }
      prev = logged;
    });
  }
}
