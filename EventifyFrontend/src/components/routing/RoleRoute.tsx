import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface RoleRouteProps {
  requiredRole: 'ORGANIZER' | 'ATTENDEE';
}

const RoleRoute: React.FC<RoleRouteProps> = ({ requiredRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default RoleRoute;