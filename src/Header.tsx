import React, {useContext, useMemo} from 'react';
import {useColorScheme} from 'react-native';
import {Appbar} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {AppContext} from './context/AppContext';
import {AppScreen} from './types/AppScreen';

export type HeaderProps = {
  screenTitle: string;
  hideControlButtons: boolean;
};

export default function Header({screenTitle, hideControlButtons}: HeaderProps) {
  const {setScreen, onRestartGameListener} = useContext(AppContext);
  const safeInsets = useSafeAreaInsets();
  const isDarkMode = useColorScheme() === 'dark';

  const iconColor = useMemo(
    () => (isDarkMode ? 'white' : 'black'),
    [isDarkMode],
  );

  return (
    <Appbar.Header safeAreaInsets={safeInsets}>
      <Appbar.Content title={`Natalia's TicTacToe - ${screenTitle}`} />

      {!hideControlButtons && (
        <>
          <Appbar.Action
            icon="cog-box"
            color={iconColor}
            onPress={() => {
              setScreen(AppScreen.menu);
            }}
          />
          <Appbar.Action
            icon="refresh"
            color={iconColor}
            onPress={() => onRestartGameListener?.()}
          />
        </>
      )}
    </Appbar.Header>
  );
}
