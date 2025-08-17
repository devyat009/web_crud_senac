import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { ClienteDto } from '../../modules/pages/clientes/Types/ClienteDto';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  params: new HttpParams(),
};

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  baseUrl = environment.urlApi;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  async createCliente(obj: ClienteDto): Promise<any> {
    const json = JSON.stringify(obj);
    return await lastValueFrom(
      this.http.post<any>(this.baseUrl + 'api/v1/clientes/', json, httpOptions)
    );
  }

  async editCliente(obj: ClienteDto): Promise<any> {
    if (!obj.id_client) throw new Error('ID do cliente é obrigatório para edição');
    const json = JSON.stringify(obj);
    return await lastValueFrom(
      this.http.put<any>(`${this.baseUrl}api/v1/clientes/${obj.id_client}`, json, httpOptions)
    );
  }

  async deleteCliente(idObj: string): Promise<any> {
    return await lastValueFrom(
      this.http.delete<any>(`${this.baseUrl}api/v1/clientes/${idObj}`)
    );
  }

  async listCliente(): Promise<any> {
    return await lastValueFrom(
      this.http.get<any>(this.baseUrl + 'api/v1/clientes/')
    );
  }

  async getCliente(idObj: string): Promise<any> {
    return await lastValueFrom(
      this.http.get<any>(`${this.baseUrl}api/v1/clientes/${idObj}`)
    );
  }
}
