import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {SignUp} from "../components/sign-up/model/SignUp";
import {SignIn} from "../components/sign-in/model/SignIn";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:5189/api/v1/users';

  constructor(private http: HttpClient) {}

  signUp(signUpData: SignUp): Observable<any> {
    return this.http.post(`${this.apiUrl}/sign-up`, signUpData);
  }

  signIn(signInData: SignIn): Observable<any> {
    return this.http.post(`${this.apiUrl}/sign-in`, signInData);
  }
}
