import {Map, Set} from 'immutable';
import _ from 'lodash';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {PixelRatio, Vibration, View} from 'react-native';
import {isLandscapeSync, isTablet} from 'react-native-device-info';
import {Text, TouchableRipple} from 'react-native-paper';
import {useSnackbar} from 'react-native-paper-snackbar-stack';

import {EXTRA_CELLS_PADDING} from './Constants';
import {AppContext} from './context/AppContext';

enum UserTurn {
  A,
  B,
}

enum CellState {
  o = '⭕',
  x = '❌',
  empty = '',
}

type MapRow = Array<CellState>;

type MapState = Array<MapRow>;

type CellIndex = Map<'row' | 'col', number>;

export default function GameScreen() {
  const {mapSize, setOnRestartGameListener} = useContext(AppContext);
  const isSmOrDown = !isTablet();
  const {enqueueSnackbar} = useSnackbar();

  const [gameFinished, setGameFinished] = useState(false);
  const [userTurn, setUserTurn] = useState(UserTurn.A);
  const [mapState, setMapState] = useState<MapState>([]);
  const [easterEggMode, setEasterEggMode] = useState<boolean>(false);
  const [gameWinner, setGameWinner] = useState<CellState>(CellState.empty);
  const [allWinningIndices, setAllWinningIndices] = useState<Set<CellIndex>>(
    Set<CellIndex>(),
  );
  const [wasMapInitialized, setWasMapInitialized] = useState(false);
  const [easterEggDisplayFlag, setEasterEggDisplayFlag] = useState(true);
  const [gameContainerWidth, setGameContainerWidth] = useState(1);
  const [gameContainerHeight, setGameContainerHeight] = useState(1);

  // easter egg display flag interval setup / cleanup effect
  useEffect(() => {
    if (easterEggMode) {
      let interval = setInterval(() => {
        setEasterEggDisplayFlag(!easterEggDisplayFlag);
      }, 1500);

      return () => {
        clearInterval(interval);
      };
    }
  }, [easterEggDisplayFlag, easterEggMode]);

  const cellPadding = useMemo(
    () =>
      isSmOrDown
        ? // rules for phone
          mapSize < 9
          ? PixelRatio.getPixelSizeForLayoutSize(4)
          : PixelRatio.getPixelSizeForLayoutSize(1)
        : // rules for tablet
        mapSize < 18
        ? PixelRatio.getPixelSizeForLayoutSize(4)
        : PixelRatio.getPixelSizeForLayoutSize(1),
    [mapSize, isSmOrDown],
  );

  const cellWidth = useMemo(
    () =>
      Math.max(
        0,
        Math.min(gameContainerWidth ?? 0, gameContainerHeight ?? 0) / mapSize -
          cellPadding -
          (EXTRA_CELLS_PADDING * 2) / mapSize,
      ),
    [gameContainerWidth, gameContainerHeight, mapSize, cellPadding],
  );

  const finishGameIfApplicable = useCallback(
    (mapState: MapState) => {
      let allWinningIndices = Set<CellIndex>(); // note: there may even be an edge case when two different conditions win at once!

      // check if any row is complete
      let anyRowComplete = false;
      for (let rowIndex = 0; rowIndex < mapSize; rowIndex++) {
        let winningRowIndices = Set<CellIndex>();
        let areAllColumnsInThisRowEqual = true;

        // the first cell
        let referenceCell = mapState[rowIndex][0];
        // columnLoop@
        for (let colIndex = 0; colIndex < mapSize; colIndex++) {
          let cell = mapState[rowIndex][colIndex];
          if (cell !== referenceCell || cell === '') {
            areAllColumnsInThisRowEqual = false;
            winningRowIndices.clear();
            break;
          } else {
            winningRowIndices = winningRowIndices.add(
              Map({row: rowIndex, col: colIndex}) as CellIndex,
            );
          }
        }

        if (areAllColumnsInThisRowEqual) {
          anyRowComplete = true;
          allWinningIndices = allWinningIndices.union(winningRowIndices);
          break;
        }
      }

      // check if any column is complete
      let anyColumnComplete = false;
      // columnLoop@
      for (let colIndex = 0; colIndex < mapSize; colIndex++) {
        let winningColIndices = Set<CellIndex>();
        let areAllRowsInThisColumnEqual = true;

        // the first cell
        let referenceCell = mapState[0][colIndex];

        // rowLoop@
        for (let rowIndex = 0; rowIndex < mapSize; rowIndex++) {
          let cell = mapState[rowIndex][colIndex];
          if (cell !== referenceCell || cell === '') {
            areAllRowsInThisColumnEqual = false;
            winningColIndices.clear();
            break;
          } else {
            winningColIndices = winningColIndices.add(
              Map({row: rowIndex, col: colIndex}) as CellIndex,
            );
          }
        }

        if (areAllRowsInThisColumnEqual) {
          anyColumnComplete = true;
          allWinningIndices = allWinningIndices.union(winningColIndices);
        }
      }

      // check if any diagonal is complete
      let leftDiagonalComplete = true;
      let winningDiagLIndices = Set<CellIndex>();

      for (let i = 0; i < mapSize; i++) {
        let cell = mapState[i][i];
        if (cell !== mapState[0][0] || cell === '') {
          leftDiagonalComplete = false;
          winningDiagLIndices.clear();
          break;
        } else {
          winningDiagLIndices = winningDiagLIndices.add(
            Map({row: i, col: i}) as CellIndex,
          );
        }
      }

      if (leftDiagonalComplete) {
        allWinningIndices = allWinningIndices.union(winningDiagLIndices);
      }

      let rightDiagonalComplete = true;
      let winningDiagRIndices = Set<CellIndex>();
      let rightDiagRowIndicesToLoop = _.range(0, mapSize);
      let rightDiagColIndicesToLoop = _.range(0, mapSize).reverse();

      for (let i of rightDiagRowIndicesToLoop) {
        let rowIndex = rightDiagRowIndicesToLoop[i];
        let colIndex = rightDiagColIndicesToLoop[i];
        // the first cell
        let referenceCell = mapState[0][mapSize - 1];

        let cell = mapState[rowIndex][colIndex];
        if (cell !== referenceCell || cell === '') {
          rightDiagonalComplete = false;
          winningDiagRIndices.clear();
          break;
        } else {
          winningDiagRIndices = winningDiagRIndices.add(
            Map({row: rowIndex, col: colIndex}) as CellIndex,
          );
        }
      }
      if (rightDiagonalComplete) {
        allWinningIndices = allWinningIndices.union(winningDiagRIndices);
      }

      // check if we have a winner or the game is over with a draw
      if (
        anyRowComplete ||
        anyColumnComplete ||
        leftDiagonalComplete ||
        rightDiagonalComplete
      ) {
        let someWinningIndices = allWinningIndices.first()!;

        let row = someWinningIndices.get('row')!;
        let col = someWinningIndices.get('col')!;
        let gameWinner = mapState[row][col];

        Vibration.vibrate(200);
        setTimeout(() => {
          Vibration.vibrate(350);

          setTimeout(() => {
            Vibration.vibrate(200);
          }, 200);
        }, 400);

        console.log(`Winning indices: ${allWinningIndices}`);
        enqueueSnackbar({
          message: `Game finished - ${gameWinner}'s won!`,
          duration: 8000,
        });
        setGameWinner(gameWinner);
        setGameFinished(true);
      } else {
        let allCellsFilled = mapState.flat().every(cell => cell !== '');

        if (allCellsFilled) {
          Vibration.vibrate(700);

          setEasterEggMode(true);

          enqueueSnackbar({
            message: "Game finished - it's a draw!",
          });

          allWinningIndices = Set<CellIndex>();
          setGameFinished(true);
        }
      }

      setAllWinningIndices(allWinningIndices);
    },
    [mapSize, enqueueSnackbar],
  );

  const prepareMap = useCallback(() => {
    let newMapState = mapState;
    console.log(`Initializing an empty map of size ${mapSize}`);

    newMapState = [];
    setUserTurn(UserTurn.A);
    setEasterEggMode(false);
    setAllWinningIndices(Set<CellIndex>());
    setGameFinished(false);
    setGameWinner(CellState.empty);

    for (let r = 0; r < mapSize; r++) {
      let rowArr = [];

      for (let c = 0; c < mapSize; c++) {
        rowArr.push(CellState.empty);
      }

      newMapState.push(rowArr);
    }

    setMapState(newMapState);
  }, [mapSize, mapState]);

  console.log('Rendering with map state', mapState);

  // map initialization effect - will initialize the map on first render, as soon as the game container's width is received for the first time
  useEffect(() => {
    if (
      gameContainerHeight !== null &&
      gameContainerWidth !== null &&
      !wasMapInitialized
    ) {
      console.log('Initializing map...');

      prepareMap();
      setWasMapInitialized(true);
    }
  }, [gameContainerWidth, gameContainerHeight, prepareMap, wasMapInitialized]);

  // AppContext setOnRestartGameListener setup & cleanup effect
  useEffect(() => {
    console.log('Setting up setOnRestartGameListener');

    // setup
    setOnRestartGameListener(() => {
      setWasMapInitialized(false);
    });

    return () => {
      // cleanup
      console.log('Cleaning up setOnRestartGameListener');

      setOnRestartGameListener(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLandscape = isLandscapeSync();

  return (
    <View
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: isLandscape ? 'row' : 'column',
        gap: 20,
        width: '100%',
      }}
      onLayout={event => {
        setGameContainerWidth(event.nativeEvent.layout.width);
        setGameContainerHeight(event.nativeEvent.layout.height);
      }}>
      <View
        style={
          isLandscape && {
            height: '100%',
            justifyContent: 'center',
          }
        }>
        <Text
          style={
            isLandscape
              ? {
                  writingDirection: 'ltr',
                  transform: [
                    {
                      rotate: '270deg',
                    },
                  ],
                  textAlign: 'center',
                }
              : {
                  textAlign: 'center',
                  marginTop: 20,
                }
          }>
          {gameFinished
            ? allWinningIndices.isEmpty()
              ? "Game finished - it's a draw!"
              : `Game finished - ${gameWinner}'s won!`
            : `Let's make ${
                userTurn === UserTurn.A ? CellState.x : CellState.o
              }'s' rain!`}
        </Text>
      </View>

      <View
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          rowGap: cellPadding,
          padding: EXTRA_CELLS_PADDING,
          flex: 1,
        }}>
        {mapState.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: cellPadding,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {row.map((cellState, colIndex) => {
              const cellDisabled =
                cellState !== CellState.empty || gameFinished;

              return (
                <TouchableRipple
                  key={colIndex}
                  style={{
                    backgroundColor: allWinningIndices.has(
                      Map({row: rowIndex, col: colIndex}) as CellIndex,
                    )
                      ? 'yellow'
                      : 'lightblue',
                    width: cellWidth,
                    height: 'auto',
                    aspectRatio: 1,
                    borderRadius: 45,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  disabled={cellDisabled}
                  onPress={() => {
                    // if cell is not empty, then do not do anything
                    if (cellDisabled) {
                      return;
                    }

                    Vibration.vibrate(150);

                    const newValue =
                      userTurn === UserTurn.A ? CellState.x : CellState.o;

                    const newMapState = mapState.map((predRow, predRowIndex) =>
                      predRow.map((oldCell, predColIndex) =>
                        predRowIndex === rowIndex && predColIndex === colIndex
                          ? newValue
                          : oldCell,
                      ),
                    );
                    setMapState(newMapState);

                    setUserTurn(
                      userTurn === UserTurn.A ? UserTurn.B : UserTurn.A,
                    );

                    finishGameIfApplicable(newMapState);
                  }}>
                  <Text
                    style={{
                      fontSize:
                        (cellWidth * 2) /
                        (easterEggMode && easterEggDisplayFlag ? 7 : 3),
                      fontWeight: 600,
                    }}>
                    {easterEggMode && easterEggDisplayFlag
                      ? '( ͡° ͜ʖ ͡°)'
                      : cellState}
                  </Text>
                </TouchableRipple>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}
