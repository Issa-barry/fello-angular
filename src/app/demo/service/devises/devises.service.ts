import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environements/environment.dev';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';

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
export class DevisesService {
  private apiUrl = `${environment.apiDev}/devises`;

  constructor(
    private http: HttpClient
  ) { }

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

  getDevises(): Observable<any[]> {
    return this.http.get<{ data: any[] }>(this.apiUrl).pipe(
      map(response => response.data) 
    );
  }

}
 