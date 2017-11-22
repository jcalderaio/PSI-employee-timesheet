/* @flow */

import { EventEmitter, EventSubscription } from 'fbemitter';
import { DeviceEventEmitter, NativeModules } from 'react-native';

const { ExponentUtil } = NativeModules;

export function getCurrentDeviceCountryAsync(): Promise<string> {
  return ExponentUtil.getCurrentDeviceCountryAsync();
}

export function getCurrentLocaleAsync(): Promise<string> {
  return ExponentUtil.getCurrentLocaleAsync();
}

export function getCurrentTimeZoneAsync(): Promise<string> {
  return ExponentUtil.getCurrentTimeZoneAsync();
}

export function reload() {
  ExponentUtil.reload();
}

let _emitter;

function _maybeInitEmitter() {
  if (!_emitter) {
    _emitter = new EventEmitter();
    DeviceEventEmitter.addListener(
      'Exponent.newVersionAvailable',
      _emitNewVersionAvailable
    );
  }
}

function _emitNewVersionAvailable(newVersionEvent) {
  if (typeof newVersionEvent === 'string') {
    newVersionEvent = JSON.parse(newVersionEvent);
  }

  _emitter.emit('newVersionAvailable', newVersionEvent);
}

export function addNewVersionListenerExperimental(
  listener: Function
): EventSubscription {
  _maybeInitEmitter();

  return _emitter.addListener('newVersionAvailable', listener);
}
