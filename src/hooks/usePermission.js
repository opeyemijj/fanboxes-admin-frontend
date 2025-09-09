'use client';
import { useState, useEffect } from 'react';

export function UsePermission(permission) {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const cookieStr = document.cookie.split('; ').find((row) => row.startsWith('permissions='));
    if (cookieStr) {
      try {
        const decoded = decodeURIComponent(cookieStr.split('=')[1]);
        setPermissions(JSON.parse(decoded));
      } catch (err) {
        console.error('Failed to parse permissions cookie:', err);
      }
    }
  }, []);

  return permissions.includes(permission);
}
