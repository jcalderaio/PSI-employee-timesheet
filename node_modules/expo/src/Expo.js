// @flow

import ReactNative, { NativeModules } from 'react-native';
import { manifest } from './Constants';

// These are done for the side effects
import './Logs'; // set up Expo logging infra
import './Location'; // polyfill navigator.geolocation

if (typeof manifest.env === 'object') {
  Object.assign(process.env, manifest.env);
}

// NOTE(brentvatne): this is temporarily disabled until we can work out bugs
// with ref and context
//
// Re-define the React Native modal to use our version of it, which plays
// nicely with the Expo Menu on iOS
// $FlowFixMe
// Object.defineProperty(ReactNative, 'Modal', {
//   get() {
//     return require('./Modal/Modal').default;
//   },
// });

module.exports = {
  // constants
  get Amplitude() {
    return NativeModules.ExponentAmplitude;
  },
  get Crypto() {
    return NativeModules.ExponentCrypto;
  },
  get ErrorRecovery() {
    return NativeModules.ExponentErrorRecovery;
  },
  get Fabric() {
    return NativeModules.ExponentFabric;
  },
  get Fingerprint() {
    return NativeModules.ExponentFingerprint;
  },
  get ImageCropper() {
    return NativeModules.ExponentImageCropper;
  },
  get WebBrowser() {
    return NativeModules.ExponentWebBrowser;
  },
  get Segment() {
    return NativeModules.ExponentSegment;
  },
  get Util() {
    return NativeModules.ExponentUtil;
  },

  // defaults
  get apisAreAvailable() {
    return require('./apisAreAvailable').default;
  },
  get createTHREEViewClass() {
    return require('./createTHREEViewClass').default;
  },
  get registerRootComponent() {
    return require('./registerRootComponent').default;
  },
  get takeSnapshotAsync() {
    return require('./takeSnapshotAsync').default;
  },
  get Asset() {
    return require('./Asset').default;
  },
  get Accelerometer() {
    return require('./Accelerometer').default;
  },
  get GLView() {
    return require('./GLView').default;
  },
  get Gyroscope() {
    return require('./Gyroscope').default;
  },
  get Notifications() {
    return require('./Notifications').default;
  },
  get SQLite() {
    return require('./SQLite').default;
  },

  get AppLoading() {
    return require('./AppLoading').default;
  },
  get BarCodeScanner() {
    return require('./BarCodeScanner').default;
  },
  get BlurView() {
    return require('./BlurView').default;
  },
  get KeepAwake() {
    return require('./KeepAwake').default;
  },
  get LinearGradient() {
    return require('./LinearGradient').default;
  },
  get MapView() {
    return require('react-native-maps');
  },
  get Modal() {
    return require('./Modal/Modal').default;
  },
  get Video() {
    return require('./Video').default;
  },
  get Svg() {
    return require('./Svg').default;
  },

  // globs
  get Audio() {
    return require('./Audio');
  },
  get Constants() {
    return require('./Constants');
  },
  get Contacts() {
    return require('./Contacts');
  },
  get DangerZone() {
    return require('./DangerZone');
  },
  get DocumentPicker() {
    return require('./DocumentPicker');
  },
  get FileSystem() {
    return require('./FileSystem');
  },
  get Font() {
    return require('./Font');
  },
  get Google() {
    return require('./Google');
  },
  get Icon() {
    return require('./Icon').default;
  },
  get ImagePicker() {
    return require('./ImagePicker');
  },
  get Location() {
    return require('./Location').default;
  },
  get Logs() {
    return require('./Logs');
  },
  get Pedometer() {
    return require('./Pedometer');
  },
  get Permissions() {
    return require('./Permissions');
  },
  get Facebook() {
    return require('./Facebook');
  },
  get FacebookAds() {
    return require('./FacebookAds');
  },
  get LegacyAsyncStorage() {
    return require('./LegacyAsyncStorage');
  },
  get IntentLauncherAndroid() {
    return require('./IntentLauncherAndroid');
  },
  get ScreenOrientation() {
    return require('./ScreenOrientation');
  },
  get Speech() {
    return require('./Speech');
  },
};

if (global) {
  global.__exponent = module.exports;
  global.__expo = module.exports;
  global.Expo = module.exports;
}
