import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'eventify_token';

interface JwtPayload {
  username: string;
  role: 'ORGANIZER' | 'ATTENDEE';
  exp: number;
}

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      removeToken();
      return null;
    }

    return {
      username: decoded.username,
      role: decoded.role,
    };
  } catch (error) {
    console.error('Invalid token:', error);
    removeToken();
    return null;
  }
};

export const isTokenValid = (): boolean => {
  return getUserFromToken() !== null;
};