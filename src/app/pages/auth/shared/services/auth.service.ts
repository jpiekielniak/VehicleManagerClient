import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { SignUp } from '../../sign-up/types/sign-up.type';
import { SignIn } from '../../sign-in/types/sign-in.type';
import { DOCUMENT } from '@angular/common';
import { SignInResponse } from '../../sign-in/types/token.type';
import { API_CONSTANTS } from '../../../../constants/api.constants';
import { JwtHelperService } from "@auth0/angular-jwt";
import { UserDetails } from "../../../user-details/types/user-details.type";
import { ResetPassword } from "../../reset-password/types/reset-password.type";

export interface DecodedToken {
  sub: string;
  unique_name: string;
  jti: string;
  role: string;
  exp: number;
  iss: string;
  aud: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
  private http = inject(HttpClient);
  private document = inject(DOCUMENT);
  private authStateSubject = new BehaviorSubject<boolean>(false);
  private userRolesSubject = new BehaviorSubject<string[]>([]);
  private jwtHelper = new JwtHelperService();

  localStorage = this.document.defaultView?.localStorage;

  signUp(signUpData: SignUp): Observable<any> {
    return this.http.post(API_CONSTANTS.USERS.SIGN_UP, signUpData);
  }

  signIn(signInData: SignIn): Observable<boolean> {
    return this.http.post<SignInResponse>(API_CONSTANTS.USERS.SIGN_IN, signInData)
      .pipe(
        map((response: SignInResponse) => {
          if (response?.token) {
            queueMicrotask(() => {
              this.localStorage?.setItem('token', String(response.token));
              this.updateAuthState(response.token);
            });
            return true;
          }
          return false;
        }),
        catchError((error) => {
          console.error('Sign in error:', error);
          this.resetAuthState();
          return of(false);
        })
      );
  }

  private updateAuthState(token: string): void {
    try {
      const decodedToken = this.jwtHelper.decodeToken(token) as any;
      const role = decodedToken[this.ROLE_CLAIM];

      this.authStateSubject.next(true);
      this.userRolesSubject.next(role ? [role] : []);
    } catch (error) {
      this.resetAuthState();
    }
  }

  private resetAuthState(): void {
    this.authStateSubject.next(false);
    this.userRolesSubject.next([]);
  }

  authStateChanged(): Observable<boolean> {
    return this.authStateSubject.asObservable();
  }

  getUserDetails(): Observable<UserDetails> {
    return this.http.get<UserDetails>(API_CONSTANTS.USERS.BASE_PATH);
  }

  isLoggedIn(): boolean {
    const token = this.localStorage?.getItem('token');

    if (!token) {
      this.resetAuthState();
      return false;
    }

    const isNotExpired = !this.jwtHelper.isTokenExpired(token);
    if (isNotExpired) {
      this.updateAuthState(token);
    } else {
      this.resetAuthState();
    }

    return isNotExpired;
  }

  isAdmin(): Observable<boolean> {
    return this.userRolesSubject.pipe(
      map(roles => roles.includes('Admin'))
    );
  }

  completeUserData(updateUser: any): Observable<void> {
    return this.http.put<void>(`${API_CONSTANTS.USERS.BASE_PATH}/${updateUser.userId}/complete`, updateUser);
  }

  async signOut(): Promise<void> {
    this.localStorage?.removeItem('token');
    this.resetAuthState();
  }

  deleteAccount(userId: string): Observable<void> {
    return this.http.delete<void>(`${API_CONSTANTS.USERS.BASE_PATH}/${userId}`);
  }

  resetPassword(resetPasswordData: ResetPassword): Observable<void> {
    return this.http.post<void>(API_CONSTANTS.USERS.FORGOT_PASSWORD, resetPasswordData);
  }

}
