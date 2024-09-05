export interface AuthParams {
  email: string;
  password: string;
  remember: boolean
}

export interface LoginResponse {
  role: string,
  firstName: string,
  otherName: string,
  token: string,
  route: string,
  isFirstTimeLogin: boolean

}


export interface RegisterSystemUser {
  roleName: string,
  firstName: string,
  otherName: string,
  email: string

}