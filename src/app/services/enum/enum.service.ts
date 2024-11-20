import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Enum} from "../../types/enum.type";


@Injectable({
  providedIn: 'root'
})
export class EnumService {
  private http = inject(HttpClient);

  getEnumValues(endpoint: string): Observable<Enum[]> {
    return this.http.get<Enum[]>(endpoint);
  }

}
