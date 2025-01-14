import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EmailMessage} from '../types/admin.types';
import {API_CONSTANTS} from "../../../constants/api.constants";

interface UserSearchParams {
  pageIndex: number;
  pageSize: number;
  searchEmail?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {
  }

  getUsers(params: UserSearchParams): Observable<any> {
    const queryParams = new HttpParams()
      .set('page', params.pageIndex + 1)
      .set('pageSize', params.pageSize)
      .set('Filters', params.searchEmail ? `email@=${params.searchEmail}` : '');

    return this.http.get<any>(API_CONSTANTS.ADMIN.USERS, { params: queryParams });
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${API_CONSTANTS.ADMIN.DELETE_USER}`, {
      body: {userId: userId}
    });
  }

  sendEmail(emailMessage: EmailMessage): Observable<void> {
    return this.http.post<void>(`${API_CONSTANTS.ADMIN.EMAIL}`, emailMessage);
  }
}
