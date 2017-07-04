// @flow

import { NativeModules } from 'react-native';

const { ExponentFacebook } = NativeModules;

type FacebookLoginResult = {
  type: string,
  token?: string,
  expires?: number,
};

type FacebookOptions = {
  permissions?: Array<string>,
  behavior?: 'web' | 'native' | 'browser' | 'system',
};

export async function logInWithReadPermissionsAsync(
  appId: string,
  options?: ?FacebookOptions
): Promise<FacebookLoginResult> {
  if (!options || typeof options !== 'object') {
    options = {};
  }
  return ExponentFacebook.logInWithReadPermissionsAsync(appId, options);
}
