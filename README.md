# Tic-Tac-Toe React

📣🎉 Live demo: https://xintre.github.io/TicTacToe-web-react

- [Tic-Tac-Toe React](#tic-tac-toe-react)
  - [Introduction](#introduction)
  - [Demo](#demo)
  - [Available Scripts](#available-scripts)
    - [`npm start`](#npm-start)
    - [`npm test`](#npm-test)
    - [`npm run build`](#npm-run-build)
    - [`npm run eject`](#npm-run-eject)
- [Getting Started](#getting-started)
  - [Step 1: Start the Metro Server](#step-1-start-the-metro-server)
  - [Step 2: Build \& run the native application](#step-2-build--run-the-native-application)
    - [For Android](#for-android)
    - [For iOS](#for-ios)

## Introduction

This is React Native TicTacToe scalable game with haptic feedback. It is implemented in TypeScript JSX with the React framework, using:

- [react-native-paper](https://reactnativepaper.com/) as the components library
- [react-native-paper-snackbar-stack](https://github.com/suleymanbariseser/react-native-paper-snackbar-stack/) as the library for creating popping up material design snackbars
- [lodash](https://lodash.com/) for utilities
- [immutable.js](https://immutable-js.com/) for Set / Map that support deep equality syntax, i.e. allow a Set to carry dicts that are compared by value rather than reference
- [react-native-device-info](https://github.com/react-native-device-info/react-native-device-info) for checking if the device is a tablet

This project is a port of my original implementation of the [TicTacToe Jetpack Compose Android app](https://github.com/Xintre/TicTacToe) & [TicTacToe React web app](https://github.com/Xintre/tictactoe-web-react).

## Demo

You can download the APK file for Android from the [latest release page](https://github.com/Xintre/TicTacToe-ReactNative/releases/latest).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

# Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build & run the native application

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```
