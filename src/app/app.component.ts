import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { StorageService } from './shared/services/storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app-crud';

  constructor(
    private router: Router,
    private storageService: StorageService

  ) {}

  ngOnInit() {
    if(this.storageService.getItem('loggedInUser')) {
      console.log('User is logged in, redirecting to home page');
      this.router.navigate(['/home']);
    } else {
      console.log('No user logged in, redirecting to login page');
      this.router.navigate(['/login']);
    }
  }
}
