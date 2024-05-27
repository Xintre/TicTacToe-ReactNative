import React, {useState} from 'react';
import {StatusBar, View, useColorScheme} from 'react-native';
import {MD3DarkTheme, MD3LightTheme, PaperProvider} from 'react-native-paper';
import {MD2Colors} from 'react-native-paper';
import {SnackbarProvider} from 'react-native-paper-snackbar-stack';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import GameScreen from './GameScreen';
import Header from './Header';
import MenuScreen from './MenuScreen';
import {
  AppContext,
  AppContextType,
  defaultAppContextValue,
} from './context/AppContext';
import {AppScreen} from './types/AppScreen';

StatusBar.setHidden(true, 'fade');

export function App() {
  const [appContextValue, setAppContextValue] = useState<AppContextType>(
    defaultAppContextValue,
  );
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <PaperProvider
      theme={{
        ...(isDarkMode ? MD3DarkTheme : MD3LightTheme),
        dark: isDarkMode,
        colors: {
          primary: MD2Colors.indigo500,
          secondary: MD2Colors.orange500,
        },
      }}>
      <SnackbarProvider maxSnack={5}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />

        <AppContext.Provider
          value={{
            ...appContextValue,
            setMapSize: newValue => {
              setAppContextValue({
                ...appContextValue,
                mapSize: newValue,
              });
            },
            setScreen: newScreen => {
              setAppContextValue({
                ...appContextValue,
                screen: newScreen,
              });
            },
            setOnRestartGameListener: listener => {
              setAppContextValue({
                ...appContextValue,
                onRestartGameListener: listener,
              });
            },
          }}>
          <Header
            screenTitle={appContextValue.screen}
            hideControlButtons={appContextValue.screen === AppScreen.menu}
          />

          <View
            style={{
              alignItems: 'center',
              flexDirection: 'column',
              alignContent: 'center',
              overflow: 'hidden',
              flex: 1,
            }}>
            {appContextValue.screen === AppScreen.menu ? (
              <MenuScreen />
            ) : (
              <GameScreen />
            )}
          </View>
        </AppContext.Provider>
      </SnackbarProvider>
    </PaperProvider>
  );
}

export default App;
