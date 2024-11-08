import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:5189/api/v1/users';

  constructor(private http: HttpClient) {}

  signUp(userData: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/sign-up`, userData);
  }
}
