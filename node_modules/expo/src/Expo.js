// @flow
// These are done for the side effects
import './Logs'; // set up Expo logging infra
import './Location'; // polyfill navigator.geolocation

import { NativeModules } from 'react-native';
import Constants from './Constants';

if (typeof Constants.manifest.env === 'object') {
  Object.assign(process.env, Constants.manifest.env);
}

// NOTE(brentvatne): this is temporarily disabled until we can work out bugs
// with ref and context
//
// Re-define the React Native modal to use our version of it, which plays
// nicely with the Expo Menu on iOS
// Object.defineProperty(ReactNative, 'Modal', {
//   get() {
//     return require('./Modal/Modal').default;
//   },
// });

module.exports = {
  // constants
  get Crypto() {
    return NativeModules.ExponentCrypto;
  },
  get Fabric() {
    return NativeModules.ExponentFabric;
  },
  get ImageCropper() {
    return NativeModules.ExponentImageCropper;
  },

  // defaults
  get apisAreAvailable() {
    return require('./apisAreAvailable').default;
  },
  get registerRootComponent() {
    return require('./registerRootComponent').default;
  },
  get takeSnapshotAsync() {
    return require('./takeSnapshotAsync').default;
  },
  get Accelerometer() {
    return require('./sensor/Accelerometer').default;
  },
  get Asset() {
    return require('./Asset').default;
  },
  get AuthSession() {
    return require('./AuthSession').default;
  },
  get ErrorRecovery() {
    return require('./ErrorRecovery').default;
  },
  get GLView() {
    return require('./GLView').default;
  },
  get Gyroscope() {
    return require('./sensor/Gyroscope').default;
  },
  get Magnetometer() {
    return require('./sensor/Magnetometer').default;
  },
  get MagnetometerUncalibrated() {
    return require('./sensor/MagnetometerUncalibrated').default;
  },
  get Notifications() {
    return require('./Notifications').default;
  },
  get SQLite() {
    return require('./SQLite').default;
  },

  // components
  get AdMobBanner() {
    return require('./RNAdMobBanner').default;
  },
  get PublisherBanner() {
    return require('./RNPublisherBanner').default;
  },
  get AdMobInterstitial() {
    return require('./RNAdMobInterstitial');
  },
  get AdMobRewarded() {
    return require('./RNAdMobRewarded');
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
  get Camera() {
    return require('./Camera').default;
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
  get WebBrowser() {
    return require('./WebBrowser').default;
  },
  get Svg() {
    return require('./Svg').default;
  },
  get Fingerprint() {
    return require('./Fingerprint');
  },

  // globs
  get Amplitude() {
    return require('./Amplitude').default;
  },
  get Audio() {
    return require('./Audio');
  },
  get Brightness() {
    return require('./Brightness');
  },
  get Constants() {
    return require('./Constants').default;
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
    return require('./Facebook').default;
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
  get SecureStore() {
    return require('./SecureStore');
  },
  get Segment() {
    return require('./Segment').default;
  },
  get Speech() {
    return require('./Speech');
  },
  get Util() {
    return require('./Util');
  },
};

if (global) {
  global.__exponent = module.exports;
  global.__expo = module.exports;
  global.Expo = module.exports;
}
