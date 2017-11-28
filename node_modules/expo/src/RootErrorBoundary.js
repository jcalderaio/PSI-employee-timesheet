/* @flow */
import React from 'react';
import { NativeModules, Text, View } from 'react-native';

import { getAppLoadingLifecycleEmitter } from './AppLoading';

type State = {
  error: any,
};

export default class RootErrorBoundary extends React.Component<*, State> {
  state = {
    error: null,
  };

  _appLoadingIsMounted = false;

  componentWillMount() {
    // In production the app will just hard crash on errors, unless the developer
    // decides to handle them by overriding the global error handler and swallowing
    // the error, in which case they are responsible for determining how to recover
    // from this state.
    if (__DEV__) {
      getAppLoadingLifecycleEmitter().once(
        'componentDidMount',
        this._subscribeToGlobalErrors
      );
      getAppLoadingLifecycleEmitter().once(
        'componentWillUnmount',
        this._unsubscribeFromGlobalErrors
      );
    }
  }

  _subscribeToGlobalErrors = () => {
    this._appLoadingIsMounted = true;

    /* $FlowFixMe */
    let originalErrorHandler = ErrorUtils.getGlobalHandler();

    ErrorUtils.setGlobalHandler((error, isFatal) => {
      if (this._appLoadingIsMounted) {
        NativeModules.ExponentAppLoadingManager &&
          NativeModules.ExponentAppLoadingManager.finishedAsync();

        if (isFatal) {
          this.setState({ error });
        }
      }

      originalErrorHandler(error, isFatal);
    });
  };

  _unsubscribeFromGlobalErrors = () => {
    // We don't remove the global error handler that we set here because
    // it is conceivable that the user may add error handlers *after*
    // we subscribe, and we don't want to override those, so instead we just
    // gate call
    this._appLoadingIsMounted = false;
  };

  // Test this by adding `throw new Error('example')` to your root component
  unstable_handleError(error: any) {
    if (this._appLoadingIsMounted) {
      NativeModules.ExponentAppLoadingManager &&
        NativeModules.ExponentAppLoadingManager.finishedAsync();
    }

    // This will hard crash your app in production
    console.error(error);

    if (__DEV__) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      const paragraphStyle = {
        marginBottom: 10,
        textAlign: 'center',
        marginHorizontal: 30,
        maxWidth: 350,
        fontSize: 15,
        color: '#888',
      };

      return (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 40, marginBottom: 20 }}>⚠️</Text>
          <Text style={[paragraphStyle, { color: '#000' }]}>
            A fatal error was encountered while rendering the root component.
          </Text>
          <Text style={paragraphStyle}>
            Review your application logs for more information, and reload the
            app when the issue is resolved. In production, your app would have
            crashed.
          </Text>
        </View>
      );
    } else {
      return this.props.children;
    }
  }
}
