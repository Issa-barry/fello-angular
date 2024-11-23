import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
 
@Injectable()
export class DeviseService {
    private apiUrl = 'http://127.0.0.1:8000/api/devises'; // Remplacez par l'URL de votre API

    constructor(private http: HttpClient) { }

    getDevises(): Observable<{ success: boolean; message: string; data: any[] }> {
      return this.http.get<{ success: boolean; message: string; data: any[] }>(this.apiUrl).pipe(
        catchError(this.handleError)
      );
    }
    
 
  // getDevises(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}`).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
