import { useState, useEffect } from 'react';
import api from '@/utils/axios';

interface UserDetail {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  status: number;
  role: {
    id: number;
    title: string;
  };
}

interface UserCache {
  [key: number]: UserDetail;
}

// Global cache to avoid re-fetching the same user
let userCache: UserCache = {};

export const useUserDetails = (userIds: number[]) => {
  const [users, setUsers] = useState<UserCache>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (userIds.length === 0) return;

      // Filter out users that are already cached
      const uncachedUserIds = userIds.filter(id => !userCache[id] && !users[id]);
      
      if (uncachedUserIds.length === 0) {
        // All users are already cached
        setUsers(prev => ({ ...prev, ...userCache }));
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch user details for uncached users in batches
        const batchSize = 5; // Limit concurrent requests
        const batches = [];
        for (let i = 0; i < uncachedUserIds.length; i += batchSize) {
          batches.push(uncachedUserIds.slice(i, i + batchSize));
        }

        const newUsers: UserCache = {};
        
        for (const batch of batches) {
          const promises = batch.map(async (userId) => {
            try {
              const response = await api.get(`/users/${userId}`);
              const userData = response.data.data;
              return { id: userId, data: userData, success: true };
            } catch (err) {
              console.warn(`Failed to fetch user ${userId}:`, err);
              return { 
                id: userId, 
                data: { 
                  id: userId, 
                  full_name: `User ${userId}`, 
                  email: `user${userId}@example.com`,
                  phone: 'N/A',
                  is_email_verified: false,
                  is_phone_verified: false,
                  status: 1,
                  role: { id: 0, title: 'Unknown' }
                } as UserDetail,
                success: false
              };
            }
          });

          const results = await Promise.all(promises);
          
          // Update cache and state
          results.forEach(({ id, data }) => {
            userCache[id] = data;
            newUsers[id] = data;
          });
        }

        setUsers(prev => ({ ...prev, ...userCache, ...newUsers }));
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userIds.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  const getUserName = (userId: number): string => {
    return users[userId]?.full_name || userCache[userId]?.full_name || `User ${userId}`;
  };

  const getUserEmail = (userId: number): string => {
    return users[userId]?.email || userCache[userId]?.email || `user${userId}@example.com`;
  };

  const getUserPhone = (userId: number): string => {
    return users[userId]?.phone || userCache[userId]?.phone || 'N/A';
  };

  const getUser = (userId: number): UserDetail | null => {
    return users[userId] || userCache[userId] || null;
  };

  return {
    users,
    loading,
    error,
    getUserName,
    getUserEmail,
    getUserPhone,
    getUser
  };
};
