import { Platform } from 'react-native';

const allOriginalObjectProperties = new Map();

export function mockProperty(object, property, mockValue) {
  // Save a reference to the original property value
  if (!allOriginalObjectProperties.has(object)) {
    allOriginalObjectProperties.set(object, new Map());
  }
  allOriginalObjectProperties.get(object).set(property, object[property]);

  object[property] = mockValue;
}

export function unmockProperty(object, property) {
  let objectProperties = allOriginalObjectProperties.get(object);
  if (!objectProperties || !objectProperties.has(property)) {
    return;
  }

  object[property] = objectProperties.get(property);

  // Clean up the reference
  objectProperties.delete(property);
  if (!objectProperties.size) {
    allOriginalObjectProperties.delete(object);
  }
}

export function unmockAllProperties() {
  for (let [object, objectProperties] of allOriginalObjectProperties) {
    for (let [property, originalValue] of objectProperties) {
      object[property] = originalValue;
    }
  }
  allOriginalObjectProperties.clear();
}

export function mockPlatformIOS() {
  mockProperty(Platform, 'OS', 'ios');
}

export function mockPlatformAndroid() {
  mockProperty(Platform, 'OS', 'android');
}
