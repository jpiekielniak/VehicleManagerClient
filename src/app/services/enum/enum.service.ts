import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

export type EnumType = {
  key: number;
  value: string;
}


@Injectable({
  providedIn: 'root'
})
export class EnumService {
  private http = inject(HttpClient);

  getEnumValues(endpoint: string): Observable<EnumType[]> {
    return this.http.get<EnumType[]>(endpoint);
  }

}
