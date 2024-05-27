import {createContext} from 'react';

import {AppScreen} from '../types/AppScreen';

export type AppContextType = {
  setScreen: (screen: AppScreen) => void;
  mapSize: number;
  screen: AppScreen;
  setMapSize: (newValue: number) => void;
  onRestartGameListener?: () => void;
  setOnRestartGameListener: (
    listener: AppContextType['onRestartGameListener'],
  ) => void;
};

export const defaultAppContextValue: AppContextType = {
  mapSize: NaN,
  setMapSize: () => {},
  screen: AppScreen.menu,
  setScreen: () => {},
  onRestartGameListener: undefined,
  setOnRestartGameListener: () => {},
};

export const AppContext = createContext<AppContextType>(defaultAppContextValue);
