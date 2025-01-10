import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environements/environment.dev';
import { Contact } from '../../models/contact';


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
export class ContactService {
  private apiUrl = `${environment.apiUrl}`;

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

  getContacts(): Observable<Contact[]> {
    return this.http.get<{ data: Contact[] }>(this.apiUrl+"/users").pipe(
      map(response => response.data) 
    );
  }

  getContactById(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/users/${id}`);
  }

  createContact(contact: Contact): Observable<Contact>{
    return this.http.post<Contact>(`${this.apiUrl}`, contact, httpOption).pipe(
      catchError(this.handleError('le service createContact à detecté une erreur sur les données transmises', contact))
    );
  }
  
   
  updateContact(id: number, contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/users/${id}`, contact, httpOption).pipe(
      catchError(this.handleError<Contact>('updateContact'))
    );
  }
  
  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`, httpOption).pipe(
      catchError(this.handleError<void>('deleteContact'))
    );
  }

}
 