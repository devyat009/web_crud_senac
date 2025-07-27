import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { CreateAccountRequestDto } from '../../modules/pages/login/types/login.types';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  params: new HttpParams(),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.urlApi;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  createAccount(obj: CreateAccountRequestDto): Promise<any> {
    const json = JSON.stringify(obj);
    return lastValueFrom(
      this.http.post<any>(this.baseUrl + 'api/v1/users/', json, httpOptions)
    );
  }
}
