import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../helpers/tokenService';

interface ProtectedRouteProps {
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    
    const token = getToken();
    
    if (!token) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
