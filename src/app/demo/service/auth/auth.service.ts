import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environements/environment.dev';
import { Router } from '@angular/router';
import { TokenService } from '../token/token.service';

const httpOption = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private   userId = "";

  constructor(
    public router: Router,
    private http: HttpClient,
    private tokenService: TokenService) {
    const storedUser = localStorage.getItem('access_token');
    this.currentUserSubject = new BehaviorSubject<any>(storedUser ? { access_token: storedUser } : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUser;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
 
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      map((response) => {
        this.tokenService.storeToken(response.access_token);
         this.userId = response.user.id;
         this.setUserId(this.userId);
        localStorage.setItem('user_id', this.userId);
        this.currentUserSubject.next({ access_token: response.access_token });
        return response;
      }),
      catchError(this.handleError('login', null))
    );
  }
 
  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {}).pipe(
      map(() => {
        this.tokenService.clearToken();
        this.currentUserSubject.next(null);
        localStorage.removeItem('user_id');
        this.router.navigate(['/auth/login']);
      }),
      catchError(this.handleError('logout')) 
    );
  }


  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, user, httpOption).pipe(
      map((response) => {
        console.log('Inscription réussie :', response);
        return response;
      }),
      catchError(this.handleError('register', null))
    );
  }

  isAuthenticated(): boolean {
    return this.tokenService.hasToken();
  }

  getUserInfo(): any {
    return this.currentUserValue; // Retourne l'utilisateur actuellement stocké
  }

  setUserId(id: string) {
    this.userId = id;
  }

  getUserId() {
   return localStorage.getItem('user_id');
  }


  verifyToken(): Observable<boolean> {
    return this.tokenService.verifyToken().pipe(
      map((isValid) => {
        if (!isValid) {
          this.currentUserSubject.next(null);
          this.router.navigate(['/auth/login']);
        }
        return isValid;
      })
    );
  }
}
 