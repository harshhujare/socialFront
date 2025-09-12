import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authcontext';
import { hasPermission, fetchPermissions } from '../lib/permissions';

const DebugPermissions = () => {
  const { user, IsLoggedIn } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [addBlogPermission, setAddBlogPermission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const debugPermissions = async () => {
      setLoading(true);
      try {
        // Fetch all permissions
        const allPermissions = await fetchPermissions();
        setPermissions(allPermissions);

        // Check specific permission
        if (user?.role) {
          const canAddBlog = await hasPermission(user.role, 'addBlog');
          setAddBlogPermission(canAddBlog);
        }
      } catch (error) {
        console.error('Debug error:', error);
      } finally {
        setLoading(false);
      }
    };

    debugPermissions();
  }, [user?.role]);

  if (loading) {
    return <div>Loading debug info...</div>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', margin: '10px' }}>
      <h3>Debug Permissions</h3>
      <p><strong>Is Logged In:</strong> {IsLoggedIn ? 'Yes' : 'No'}</p>
      <p><strong>User Role:</strong> {user?.role || 'None'}</p>
      <p><strong>User ID:</strong> {user?._id || 'None'}</p>
      <p><strong>Can Add Blog:</strong> {addBlogPermission === null ? 'Checking...' : addBlogPermission ? 'Yes' : 'No'}</p>
      
      <h4>All Permissions:</h4>
      <pre>{JSON.stringify(permissions, null, 2)}</pre>
    </div>
  );
};

export default DebugPermissions;
