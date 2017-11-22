/* eslint-disable */
// Copyright 2015-present 650 Industries. All rights reserved.

var LegacyAsyncStorage = {
  async migrateItems(items) {},

  getItem(
    key: string,
    callback?: ?(error: ?Error, result: ?string) => void
  ): Promise {
    return new Promise((resolve, reject) => {
      callback && callback(null, null);
      resolve(null);
    });
  },

  getAllKeys(
    callback?: ?(error: ?Error, keys: ?Array<string>) => void
  ): Promise {
    return new Promise((resolve, reject) => {
      callback && callback(null, []);
      resolve([]);
    });
  },

  flushGetRequests(): void {},

  multiGet(
    keys: Array<string>,
    callback?: ?(errors: ?Array<Error>, result: ?Array<Array<string>>) => void
  ): Promise {
    return new Promise((resolve, reject) => {
      const result = keys.map(key => [key, null]);
      callback && callback(null, result);
      resolve(result);
    });
  },
};

module.exports = LegacyAsyncStorage;
