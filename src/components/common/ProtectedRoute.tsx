import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="py-20 text-center text-gray-400 font-mono text-xs">
        Validating session permissions...
      </div>
    );
  }

  // Not logged in -> Redirect to login gateway
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    let target = '/team/dashboard';
    if (user.role === 'ADMIN') target = '/admin/dashboard';
    if (user.role === 'EVALUATOR') target = '/evaluator/dashboard';

    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
};
