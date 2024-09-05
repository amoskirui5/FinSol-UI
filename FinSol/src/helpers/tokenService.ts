import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN } from '../constants/applicationNames';

export interface DecodedToken {
  name?: string;
  email?: string;
  roles?: string[];
  exp?: number;
  iat?: number;
}

export const getUser = (): DecodedToken | null => {
  const token = getToken();

  if (token) {
    return jwtDecode<DecodedToken>(token);
  }

  return null;
};

export const getToken = (): string | null => {
  let token = localStorage.getItem(ACCESS_TOKEN);

  if (!token) {
    token = sessionStorage.getItem(ACCESS_TOKEN);
  }

  return token;
};


export const setToken = (token: string, remember: boolean): void => {
  if (remember) {
    localStorage.setItem(ACCESS_TOKEN, token);
  } else {
    sessionStorage.setItem(ACCESS_TOKEN, token);
  }
};
