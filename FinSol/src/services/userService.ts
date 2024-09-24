import { ALL_SYSTEM_USERS, LOGIN, REGISTER_SYSTEM_USER } from "../constants/apiEndpoints";
import { ACCESS_TOKEN } from "../constants/applicationNames";
import { getUser, setToken } from "../helpers/tokenService";
import axiosInstance from "../interceptors/globaInterceptor";
import { AuthParams, LoginResponse, RegisterSystemUser } from "../types/authTypes";
import { UsersListResponse } from "../types/systemUsersTypes";


export const userLogin = async (params: AuthParams): Promise<LoginResponse | undefined> => {
    const { email, password, remember } = params;
    const credentials = { email, password };

    const response = await axiosInstance.post<LoginResponse>(LOGIN, credentials);

    if (response.data) {
        if (response.data.token) {
            setToken(response.data.token, remember);
        }

        const user = getUser();

        if (!user) {
            return undefined;
        }

        let route: string;

        if (response.data.isFirstTimeLogin && !user.roles?.includes('SUPER_ADMIN')) {
            route = '/reset-password';
        } else {
            route = '/';
        }

        return {
            ...response.data,
            route,
        };
    }
};

export const getAllSystemUsers = async (): Promise<UsersListResponse> => {
    const response = await axiosInstance.get<UsersListResponse>(ALL_SYSTEM_USERS);
    return { ...response.data };

};

export const registerSystemUser = async (params: RegisterSystemUser): Promise<void> => {
    await axiosInstance.post(REGISTER_SYSTEM_USER, params);

}

export const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    window.location.reload();
  };