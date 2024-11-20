import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {VEHICLE_LIST_CONSTANTS} from '../../constants/vehicle.constants';
import {PaginationState} from "../../types/pagination-state.type";

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private paginationState = new BehaviorSubject<PaginationState>({
    pageSize: VEHICLE_LIST_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
    pageIndex: VEHICLE_LIST_CONSTANTS.PAGINATION.DEFAULT_PAGE_INDEX,
    totalItems: 0
  });

  updateState(newState: Partial<PaginationState>): void {
    this.paginationState.next({
      ...this.paginationState.value,
      ...newState
    });
  }

  getCurrentState(): PaginationState {
    return this.paginationState.value;
  }
}
