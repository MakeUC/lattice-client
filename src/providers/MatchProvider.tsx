import React, { createContext, useContext, useState } from 'react';
import { HydratedProfile, Profile } from '../interfaces/profile';
import { WrapperComponent } from '../interfaces/wrapper';
import MatchService from '../services/MatchService';
import { useAuth } from './AuthProvider';
import { useProfileList } from './ProfileListProvider';

interface contextType {
  swipeProfile: (to: Profile | HydratedProfile, like: boolean) => Promise<void>,
  reset: () => Promise<void>
};

const context = createContext<contextType | null>(null);

export const MatchProvider: WrapperComponent = ({ children }) => {
  const { token } = useAuth();
  const { getProfiles } = useProfileList()

  const [ swipedProfiles, setSwipedProfiles ] = useState<string[]>([]);

  const swipeProfile = async (to: Profile | HydratedProfile, like: boolean) => {
    if(swipedProfiles.includes(to.id)) return;

    await MatchService.swipe(token!, { to: to.id, like });
    setSwipedProfiles(swiped => [ ...swiped, to.id ]);
  };

  const reset = async () => {
    await MatchService.reset(token!);
    setSwipedProfiles([]);
    await getProfiles();
  };

  const contextValue: contextType = {
    swipeProfile, reset
  };

  return <context.Provider value={contextValue}>{children}</context.Provider>;
};

export const useMatch = () => useContext(context)!;
