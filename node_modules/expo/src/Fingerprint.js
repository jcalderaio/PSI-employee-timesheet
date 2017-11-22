// @flow

import { Platform, NativeModules } from 'react-native';
import invariant from 'invariant';

const { ExponentFingerprint } = NativeModules;

type FingerprintAuthenticationResult = {
  success: boolean,
  error: any,
};

export function hasHardwareAsync(): Promise<boolean> {
  return ExponentFingerprint.hasHardwareAsync();
}

export function isEnrolledAsync(): Promise<boolean> {
  return ExponentFingerprint.isEnrolledAsync();
}

export function authenticateAsync(
  promptMessageIOS?: string = 'Authenticate'
): Promise<FingerprintAuthenticationResult> {
  if (Platform.OS === 'ios') {
    invariant(
      typeof promptMessageIOS === 'string' && promptMessageIOS.length,
      'Fingerprint.authenticateAsync must be called with a non-empty string on iOS'
    );
    return ExponentFingerprint.authenticateAsync(promptMessageIOS);
  } else {
    return ExponentFingerprint.authenticateAsync();
  }
}

export function cancelAuthenticate(): void {
  ExponentFingerprint.cancelAuthenticate();
}
