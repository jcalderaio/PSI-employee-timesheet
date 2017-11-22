// @flow
import { NativeModules, Platform } from 'react-native';

const { ExponentSegment } = NativeModules;

export default {
  initialize(options: { androidWriteKey?: string, iosWriteKey?: string }) {
    if (Platform.OS === 'android') {
      return ExponentSegment.initializeAndroid(options.androidWriteKey);
    } else if (Platform.OS === 'ios') {
      return ExponentSegment.initializeIOS(options.iosWriteKey);
    } else {
      throw new Error(`Unable to initialize Segment on \`${Platform.OS}\``);
    }
  },

  initializeIOS(writeKey: string) {
    console.warn(
      '`Segment.initializeIOS(writeKey)` is deprecated, use `Segment.initialize({androidWriteKey, iosWriteKey})` instead.'
    );
    if (Platform.OS !== 'ios') {
      throw new Error(
        `Expo.Segment.initializeIOS() should only be called on iOS, not \`${Platform.OS}\``
      );
    }

    return ExponentSegment.initializeIOS(writeKey);
  },

  initializeAndroid(writeKey: string) {
    console.warn(
      '`Segment.initializeAndroid(writeKey)` is deprecated, use `Segment.initialize({androidWriteKey, iosWriteKey})` instead.'
    );
    if (Platform.OS !== 'android') {
      throw new Error(
        `Expo.Segment.initializeAndroid() should only be called on Android, not \`${Platform.OS}\``
      );
    }

    return ExponentSegment.initializeAndroid(writeKey);
  },

  identify(userId: string) {
    return ExponentSegment.identify(userId);
  },

  identifyWithTraits(userId: string, traits: { [string]: any }) {
    return ExponentSegment.identifyWithTraits(userId, traits);
  },

  reset() {
    return ExponentSegment.reset();
  },

  track(event: string) {
    return ExponentSegment.track((event: string));
  },

  trackWithProperties(event: string, properties: { [string]: any }) {
    return ExponentSegment.trackWithProperties(event, properties);
  },

  screen(screenName: string) {
    return ExponentSegment.screen(screenName);
  },

  screenWithProperties(event: string, properties: string) {
    return ExponentSegment.screenWithProperties(event, properties);
  },

  flush() {
    return ExponentSegment.flush();
  },
};
