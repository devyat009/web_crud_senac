import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { CreateAccountRequestDto } from '../../modules/pages/login/types/login.types';
import { ProductDto } from '../../modules/pages/produtos/Types/ProductDto';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  params: new HttpParams(),
};

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl = environment.urlApi;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  async createProduct(obj: ProductDto): Promise<any> {
    const json = JSON.stringify(obj);
    return await lastValueFrom(
      this.http.post<any>(this.baseUrl + 'api/v1/products', json, httpOptions)
    )
  }

  async editProduct(obj: ProductDto): Promise<any> {
    const json = JSON.stringify(obj);
    return await lastValueFrom(
      this.http.put<any>(this.baseUrl + 'api/v1/products', json, httpOptions)
    );
  }

  async deleteProduct(idObj: string): Promise<any> {
    return await lastValueFrom(
      this.http.delete<any>(this.baseUrl + 'api/v1/products/' + idObj)
    );
  }

  async listProduct(): Promise<any> {
    return await lastValueFrom(
      this.http.get<any>(this.baseUrl + 'api/v1/products')
    );
  }

  async listProductFiltered(filters: { categoria?: string; marca?: string; search?: string; minPreco?: number; maxPreco?: number; low_stock?: boolean } = {}): Promise<any> {
    let params = new HttpParams();
    if (filters.categoria) params = params.set('categoria', filters.categoria);
    if (filters.marca) params = params.set('marca', filters.marca);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.low_stock) params = params.set('low_stock', 'true');
    // to do: min max price
    return await lastValueFrom(
      this.http.get<any>(this.baseUrl + 'api/v1/products', { params })
    );
  }

  async createBrand(nome_marca: string): Promise<any> {
    const json = JSON.stringify({ nome_marca });
    return await lastValueFrom(
      this.http.post<any>(this.baseUrl + 'api/v1/products/brand', json, httpOptions)
    );
  }

  async listBrand(): Promise<any> {
    return await lastValueFrom(
      this.http.get<any>(this.baseUrl + 'api/v1/products/brand')
    );
  }
  async deleteBrand(id: string): Promise<any> {
    return await lastValueFrom(
      this.http.delete<any>(this.baseUrl + 'api/v1/products/brand/' + id)
    );
  }

  async editBrand(id: string, obj: any): Promise<any> {
    const json = JSON.stringify({ nome_marca: obj });
    return await lastValueFrom(
      this.http.patch<any>(this.baseUrl + 'api/v1/products/brand/' + id, json, httpOptions)
    );
  }

  async createCategory(nome_categoria: string): Promise<any> {
    return await lastValueFrom(
      this.http.post<any>(this.baseUrl + 'api/v1/products/category', JSON.stringify({ nome_categoria }), httpOptions)
    );
  }

  async listCategory(): Promise<any> {
    return await lastValueFrom(
      this.http.get<any>(this.baseUrl + 'api/v1/products/category')
    );
  }
  async deleteCategory(id: string): Promise<any> {
    return await lastValueFrom(
      this.http.delete<any>(this.baseUrl + 'api/v1/products/category/' + id)
    );
  }

  async editCategory(id: string, obj: any): Promise<any> {
    const json = JSON.stringify({ nome_categoria: obj });
    return await lastValueFrom(
      this.http.patch<any>(this.baseUrl + 'api/v1/products/category/' + id, json, httpOptions)
    );
  }
}
