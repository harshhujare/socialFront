import axios from 'axios';
import api from './api';

const followUser=async(fid)=>{
    const res=await api.post(`/follow/followuser/${fid}`);

 return res.data;

}
const UnfollowUser=async(fid)=>{
    const res=await api.delete(`/follow/unfollowuser/${fid}`);

 return res.data;

}

// Get followers of a user
const getFollowers = async (userId) => {
    const res = await api.get(`/follow/followers/${userId}`);
    return res.data;
};

// Get users that a user is following
const getFollowing = async (userId) => {
    const res = await api.get(`/follow/following/${userId}`);
    return res.data;
};

const fetchUsers = async () => {
    try {
      setLoading(true);
      const [followersRes, followingRes] = await Promise.all([
        getFollowers(user._id),
        getFollowing(user._id)
      ]);
      
      if (followersRes.success) {
        setFollowers(followersRes.followers);
      }
      if (followingRes.success) {
        setFollowing(followingRes.following);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Set empty arrays on error to prevent UI issues
      setFollowers([]);
      setFollowing([]);
    } finally {
      setLoading(false);
    }
  };

export { followUser, UnfollowUser, getFollowers, getFollowing,fetchUsers};