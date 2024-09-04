import axios from 'axios';
import { alertService } from '../services/alertService';
import { getToken } from '../helpers/tokenService';
import { logout } from '../services/MemberService';
import { getDomainName } from '../helpers/getDomainName';

const { showAlert } = alertService();

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

const currentDomain = window.location.hostname;

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const requestHostName = new URL(config.url || '', window.location.origin).hostname;
  const requestDomainName = getDomainName(requestHostName);

        const token = getToken();

        if (token && requestDomainName === getDomainName(currentDomain)) {
            config.headers['Authorization'] = `Bearer ${token}`;
          }
        

        return config;
    },
    (error) => {
        // Handle request error if needed
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        if (response.data) {
            const responseMessage = response.data.message;

            if (response.config.method !== 'get') {
                showAlert('Success', responseMessage, 'success', 3);
            }

            return response;
        }
        return response;
    },
    (error) => {
        if (error.response) {
            let errorMessage = '';

            const { status, data } = error.response;

            switch (status) {
                case 400:
                    if (data['non_field_errors']) {
                        errorMessage = data['non_field_errors'].join();
                    } else if (data['field_errors']) {
                        const fieldErrors = Object.entries(data['field_errors'])
                            .map(([key, value]) => `${key}: ${value}`)
                            .join('\n');
                        errorMessage = fieldErrors;
                    } else if (data['error']) {
                        errorMessage = data['error'];
                    } else if (data.message) {
                        errorMessage = data['message'];
                    } else {
                        errorMessage = JSON.stringify(data);
                    }
                    break;
                case 401:
                    errorMessage =
                        'You have no permission to access this resource or your session might have expired.\nAsk for authorization and try again.';
                    logout();
                    break;
                case 403:
                case 404:
                case 405:
                case 409:
                    errorMessage = error.response.data.message || 'Request failed';
                    break;
                case 500:
                    errorMessage = 'Internal server error. Please try again later';
                    break;
                default:
                    errorMessage =
                        'Something went wrong. Please ensure your internet connection is good and try again.';
            }

            showAlert('Error', errorMessage, 'error');
        } else {
            showAlert('Error', 'Something went wrong. Please try again', 'error');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
