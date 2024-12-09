export const VEHICLE_LIST_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 4,
    DEFAULT_PAGE_INDEX: 0,
  },
  ANIMATION: {
    DELAY: 200,
    TABLE_CLASS: 'vehicle-table',
    SHOW_CLASS: 'show'
  },
  COLUMNS: {
    DISPLAYED: ['brand', 'model', 'licensePlate', 'actions'] as const
  }
};
