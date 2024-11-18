const API_URL = 'http://localhost:5189/api/v1';
export const API_CONSTANTS = {
  VEHICLE: {
    VEHICLE_LIST: `${API_URL}/vehicles`,
  },
  USERS: {
    SIGN_IN: `${API_URL}/users/sign-in`,
    SIGN_UP: `${API_URL}/users/sign-up`,
  }
} as const;
