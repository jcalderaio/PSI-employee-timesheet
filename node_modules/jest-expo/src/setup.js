'use strict';

// setup react-native jest preset
require.requireActual('react-native/jest/setup');

const { Response, Request, Headers, fetch } = require('whatwg-fetch');
global.Response = Response;
global.Request = Request;
global.Headers = Headers;
global.fetch = fetch;

const mockNativeModules = require('NativeModules');

// window isn't defined as of react-native 0.45+ it seems
if (typeof window !== 'object') {
  global.window = global;
  global.window.navigator = global.window.navigator || {};
}

const mockEmptyObject = {};
const mockImageLoader = {
  configurable: true,
  enumerable: true,
  get: () => ({
    prefetchImage: jest.fn(),
    getSize: jest.fn((uri, success) =>
      process.nextTick(() => success(320, 240))
    ),
  }),
};
Object.defineProperty(mockNativeModules, 'ImageLoader', mockImageLoader);
Object.defineProperty(mockNativeModules, 'ImageViewManager', mockImageLoader);

const expoModules = require('./expoModules');
const expoModuleCustomMocks = {
  ExponentFontLoader: {
    loadAsync: jest.fn(() => new Promise(resolve => resolve())),
  },
  ExponentFileSystem: {
    downloadAsync: jest.fn(
      () => new Promise(resolve => resolve({ md5: 'md5', uri: 'uri' }))
    ),
    getInfoAsync: jest.fn(() => {
      return new Promise(resolve =>
        resolve({ exists: true, md5: 'md5', uri: 'uri' })
      );
    }),
  },
};

expoModules.forEach(module => {
  const moduleName = Object.keys(module)[0];
  const moduleProperties = module[moduleName];
  const mockedProperties = {};

  moduleProperties.forEach(property => {
    const propertyName = Object.keys(property)[0];
    const propertyType = property[propertyName];
    const customMock =
      expoModuleCustomMocks[moduleName] &&
      expoModuleCustomMocks[moduleName][propertyName];

    let mockValue;
    if (customMock) {
      mockValue = customMock;
    } else if (propertyType === 'function') {
      mockValue = jest.fn();
    } else if (propertyType === 'number') {
      mockValue = 1;
    } else {
      mockValue = jest.mock();
    }

    mockedProperties[propertyName] = mockValue;
  });

  Object.defineProperty(mockNativeModules, moduleName, {
    enumerable: true,
    get: () => mockedProperties,
  });
});

jest.mock('react-native/Libraries/Image/AssetRegistry', () => ({
  registerAsset: jest.fn(() => 1),
  getAssetByID: jest.fn(() => ({
    scales: [1],
    fileHashes: ['md5'],
    name: 'name',
    exists: true,
    type: 'type',
    hash: 'md5',
    uri: 'uri',
    width: 1,
    height: 1,
  })),
}));

jest.doMock('NativeModules', () => mockNativeModules);
