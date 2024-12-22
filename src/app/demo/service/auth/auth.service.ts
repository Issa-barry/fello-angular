import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environements/environment.dev';
import { Router } from '@angular/router';
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
export class AuthService {
  private apiUrl = `${environment.apiDev}`;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;


  constructor(
    public router: Router,
    private http: HttpClient
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }
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

  //
  login(credentials: { email: string, password: string }) {
    return this.http.post<any>(this.apiUrl+'/login', credentials)
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }
 
  register(contact: Contact): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, contact, httpOption).pipe(
        map((response) => {
            console.log('Inscription réussie :', response);
            return response;
        }),
        catchError(this.handleError('register', null))
    );
}


  logout(): Observable<any> {
    const token = this.currentUserValue?.token;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      map(() => {
        localStorage.removeItem('currentUser'); 
        this.currentUserSubject.next(null); 
        this.router.navigate(['/auth/login']); 
      }),
      catchError(this.handleError('logout'))
    );
  }





  getUserRole(): string {
    return this.currentUserValue?.role || 'client';
  }

  getUserInfo(): any {
    return this.currentUserValue; // Retourne l'utilisateur actuellement stocké
}


  isAuthenticated(): boolean {
    return !!this.currentUserValue?.token;
  }

}
