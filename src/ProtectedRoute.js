import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from './AuthContext';

export const ProtectedRoute = ({ children, allowedAuth, requiredRole }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                state={{
                    from: location,
                    authMethod: allowedAuth,
                    error: "Please sign in to access this page"
                }}
                replace
            />
        );
    }

    // Check if user has correct authentication method
    const isGoogleUser = user.providerData?.[0]?.providerId === 'google.com';
    const isEmailUser = user.providerData?.[0]?.providerId === 'password';

    const hasCorrectAuth =
        (allowedAuth === 'google' && isGoogleUser) ||
        (allowedAuth === 'email' && isEmailUser) ||
        !allowedAuth;

    // Check if user has required role
    const hasRequiredRole = !requiredRole || user.role === requiredRole;

    if (!hasCorrectAuth || !hasRequiredRole) {
        return (
            <Navigate
                to="/login"
                state={{
                    from: location,
                    authMethod: allowedAuth,
                    error: "You don't have permission to access this page"
                }}
                replace
            />
        );
    }

    return children;
};