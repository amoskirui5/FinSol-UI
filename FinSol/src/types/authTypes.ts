export interface AuthParams {
    email: string;
    password: string;
  }

  export interface LoginResponse {
    role: string,
    firstName: string,
    otherName: string,
    token: string,
    route: string,
    isFirstTimeLogin: boolean

  }