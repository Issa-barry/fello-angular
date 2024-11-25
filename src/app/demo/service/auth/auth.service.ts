import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environements/environment.dev';
import { Router } from '@angular/router';

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

  

  // Fonction de logout
  logout(): Observable<any> {
    // Récupérer le token d'authentification depuis le localStorage
    const token = this.currentUserValue?.token;

    // Si le token existe, ajouter l'en-tête Authorization avec le token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      map(() => {
        localStorage.removeItem('currentUser'); // Retirer l'utilisateur du localStorage
        this.currentUserSubject.next(null); // Réinitialiser l'utilisateur actuel
        this.router.navigate(['/auth/login']); // Rediriger vers la page de login
      }),
      catchError(this.handleError('logout'))
    );
  }

  getUserRole(): string {
    return this.currentUserValue?.role || 'client';
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue?.token;
  }

}
