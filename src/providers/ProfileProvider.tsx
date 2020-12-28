import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Profile } from '../interfaces/profile';
import { WrapperComponent } from '../interfaces/wrapper';
import ProfileService from '../services/ProfileService';
import { useAuth } from './AuthProvider';

interface contextType {
  isLoading: boolean,
  failedToLoad: any,
  profile?: Profile,
  getProfile: () => Promise<void>,
  updateProfile: (profile: Profile) => void,
  toggleVisibility: () => Promise<void>,
  completeTour: (tour: string) => Promise<void>
};

const context = createContext<contextType| null>(null);

export const ProfileProvider: WrapperComponent = ({ children }) => {
  const { token } = useAuth();

  const [ isLoading, setLoading ] = useState(true);
  const [ failedToLoad, setFailedToLoad ] = useState(null);
  const [ profile, setProfile ] = useState<Profile>();

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      setFailedToLoad(null);

      const profile = await ProfileService.getProfile(token!);

      setProfile(profile);

      if(!profile.started) {
        ProfileService.startProfile(token!);
      }
    } catch (err) {
      setFailedToLoad(err);
    } finally {
      setLoading(false);
    }
  }, [ token ]);

  useEffect(() => {
    token && getProfile();
  }, [ token, getProfile ]);

  const updateProfile = async (profile: Profile) => {
    const newProfile = await ProfileService.updateProfile(token!, profile);
    setProfile(newProfile);
  };

  const toggleVisibility = async () => {
    const newProfile = await ProfileService.setVisible(token!, !profile?.visible);
    setProfile(newProfile);
  };

  const completeTour = async (tour: string) => {
    try {
      await ProfileService.completeTour(token!, tour);
      await getProfile();
    } catch(err) {
      console.error(err);
    }
  };

  const contextValue: contextType = {
    isLoading, failedToLoad, profile,
    getProfile, updateProfile, toggleVisibility, completeTour
  };

  return <context.Provider value={contextValue}>{children}</context.Provider>;
};

export const useProfile = () => useContext(context)!;
