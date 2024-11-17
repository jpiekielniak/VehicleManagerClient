import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {SignUp} from "../components/sign-up/model/SignUp";
import {SignIn} from "../components/sign-in/model/SignIn";
import {DOCUMENT} from "@angular/common";
import {SignInResponse} from "../models/token";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:5189/api/v1/users';

  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document) {
  }

  signUp(signUpData: SignUp): Observable<any> {
    return this.http.post(`${this.apiUrl}/sign-up`, signUpData);
  }

  signIn(signInData: SignIn): Observable<any> {
    const localStorage = this.document.defaultView?.localStorage;

    return this.http.post<any>(`${this.apiUrl}/sign-in`, signInData)
      .pipe(
          map((result: SignInResponse | any) => {
            if (result && result.token) {
              localStorage?.setItem('token', String(result.token));
              return true;
            }
            return false;
          })
        )
  }
}
