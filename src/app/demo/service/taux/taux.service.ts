import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environements/environment.dev';
import { Taux } from '../../models/Taux';


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
export class TauxService {
   private apiUrl = `${environment.apiUrl}/taux`;

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

   getAllTaux(): Observable<Taux[]> {
       return this.http.get<{ data: Taux[] }>(this.apiUrl+'/all').pipe(
         map(response => response.data),
        //  catchError(this.handleError)
       );
     }
   

    getTauxById(id: number): Observable<Taux> {
         return this.http.get<{ success: boolean, data: Taux }>(`${this.apiUrl}/getById/${id}`).pipe(
           map(response => response.data),
           // catchError(this.handleError)
         );
       }
    

}
 