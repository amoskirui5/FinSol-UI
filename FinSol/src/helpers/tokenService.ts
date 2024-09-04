import {jwtDecode} from 'jwt-decode'; 
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
  return localStorage.getItem(ACCESS_TOKEN);
};

export const setToken = (token: string): void => {
  localStorage.setItem(ACCESS_TOKEN, token);
};
