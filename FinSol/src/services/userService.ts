import { LOGIN } from "../constants/apiEndpoints";
import { getUser, setToken } from "../helpers/tokenService";
import axiosInstance from "../interceptors/globaInterceptor";
import { LoginResponse } from "../types/authTypes";

interface AuthParams {
    email: string,
    password: string
}

interface RegisterUserParams {
    firstName: string,
    otherName: string,
    email: string
}
interface ResetPasswordParams {
    newPassword: string;
    confirmNewPassword: string;
    userId: string;
    token?: string;
    currentPassword?: string;
}
interface ForgotPasswordParams {
    email: string;
}


export const userLogin = async (params: AuthParams): Promise<LoginResponse | undefined> => {
    try {
        const { email, password } = params;
        const credentials = { email, password };

        const response = await axiosInstance.post<LoginResponse>(LOGIN, credentials);

        if (response.data) {
            if (response.data.token) {
                setToken(response.data.token);
            }

            const user = getUser();

            if (!user) {
                return undefined;
            }

            let route: string;

            if (response.data.isFirstTimeLogin && !user.aud?.includes('SUPER_ADMIN')) {
                route = '/reset-password';
            } else {
                route = '/';
            }

            return {
                ...response.data,
                route,
            };
        }
    } catch (error) {
        console.error('Login failed:', error);
        return undefined;
    }
};
