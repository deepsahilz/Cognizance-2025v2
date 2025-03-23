import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loader from './Loader';

/**
 * ProtectedRoute component that handles route protection based on authentication
 * @param {Object} props - Component props
 * @param {string} [props.redirectPath='/login'] - Path to redirect to if not authenticated
 * @param {function} [props.children] - Child components to render if authenticated
 * @returns {JSX.Element} - Rendered component
 */
const ProtectedRoute = ({ 
  redirectPath = '/login',
  children 
}) => {
  const { isLoggedIn, loading } = useAuth();

  // Show loader while checking authentication
  if (loading) {
    return <Loader />;
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  // Render children if provided, otherwise use Outlet for nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;