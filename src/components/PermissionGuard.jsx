import React, { useState, useEffect } from 'react';
import { hasPermission } from '../lib/permissions';

const PermissionGuard = ({ 
  children, 
  requiredPermission, 
  userRole, 
  fallback = null,
  loadingComponent = <div>Loading...</div>
}) => {
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!userRole || !requiredPermission) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        const permissionGranted = await hasPermission(userRole, requiredPermission);
        setHasAccess(permissionGranted);
      } catch (error) {
        console.error('Error checking permission:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [userRole, requiredPermission]);

  if (loading) {
    return loadingComponent;
  }

  return hasAccess ? children : fallback;
};

export default PermissionGuard;
