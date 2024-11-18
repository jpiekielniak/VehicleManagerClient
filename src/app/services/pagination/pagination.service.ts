import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {VEHICLE_LIST_CONSTANTS} from '../../constants/vehicle.constants';
import {PaginationStateType} from "../../types/pagination-state.type";

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private paginationState = new BehaviorSubject<PaginationStateType>({
    pageSize: VEHICLE_LIST_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
    pageIndex: VEHICLE_LIST_CONSTANTS.PAGINATION.DEFAULT_PAGE_INDEX,
    totalItems: 0
  });

  updateState(newState: Partial<PaginationStateType>): void {
    this.paginationState.next({
      ...this.paginationState.value,
      ...newState
    });
  }

  getCurrentState(): PaginationStateType {
    return this.paginationState.value;
  }
}
