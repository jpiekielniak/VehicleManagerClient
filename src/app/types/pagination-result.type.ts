export type PaginationResult<T> = {
  items: T[],
  totalPages: number;
  itemsFrom: number;
  itemsTo: number;
  totalItemsCount: number;
}
