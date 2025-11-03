import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { StorageService } from './storage.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  params: new HttpParams(),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.urlApi;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly storageService: StorageService
  ) {}

  get token() {
    return this.storageService.getItem('login@token');
  }

  checkCredentials(): boolean {
    let userLogado = false;
    const usuarioSession = this.token;
    if (usuarioSession != null && usuarioSession !== undefined) {
      userLogado = true;
    } else {
      this.Logout();
    }
    return userLogado;
  }

  async Login(obj: any): Promise<any> {
    const json = JSON.stringify(obj);
    return await lastValueFrom(
      this.http.post<any>(this.baseUrl + 'api/v1/auth/login', json, httpOptions)
    );
  }

  public Logout() {
    this.storageService.removeItem('loggedInUser');
    this.storageService.removeItem('login@token');
    this.router.navigate(['/']);
  }

  async LoginWithGoogle(idToken: string): Promise<any> {
    const json = JSON.stringify({ token: idToken });
    return await lastValueFrom(
      this.http.post<any>(this.baseUrl + 'api/v1/auth/google', json, httpOptions)
    );
  }

  async ChangePassword(obj: any): Promise<any> {
    const json = JSON.stringify(obj);
    return await lastValueFrom(
      this.http.put<any>(this.baseUrl + 'api/v1/auth/change-password', json, httpOptions)
    );
  }

  async ConfirmDataForgotPassword(obj: any): Promise<any> {
    const json = JSON.stringify(obj);
    return await lastValueFrom(
      this.http.post<any>(this.baseUrl + 'api/v1/auth/forgot-password', json, httpOptions)
    );
  }
}
