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

  getAllUsers(): Promise<any[]> {
    return lastValueFrom(
      this.http.get<any[]>(this.baseUrl + 'api/v1/users/', httpOptions)
    );
  }

  updateUser(obj: any): Promise<any> {
    if (!obj.id_user) throw new Error('id_user é obrigatório');
    const { id_user, ...payload } = obj;
    return lastValueFrom(
      this.http.put<any>(
        this.baseUrl + `api/v1/users/${id_user}`,
        JSON.stringify(payload),
        httpOptions
      )
    );
  }

  deleteUser(id_user: number): Promise<any> {
    return lastValueFrom(
      this.http.delete<any>(this.baseUrl + `api/v1/users/${id_user}`, httpOptions)
    );
  }
}
