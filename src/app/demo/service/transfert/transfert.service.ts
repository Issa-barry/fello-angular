import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environements/environment.dev';
import { Transfert } from '../../models/transfert';
 


const httpOption = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
   
  })
}; 
@Injectable({
  providedIn: 'root'
})
export class TransfertService {
  private apiUrl = `${environment.apiDev}/transferts`;

  constructor(private http: HttpClient) { }
  private log(log: string){
    console.info(log)
  }
 
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  } 

  getTransferts(): Observable<Transfert[]> {
    return this.http.get<{ data: Transfert[] }>(this.apiUrl).pipe(
      map(response => response.data) 
    );
  }

  getTransfertById(id: number): Observable<Transfert> {
    return this.http.get<Transfert>(`${this.apiUrl}/${id}`);
  }

  createTransfert(transfert: Transfert): Observable<Transfert>{
    return this.http.post<Transfert>(`${this.apiUrl}`, transfert, httpOption).pipe(
      catchError(this.handleError('le service createTransfert à detecté une erreur sur les données transmises', transfert))
    );
  }
  
   
  updateTransfert(id: number, transfert: Transfert): Observable<Transfert> {
    return this.http.put<Transfert>(`${this.apiUrl}/${id}`, transfert, httpOption).pipe(
      catchError(this.handleError<Transfert>('updateTransfert'))
    );
  }
  
  annulerTransfert(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/annuler/${id}`, httpOption).pipe(
      catchError(this.handleError<void>('annulerTransfert'))
    ); 
  }
}
