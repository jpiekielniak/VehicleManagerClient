const API_URL = 'http://localhost:5189/api/v1';
export const API_CONSTANTS = {
  VEHICLE: {
    BASE_PATH: `${API_URL}/vehicles`,
  },
  USERS: {
    BASE_PATH: `${API_URL}/users`,
    SIGN_IN: `${API_URL}/users/sign-in`,
    SIGN_UP: `${API_URL}/users/sign-up`,
  },
  SERVICE_BOOKS: {
    BASE_PATH: `${API_URL}/service-books`,
  },
  ENUMS: {
    FUEL_TYPES: `${API_URL}/fuel-types`,
    GEARBOX_TYPES: `${API_URL}/gearbox-types`,
    VEHICLE_TYPES: `${API_URL}/vehicle-types`,
  }
} as const;
