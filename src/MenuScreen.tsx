import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {PixelRatio, StyleSheet, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';

import {AppContext} from './context/AppContext';
import {AppScreen} from './types/AppScreen';

export default function MenuScreen() {
  const {mapSize, setMapSize} = useContext(AppContext);

  const [mapSizeInputBuffer, setMapSizeInputBuffer] = useState(() =>
    Number.isNaN(mapSize) ? '' : mapSize.toString(),
  );

  const {setScreen} = useContext(AppContext);

  const mapSizeInputBufferRef = useRef<string>('');

  // this effect has a one and only responsibility: to update mapSize in AppContext whenever the input buffer changes its text value
  useEffect(() => {
    if (mapSizeInputBufferRef.current !== mapSizeInputBuffer) {
      setMapSize(
        mapSizeInputBuffer.includes('.') || mapSizeInputBuffer.includes(',')
          ? NaN
          : Number(mapSizeInputBuffer),
      );

      mapSizeInputBufferRef.current = mapSizeInputBuffer;
    }
  }, [mapSizeInputBuffer, setMapSize]);

  const isMapSizeInvalid = useMemo(
    () =>
      Number.isNaN(mapSize) || // only valid numbers
      mapSize < 2 || // only map sizes >=2x2 make sense
      /[,.]/.test(mapSizeInputBuffer), // decimals are valid numbers, but make no sense here - we want integers
    // mapSizeInputBuffer.includes(".") ||
    // mapSizeInputBuffer.includes(","),
    [mapSizeInputBuffer, mapSize],
  );

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        error={isMapSizeInvalid}
        label="Map Size"
        keyboardType="number-pad"
        onChange={event => {
          let newValue = event.nativeEvent.text;

          setMapSizeInputBuffer(newValue);
        }}
        value={mapSizeInputBuffer}
        style={{width: '100%'}}
      />

      <Button
        mode="contained"
        disabled={isMapSizeInvalid}
        onPress={() => {
          setScreen(AppScreen.game);
        }}>
        Play! 🎲
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: PixelRatio.getPixelSizeForLayoutSize(2),
    display: 'flex',
    justifyContent: 'center',
    gap: PixelRatio.getPixelSizeForLayoutSize(8),
    height: '100%',
    width: '60%',
    maxWidth: 400,
    minWidth: 50,
    flexDirection: 'column',
    alignItems: 'center',
  },
});
