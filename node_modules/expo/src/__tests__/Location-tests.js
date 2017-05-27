jest.doMock('NativeEventEmitter', () => require('fbemitter').EventEmitter);

import { NativeModules } from 'react-native';
import * as Permissions from '../Permissions';
import Location from '../Location';
import {
  mockPropertyOnObject,
  unmockAll,
  mockPlatformIOS,
  mockPlatformAndroid,
} from './helpers';

const fakeReturnValue = {
  coords: {
    latitude: 1,
    longitude: 2,
    altitude: 3,
    accuracy: 4,
    heading: 5,
    speed: 6,
  },
  timestamp: 7,
};

function applyMocks() {
  mockPropertyOnObject(
    NativeModules.ExponentLocation,
    'getCurrentPositionAsync',
    jest.fn(() => new Promise(resolve => resolve(fakeReturnValue)))
  );

  mockPropertyOnObject(
    NativeModules.ExponentLocation,
    'watchPositionImplAsync',
    jest.fn(() => new Promise(resolve => resolve()))
  );
}

describe('Location', () => {
  beforeEach(() => {
    applyMocks();
  });

  afterEach(() => {
    unmockAll();
  });

  describe('getCurrentPositionAsync', () => {
    it('works on android', async () => {
      mockPlatformAndroid();
      let result = await Location.getCurrentPositionAsync({});
      expect(result).toEqual(fakeReturnValue);
    });

    it('works on ios', async () => {
      mockPlatformIOS();
      setImmediate(() => emitNativeLocationUpdate(fakeReturnValue));
      let result = await Location.getCurrentPositionAsync({});
      expect(result).toEqual(fakeReturnValue);
    });
  });

  describe('watchPositionAsync', () => {
    it('receives repeated events', async () => {
      let callback = jest.fn();
      Location.watchPositionAsync({}, callback);
      emitNativeLocationUpdate(fakeReturnValue);
      emitNativeLocationUpdate(fakeReturnValue);
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  describe('navigator.geolocation polyfill', () => {
    const noop = () => {};

    beforeEach(() => {
      applyMocks();
    });

    afterEach(() => {
      unmockAll();
    });

    describe('getCurrentPosition', () => {
      it('asks for permissions beforehand', () => {
        let askAsyncMock = jest.fn();
        mockPropertyOnObject(Permissions, 'askAsync', askAsyncMock);
        Location._polyfill.getCurrentPosition(noop, noop, {});
        expect(askAsyncMock).toHaveBeenCalledWith(Permissions.LOCATION);
      });

      it('invokes error callback if permissions are rejected', () => {
        let askAsyncMock = jest.fn(permissionType => {
          return new Promise(resolve => {
            resolve({ status: 'undetermined' });
          });
        });
        mockPropertyOnObject(Permissions, 'askAsync', askAsyncMock);
        let errorCallback = jest.fn();
        Location._polyfill.getCurrentPosition(noop, errorCallback, {});

        setImmediate(() => {
          expect(errorCallback).toHaveBeenCalled();
        });
      });

      it('delegates to getCurrentPositionAsync when permissions are granted', () => {
        let askAsyncMock = jest.fn(
          () => new Promise(resolve => resolve({ status: 'granted' }))
        );
        mockPropertyOnObject(Permissions, 'askAsync', askAsyncMock);

        let options = {};

        let getCurrentPermissionsAsyncMock = jest.fn(
          () => new Promise(resolve => resolve())
        );
        mockPropertyOnObject(
          Location,
          'getCurrentPositionAsync',
          getCurrentPermissionsAsyncMock
        );

        Location._polyfill.getCurrentPosition(noop, noop, options);
        setImmediate(() => {
          expect(Location.getCurrentPositionAsync).toHaveBeenCalledWith(
            options
          );
        });
      });
    });

    describe('watchPosition', () => {
      it('asks for permissions beforehand', () => {
        let askAsyncMock = jest.fn(
          () => new Promise(resolve => resolve({ status: 'granted' }))
        );
        mockPropertyOnObject(Permissions, 'askAsync', askAsyncMock);
        Location._polyfill.watchPosition(noop, noop, {});
        expect(askAsyncMock).toHaveBeenCalledWith(Permissions.LOCATION);
      });

      it('invokes error callback if permissions are rejected', () => {
        let askAsyncMock = jest.fn(permissionType => {
          return new Promise(resolve => {
            resolve({ status: 'undetermined' });
          });
        });
        mockPropertyOnObject(Permissions, 'askAsync', askAsyncMock);
        let errorCallback = jest.fn();
        Location._polyfill.watchPosition(noop, errorCallback, {});

        setImmediate(() => {
          expect(errorCallback).toHaveBeenCalled();
        });
      });

      it('watches for updates and stops when clearWatch is called', () => {
        let askAsyncMock = jest.fn(
          () => new Promise(resolve => resolve({ status: 'granted' }))
        );
        mockPropertyOnObject(Permissions, 'askAsync', askAsyncMock);

        let callback = jest.fn();
        let watchId = Location._polyfill.watchPosition(callback, () => {}, {});
        emitNativeLocationUpdate(fakeReturnValue);
        emitNativeLocationUpdate(fakeReturnValue);
        expect(callback).toHaveBeenCalledTimes(2);

        Location._polyfill.clearWatch(watchId);
        emitNativeLocationUpdate(fakeReturnValue);
        expect(callback).toHaveBeenCalledTimes(2);
      });
    });

    describe('stopObserving', () => {
      it('does nothing!', () => {
        // but should it do something?
      });
    });
  });
});

function emitNativeLocationUpdate(location, watchId) {
  Location.EventEmitter.emit('Exponent.locationChanged', {
    watchId: Location._getCurrentWatchId(),
    location,
  });
}
