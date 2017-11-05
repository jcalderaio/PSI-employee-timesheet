import { NativeModules } from 'react-native';

const { ExponentFileSystem: FS } = NativeModules;

const normalizeEndingSlash = p => p.replace(/\/*$/, '') + '/';

FS.documentDirectory = normalizeEndingSlash(FS.documentDirectory);
FS.cacheDirectory = normalizeEndingSlash(FS.cacheDirectory);

export const documentDirectory = FS.documentDirectory;
export const cacheDirectory = FS.cacheDirectory;

export function getInfoAsync(fileUri, options = {}) {
  return FS.getInfoAsync(fileUri, options);
}

export function readAsStringAsync(fileUri) {
  return FS.readAsStringAsync(fileUri, {});
}

export function writeAsStringAsync(fileUri, contents) {
  return FS.writeAsStringAsync(fileUri, contents, {});
}

export function deleteAsync(fileUri, options = {}) {
  return FS.deleteAsync(fileUri, options);
}

export function moveAsync(options) {
  return FS.moveAsync(options);
}

export function copyAsync(options) {
  return FS.copyAsync(options);
}

export function makeDirectoryAsync(fileUri, options = {}) {
  return FS.makeDirectoryAsync(fileUri, options);
}

export function readDirectoryAsync(fileUri) {
  return FS.readDirectoryAsync(fileUri, {});
}

export function downloadAsync(uri, fileUri, options = {}) {
  return FS.downloadAsync(uri, fileUri, options);
}
