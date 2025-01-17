import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environements/environment.dev';
import { catchError, map, Observable, of } from 'rxjs';
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

  private log(log: string) {
    console.info(log);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  getContacts(): Observable<Contact[]> {
    return this.http.get<{ success: boolean, data: Contact[] }>(`${this.apiUrl}/users`).pipe(
      map(response => response.data),
      catchError(this.handleError<Contact[]>('getContacts', []))
    );
  }

  getContactById(id: number): Observable<Contact> {
    return this.http.get<{ success: boolean, data: Contact }>(`${this.apiUrl}/users/${id}`).pipe(
      map(response => response.data),
      catchError(this.handleError<Contact>('getContactById'))
    );
  }

  createContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(`${this.apiUrl}/users`, contact, httpOption).pipe(
      catchError(this.handleError<Contact>('createContact'))
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
