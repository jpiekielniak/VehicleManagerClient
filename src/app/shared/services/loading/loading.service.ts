import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService implements OnDestroy {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingTimeout: any;

  loading$ = this.loadingSubject.asObservable();

  setLoading(isLoading: boolean) {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }

    if (isLoading) {
      this.loadingSubject.next(true);
    } else {
      this.loadingTimeout = setTimeout(() => {
        this.loadingSubject.next(false);
      }, 100);
    }
  }

  ngOnDestroy() {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
  }
}
