import { Injectable, inject } from '@angular/core';
import { LojaModel } from '../models/lojaModel';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LojaService {

    private lojas: LojaModel[] = [];
    private http = inject(HttpClient)
    private baseApi = 'http://localhost:8080/lojas'
    


    listar(): Observable<LojaModel[]> {
      return this.http.get<LojaModel[]>(`${this.baseApi}/listar`).pipe(catchError(this.handle))
    }

    adicionar(produto: LojaModel): Observable<LojaModel>{
      return this.http.post<LojaModel>(`${this.baseApi}/salvar`, produto)
      .pipe(catchError(this.handle));
     }

     remover(id: string): Observable<string>{
      return this.http.post(`${this.baseApi}/deletar/${id}`, null,{responseType: 'text'}).pipe(catchError(this.handle));
      
     }

    editar(id: string, produto: LojaModel): Observable<LojaModel> {
      return this.http.post<LojaModel>(`${this.baseApi}/editar/${id}`, produto).pipe(catchError(this.handle));
     }

    private handle(err: HttpErrorResponse) {
      const msg = err.error?.message || err.error?.erro || err.message || 'erro inesperado';
      return throwError(() => new Error(msg));
    }
}
