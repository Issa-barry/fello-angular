import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environements/environment.dev';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { Role } from '../../models/Role';

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
export class RolePermissionService {
  private apiUrlRole = `${environment.apiDev}/roles`;
   
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
 
  getRoles(): Observable<Role[]> {
    return this.http.get<{ data: Role[] }>(this.apiUrlRole).pipe(
      map(response => response.data) 
    );
  }

  getRoleById(id: number): Observable<Role> {
    return this.http.get<{data : Role}>(`${this.apiUrlRole}/${id}`).pipe(
      map(response => response.data),
      catchError(this.handleError<Role>('getRoleById'))
    );
  }
   
  createRole(role: Role): Observable<Role>{
    return this.http.post<Role>(`${this.apiUrlRole}`, role, httpOption).pipe(
      catchError(this.handleError('le service createRole à detecté une erreur sur les données transmises', role))
    );
  }
  
    
  updateRole(id: number, role: Role): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrlRole}/${id}`, role, httpOption).pipe(
      catchError(this.handleError<Role>('updateRole'))
    );
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlRole}/${id}`, httpOption).pipe(
      catchError(this.handleError<void>('deleteRole'))
    );
  }
}
