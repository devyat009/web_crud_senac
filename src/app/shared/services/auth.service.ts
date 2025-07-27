import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

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
    private readonly router: Router
  ) {}

  get token() {
    return window.localStorage.getItem('login@token');
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
    this.router.navigate(['/']);
  }
}
