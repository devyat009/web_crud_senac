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
    if(this.storageService.getItem('loggedInUser')) {
      this.userLoggedIn = true;
      console.log('User is logged in, redirecting to home page');
      this.router.navigate(['/home']);
    } else {
      this.userLoggedIn = false;
      console.log('No user logged in, redirecting to login page');
      this.router.navigate(['/login']);
    }
  }
}
