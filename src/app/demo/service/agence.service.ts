import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environements/environment.dev';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { Agence } from '../models/agence';
import { Adresse } from '../models/adresse';
 

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
  private apiUrl = `${environment.apiDev}/agences`;
  private apiAdresse = `${environment.apiDev}/adresse`;

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

 getAgenceById(id: number): Observable<Agence> {
  return this.http.get<Agence>(`${this.apiUrl}/${id}`);
}

  getAgences(): Observable<Agence[]> {
    return this.http.get<{ data: Agence[] }>(this.apiUrl).pipe(
      map(response => response.data) // Extraire le tableau de 'data'
    );
  }

  getAdresseById(adresseId: number): Observable<Adresse> {
    return this.http.get<Adresse>(`${this.apiAdresse}/${adresseId}`);
  }

  getAgenceWithAdresse(id: number): Observable<Agence> {
    return this.getAgenceById(id).pipe(
      switchMap((agence: Agence) => {
        if (agence.adresse?.id) {
          return this.getAdresseById(agence.adresse.id).pipe(
            map((adresse: Adresse) => {
              agence.adresse = adresse;
              return agence;
            })
          );
        } else {
          return new Observable<Agence>((observer) => {
            observer.error('Adresse ID manquante.');
          });
        }
      })
    );
  }
  
  
} 
