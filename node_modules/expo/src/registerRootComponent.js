// @flow

import React from 'react';
import { AppRegistry, StyleSheet } from 'react-native';

import Constants from './Constants';
import { processFontFamily } from './Font';
import Notifications from './Notifications';
import ModalHost from './Modal/ModalHost';

function wrapWithExponentRoot(AppRootComponent: ReactClass<{}>) {
  class ExponentRootComponent extends React.Component {
    componentWillMount() {
      StyleSheet.setStyleAttributePreprocessor('fontFamily', processFontFamily);

      if (this.props.exp.notification) {
        Notifications._setInitialNotification(this.props.exp.notification);
      }
    }

    render() {
      return (
        <ModalHost>
          <AppRootComponent {...this.props} />
        </ModalHost>
      );
    }
  }

  return ExponentRootComponent;
}

export default function registerRootComponent(component: ReactClass<{}>) {
  AppRegistry.registerComponent('main', () => wrapWithExponentRoot(component));
}
