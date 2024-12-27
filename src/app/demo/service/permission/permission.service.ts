import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environements/environment.dev';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { Role } from '../../models/Role';
import { Permission } from '../../models/Permission';

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
export class PermissionService {
  private apiUrl = `${environment.apiDev}`;
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

  getPermissions(): Observable<Permission[]> {
    return this.http.get<{ data: Permission[] }>(this.apiUrl+'/permissions').pipe(
      map(response => response.data) 
    );
  }
 
  //
  getRolesPermissions(): Observable<Role[]> {
    return this.http.get<{ data: Role[]}>(this.apiUrl+'/roles-permissions-liste').pipe(
      map(response => {
        // console.log('Réponse API brute :', response);
        return response.data
      }) 
    );
  } 

  //Les permissions d'un role
  getRolePermissions(id: number): Observable<Role[]> {
    return this.http.get<{ data: Role[] }>(`${this.apiUrl}/role/${id}/permissions`).pipe( 
      map(response => {
        return response.data
      }) 
    );
  } 

}
 