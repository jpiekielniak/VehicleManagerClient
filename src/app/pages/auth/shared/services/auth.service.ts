import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {SignUp} from '../../sign-up/types/sign-up.type';
import {SignIn} from '../../sign-in/types/sign-in.type';
import {DOCUMENT} from '@angular/common';
import {SignInResponse} from '../../sign-in/types/token.type';
import {API_CONSTANTS} from '../../../../constants/api.constants';
import {JwtHelperService} from "@auth0/angular-jwt";
import {UserDetails} from "../../../user-details/types/user-details.type";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private document = inject(DOCUMENT);
  private authStateSubject = new BehaviorSubject<boolean>(false);

  localStorage = this.document.defaultView?.localStorage;

  signUp(signUpData: SignUp): Observable<any> {
    return this.http.post(API_CONSTANTS.USERS.SIGN_UP, signUpData);
  }

  signIn(signInData: SignIn): Observable<any> {
    return this.http
      .post<SignInResponse>(API_CONSTANTS.USERS.SIGN_IN, signInData)
      .pipe(map((result: SignInResponse) => {
          if (result && result.token) {
            this.localStorage?.setItem('token', String(result.token));
            this.authStateSubject.next(true);
            return true;
          }
          return false;
        })
      );
  }

  authStateChanged(): Observable<boolean> {
    return this.authStateSubject.asObservable();
  }

  getUserDetails(): Observable<UserDetails> {
    return this.http.get<UserDetails>(API_CONSTANTS.USERS.BASE_PATH);
  }

  isLoggedIn() {
    const localStorage = this.document.defaultView?.localStorage;
    const jwtHelper = new JwtHelperService();
    const token = localStorage?.getItem('token');

    if (!token) {
      this.authStateSubject.next(false);
      return false;
    }

    const isExpired = !jwtHelper.isTokenExpired(token);
    this.authStateSubject.next(isExpired);
    return isExpired;
  }

  completeUserData(updateUser: any) : Observable<void> {
    return this.http.put<void>(`${API_CONSTANTS.USERS.BASE_PATH}/${updateUser.id}/complete`, updateUser);
  }

  async signOut() : Promise<void> {
     this.localStorage?.removeItem('token');
     this.authStateSubject.next(false);
  }
}
