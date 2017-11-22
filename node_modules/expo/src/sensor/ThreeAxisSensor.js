// @flow

import { NativeEventEmitter, Platform } from 'react-native';

type Measurement = {
  x: number,
  y: number,
  z: number,
};

type Listener = Measurement => void;

type Subscription = {
  remove: () => void,
};

type NativeSensorModule = Object;

/**
 * A base class for subscribable sensors. The events emitted by this class are
 * {x, y, z} measurements.
 */
export default class ThreeAxisSensor {
  _nativeModule: NativeSensorModule;
  _nativeEmitter: NativeEventEmitter;
  _nativeEventName: string;

  constructor(nativeSensorModule: NativeSensorModule, nativeEventName: string) {
    this._nativeModule = nativeSensorModule;
    this._nativeEmitter = new NativeEventEmitter(nativeSensorModule);
    this._nativeEventName = nativeEventName;
  }

  hasListeners(): boolean {
    return this.getListenerCount() > 0;
  }

  getListenerCount(): number {
    return this._nativeEmitter.listeners(this._nativeEventName).length;
  }

  addListener(listener: Listener): Subscription {
    if (Platform.OS === 'android') {
      if (!this.hasListeners()) {
        this._nativeModule.startObserving();
      }
    }

    let subscription = this._nativeEmitter.addListener(
      this._nativeEventName,
      listener
    );
    subscription.remove = () => this.removeSubscription(subscription);
    return subscription;
  }

  removeAllListeners(): void {
    if (Platform.OS === 'android') {
      this._nativeModule.stopObserving();
    }

    return this._nativeEmitter.removeAllListeners(this._nativeEventName);
  }

  removeSubscription(subscription: Subscription): void {
    if (Platform.OS === 'android') {
      if (this.getListenerCount() === 1) {
        this._nativeModule.stopObserving();
      }
    }

    return this._nativeEmitter.removeSubscription(subscription);
  }

  setUpdateInterval(intervalMs: number): void {
    this._nativeModule.setUpdateInterval(intervalMs);
  }
}
