/* @flow */

import { Linking } from 'react-native';
import { Constants, WebBrowser } from 'expo';
import invariant from 'invariant';
import qs from 'qs';

type AuthSessionOptions = {
  authUrl: string,
  returnUrl?: string,
};

type AuthSessionResult =
  | { type: 'cancel' | 'dismissed' | 'locked' }
  | {
      type: 'error' | 'success',
      event: RedirectEvent,
      errorCode: ?string,
      params: Object,
    };

type RedirectEvent = {
  url: string,
};

const BASE_URL = `https://auth.expo.io`;
let _authLock = false;

async function startAsync(
  options: AuthSessionOptions
): Promise<AuthSessionResult> {
  const returnUrl = options.returnUrl || getDefaultReturnUrl();
  const authUrl = options.authUrl;
  const startUrl = getStartUrl(authUrl, returnUrl);

  if (!authUrl) {
    throw new Error(
      'No authUrl provided to AuthSession.startAsync. An authUrl is required -- it points to the page where the user will be able to sign in.'
    );
  }

  // Prevent multiple sessions from running at the same time, WebBrowser doesn't
  // support it this makes the behavior predictable.
  if (_authLock) {
    if (__DEV__) {
      console.warn(
        'Attempted to call AuthSession.startAsync multiple times while already active. Only one AuthSession can be active at any given time'
      );
    }

    return { type: 'locked' };
  } else {
    _authLock = true;
  }

  let result;
  let error;
  try {
    result = await Promise.race([
      _openWebBrowserAsync(startUrl),
      _waitForRedirectAsync(returnUrl),
    ]);
  } catch (e) {
    error = e;
  }

  _closeWebBrowser();
  _stopWaitingForRedirect();
  _authLock = false;

  if (error) {
    throw error;
  } else if (!result || !result.type) {
    throw new Error('Unexpected AuthSession result');
  } else {
    return result;
  }
}

function dismiss() {
  WebBrowser.dismissBrowser();
}

async function _openWebBrowserAsync(startUrl) {
  let result = await WebBrowser.openBrowserAsync(startUrl);
  if (result.type === 'cancel' || result.type === 'dismissed') {
    return { type: result.type };
  }
}

function _closeWebBrowser() {
  WebBrowser.dismissBrowser();
}

let _redirectHandler;
function _waitForRedirectAsync(returnUrl) {
  invariant(
    !_redirectHandler,
    'AuthSession is in a bad state. _redirectHandler is defined when it should not be.'
  );
  return new Promise(resolve => {
    _redirectHandler = (event: RedirectEvent) => {
      if (event.url.startsWith(returnUrl)) {
        let { params, errorCode } = parseUrl(event.url);

        resolve({
          type: errorCode ? 'error' : 'success',
          params,
          errorCode,
          event,
        });
      }
    };

    Linking.addEventListener('url', _redirectHandler);
  });
}

function _stopWaitingForRedirect() {
  Linking.removeEventListener('url', _redirectHandler);
  _redirectHandler = null;
}

function getStartUrl(authUrl: string, returnUrl: string): string {
  let queryString = qs.stringify({
    authUrl,
    returnUrl,
  });

  return `${getRedirectUrl()}/start?${queryString}`;
}

function getRedirectUrl(): string {
  const redirectUrl = `${BASE_URL}/${Constants.manifest.id}`;
  if (__DEV__) {
    _warnIfAnonymous(Constants.manifest.id, redirectUrl);
  }
  return redirectUrl;
}

function getDefaultReturnUrl(): string {
  return `${Constants.linkingUrl}expo-auth-session`;
}

function parseUrl(url: string): { errorCode: ?string, params: Object } {
  let parts = url.split('#');
  let hash = parts[1];
  let partsWithoutHash = parts[0].split('?');
  let queryString = partsWithoutHash[partsWithoutHash.length - 1];

  // Get query string (?hello=world)
  let parsedSearch = qs.parse(queryString);

  // Pull errorCode off of params
  let { errorCode } = parsedSearch;
  delete parsedSearch.errorCode;

  // Get hash (#abc=example)
  let parsedHash = {};
  if (parts[1]) {
    parsedHash = qs.parse(hash);
  }

  // Merge search and hash
  let params = {
    ...parsedSearch,
    ...parsedHash,
  };

  return {
    errorCode,
    params,
  };
}

function _warnIfAnonymous(id, url): void {
  if (id.startsWith('@anonymous/')) {
    console.warn(
      `You are not currently signed in to Expo on your development machine. As a result, the redirect URL for AuthSession will be "${url}". If you are using an OAuth provider that requires whitelisting redirect URLs, we recommend that you do not whitelist this URL -- instead, you should sign in to Expo to acquired a unique redirect URL. Additionally, if you do decide to publish this app using Expo, you will need to register an account to do it.`
    );
  }
}

export default {
  dismiss,
  getRedirectUrl,
  getStartUrl,
  getDefaultReturnUrl,
  get getRedirectUri() {
    console.warn(
      'Use AuthSession.getRedirectUrl rather than AuthSession.getRedirectUri (Url instead of Uri)'
    );
    return getRedirectUrl;
  },
  startAsync,
};
