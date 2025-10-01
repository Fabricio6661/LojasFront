import { Injectable, inject } from '@angular/core';
import { ProdutoModel } from '../models/produtoModel';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LojaService } from './loja-service';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

    private http = inject(HttpClient)
    private baseApi = 'http://localhost:8080/produtos'
    private produtos: ProdutoModel[] = [];
    


    listar(): Observable<ProdutoModel[]> {
      return this.http.get<ProdutoModel[]>(`${this.baseApi}/listar`).pipe(catchError(this.handle))
    }

     adicionar(produto: ProdutoModel): Observable<ProdutoModel>{
      return this.http.post<ProdutoModel>(`${this.baseApi}/salvar`, produto)
      .pipe(catchError(this.handle));
     }

     remover(id: string): Observable<string>{
      return this.http.post(`${this.baseApi}/deletar/${id}`, null,{responseType: 'text'}).pipe(catchError(this.handle));
      
     }

     editar(id: string, produto: ProdutoModel): Observable<ProdutoModel> {
      return this.http.post<ProdutoModel>(`${this.baseApi}/editar/${id}`, produto).pipe(catchError(this.handle));
     }

    private handle(err: HttpErrorResponse) {
      const msg = err.error?.message || err.error?.erro || err.message || 'erro inesperado';
      return throwError(() => new Error(msg));
    }
}
