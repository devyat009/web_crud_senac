import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StorageService {
  public loggedInSubject: BehaviorSubject<boolean>;
  public loggedIn$;

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: Object
  ) {
    this.loggedInSubject = new BehaviorSubject<boolean>(!!this.getItem('loggedInUser'));
    this.loggedIn$ = this.loggedInSubject.asObservable();
  }

  setItem(key: string, value: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
    }
  }

  getItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }

  removeItem(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
      if (key === 'loggedInUser') this.loggedInSubject.next(false);
    }
  }
}
