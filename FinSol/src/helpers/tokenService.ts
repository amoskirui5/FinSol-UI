import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN } from '../constants/applicationNames';

export const getUser = () => {
  const token = getToken();

  if (token) {
    return jwtDecode(token);
  }
  
  return null;
};

export const getToken = () => {
  return localStorage.getItem(ACCESS_TOKEN);
};
