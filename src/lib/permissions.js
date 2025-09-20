import api from './api';


let permissionsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; 


export const fetchPermissions = async (role = null) => {
  try {
    // console.log('Fetching permissions from backend...', role ? `role=${role}` : 'all roles');
    const url = role ? `/permissions/${role}` : '/permissions';
    const response = await api.get(url);
    // console.log('Permissions response:', response.data);
    if (response.data.success) {
      const data = response.data.data;
      // When fetching a single role the controller returns an object, wrap it into an array
      return role ? (Array.isArray(data) ? data : [data]) : data;
    }
    return [];
  } catch (error) {
  //  console.error('Error fetching permissions:', error);
    return [];
  }
};


export const getPermissions = async (userRole = null) => {
  const now = Date.now();

 
  if (permissionsCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    return permissionsCache;
  }


  const permissions = await fetchPermissions(userRole);
  //console.log("--------permissions", permissions);
  permissionsCache = permissions;
  cacheTimestamp = now;

  return permissions;
};

// Check if user has specific permission
export const hasPermission = async (userRole, permission) => {
  try {
    // console.log('hasPermission called with:', { userRole, permission });
   
    const permissions = await getPermissions(userRole);
   // console.log('Fetched permissions:', permissions);
    const rolePermission = permissions.find(p => p.role === userRole);
   // console.log('Found role permission:', rolePermission);

    if (!rolePermission) {
      // console.log('No role permission found for role:', userRole);
      return false;
    }

    const hasPerm = rolePermission.permissions[permission] || false;
    // console.log(`Permission ${permission} for role ${userRole}:`, hasPerm);
    return hasPerm;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

// Check multiple permissions (returns true if user has ALL permissions)
export const hasAllPermissions = async (userRole, permissions) => {
  const results = await Promise.all(
    permissions.map(permission => hasPermission(userRole, permission))
  );
  return results.every(result => result === true);
};

// Check multiple permissions (returns true if user has ANY permission)
export const hasAnyPermission = async (userRole, permissions) => {
  const results = await Promise.all(
    permissions.map(permission => hasPermission(userRole, permission))
  );
  return results.some(result => result === true);
};

// Clear permissions cache (useful after permission updates)
export const clearPermissionsCache = () => {
  permissionsCache = null;
  cacheTimestamp = null;
};

// React hook for permission checking
export const usePermissions = () => {
  const checkPermission = async (userRole, permission) => {
    return await hasPermission(userRole, permission);
  };
  
  const checkMultiplePermissions = async (userRole, permissions, requireAll = true) => {
    if (requireAll) {
      return await hasAllPermissions(userRole, permissions);
    } else {
      return await hasAnyPermission(userRole, permissions);
    }
  };
  
  return {
    checkPermission,
    checkMultiplePermissions,
    clearCache: clearPermissionsCache
  };
};
