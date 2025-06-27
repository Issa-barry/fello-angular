import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { Agence } from '../../models/agence';
import { Adresse } from '../../models/adresse';
import { environment } from 'src/environements/environment.dev';
 

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
export class AgenceService {
  private apiUrl = `${environment.apiUrl}/agences`;
  private apiAdresse = `${environment.apiUrl}/adresse`;

  constructor(private http: HttpClient) { }
  
  //Méthodes utiles
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

  getAgences(): Observable<Agence[]> {
    return this.http.get<{ data: Agence[] }>(`${this.apiUrl}/all`).pipe(
      map(response => response.data) // Extraire le tableau de 'data'
    );
  }

  getAgenceById1(id: number): Observable<Agence> {
      return this.http.get<Agence>(`${this.apiUrl}/getById/${id}`);
    }

    getAgenceById(id: number): Observable<Agence> {
      return this.http.get<{ success: boolean, data: Agence }>(`${this.apiUrl}/getById/${id}`).pipe(
        map(response => response.data),
        // catchError(this.handleError)
      ); 
    }
 

    createAgence(agence: Agence): Observable<Agence>{
      return this.http.post<Agence>(`${this.apiUrl}/create`, agence, httpOption).pipe(
        catchError(this.handleError('le service createAgence à detecté une erreur sur les données transmises', agence))
      );
    }
    
    updateAgence(id: number, agence: Agence): Observable<Agence> {
      return this.http.put<Agence>(`${this.apiUrl}/updateById/${id}`, agence, httpOption).pipe(
        catchError(this.handleError<Agence>('updateAgence'))
      );
    }
    
    deleteAgence(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/deleteById/${id}`, httpOption).pipe(
        catchError(this.handleError<void>('deleteAgence'))
      );
    }
} 
