import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {SignUpType} from '../../types/sign-up.type';
import {SignInType} from '../../types/sign-in.type';
import {DOCUMENT} from '@angular/common';
import {SignInResponse} from '../../types/token.type';
import {API_CONSTANTS} from '../../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private document = inject(DOCUMENT);
  localStorage = this.document.defaultView?.localStorage;

  signUp(signUpData: SignUpType): Observable<any> {
    return this.http.post(API_CONSTANTS.USERS.SIGN_UP, signUpData);
  }

  signIn(signInData: SignInType): Observable<any> {
    return this.http
      .post<SignInResponse>(API_CONSTANTS.USERS.SIGN_IN, signInData)
      .pipe(map((result: SignInResponse) => {
          if (result && result.token) {
            this.localStorage?.setItem('token', String(result.token));
            return true;
          }
          return false;
        })
      );
  }
}
