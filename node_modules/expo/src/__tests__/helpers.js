import { Platform } from 'react-native';

let mocks = {};
let flatMockedProperties = [];

function unmockPropertyOnObject(object, property) {
  let fn = mocks[object][property];
  fn && fn();
}

function mockPropertyOnObject(object, property, mockVal) {
  const originalVal = object[property];
  object[property] = mockVal;
  mocks[object] = mocks[object] || {};
  mocks[object][property] = () => {
    object[property] = originalVal;
  };
}

function unmockAll() {
  flatMockedProperties.forEach(unmockFn => unmockFn());
  flatMockedProperties = [];
  mockedProperties = {};
}

function mockPlatformIOS() {
  mockPropertyOnObject(Platform, 'OS', 'ios');
}

function mockPlatformAndroid() {
  mockPropertyOnObject(Platform, 'OS', 'android');
}

module.exports = {
  unmockPropertyOnObject,
  mockPropertyOnObject,
  unmockAll,
  mockPlatformAndroid,
  mockPlatformIOS,
};
