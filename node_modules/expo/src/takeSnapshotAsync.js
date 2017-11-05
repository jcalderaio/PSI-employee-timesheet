/* @flow */

import { NativeModules, findNodeHandle } from 'react-native';

const { RNViewShot } = NativeModules;

export default async function takeSnapshotAsync(
  view: ?(number | React$Element<*>),
  options?: {
    width?: number,
    height?: number,
    format?: 'png' | 'jpg' | 'jpeg' | 'webm',
    quality?: number,
    result?: 'file' | 'base64' | 'data-uri',
  }
): Promise<string> {
  if (typeof view !== 'number') {
    const node = findNodeHandle(view);
    if (!node) {
      throw new Error('findNodeHandle failed to resolve view=' + String(view));
    }
    view = node;
  }

  return RNViewShot.takeSnapshot(view, options);
}
