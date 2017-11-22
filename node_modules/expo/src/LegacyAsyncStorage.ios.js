/* eslint-disable */
// Copyright 2015-present 650 Industries. All rights reserved.

// Read-only access to legacy (unscoped) `RCTAsyncLocalStorage` backing for
// access to legacy data, now that the new one we use in our fork is scoped
// per-app

// This code is basically based on react-native's built-in
// `RCTAsyncStorage.js` except hardcoded to use
// `ExponentLegacyAsyncLocalStorage` as the native module backing

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */
'use strict';

var NativeModules = require('react-native').NativeModules;
var AsyncStorage = require('react-native').AsyncStorage;

// Use RocksDB if available, then SQLite, then file storage.
var RCTAsyncStorage = NativeModules.ExponentLegacyAsyncLocalStorage;

/**
 * @class
 * @description
 * `AsyncStorage` is a simple, unencrypted, asynchronous, persistent, key-value storage
 * system that is global to the app.  It should be used instead of LocalStorage.
 *
 * It is recommended that you use an abstraction on top of `AsyncStorage`
 * instead of `AsyncStorage` directly for anything more than light usage since
 * it operates globally.
 *
 * On iOS, `AsyncStorage` is backed by native code that stores small values in a
 * serialized dictionary and larger values in separate files. On Android,
 * `AsyncStorage` will use either [RocksDB](http://rocksdb.org/) or SQLite
 * based on what is available.
 *
 * The `AsyncStorage` JavaScript code is a simple facade that provides a clear
 * JavaScript API, real `Error` objects, and simple non-multi functions. Each
 * method in the API returns a `Promise` object.
 *
 * Persisting data:
 * ```
 * try {
 *   await AsyncStorage.setItem('@MySuperStore:key', 'I like to save it.');
 * } catch (error) {
 *   // Error saving data
 * }
 * ```
 *
 * Fetching data:
 * ```
 * try {
 *   const value = await AsyncStorage.getItem('@MySuperStore:key');
 *   if (value !== null){
 *     // We have data!!
 *     console.log(value);
 *   }
 * } catch (error) {
 *   // Error retrieving data
 * }
 * ```
 */
var LegacyAsyncStorage = {
  _getRequests: ([]: Array<any>),
  _getKeys: ([]: Array<string>),
  _immediate: (null: ?number),

  async migrateItems(items, { force = false } = {}) {
    // Skip if already migrated and not forcing
    if (!force && (await RCTAsyncStorage.isMigrationDone())) {
      return;
    }

    // Get the old values
    const oldValuesArray = await LegacyAsyncStorage.multiGet(items);

    // Skip missing or newly set values
    const newValuesArray = await AsyncStorage.multiGet(items);
    const newValuesMap = {};
    newValuesArray.forEach(([k, v]) => (newValuesMap[k] = v));
    const valuesToSet = oldValuesArray.filter(
      ([k, v]) => v !== null && newValuesMap[k] == null
    );

    // Migrate!
    await AsyncStorage.multiSet(valuesToSet);
    await RCTAsyncStorage.setMigrationDone();
  },

  /**
   * Fetches an item for a `key` and invokes a callback upon completion.
   * Returns a `Promise` object.
   * @param key Key of the item to fetch.
   * @param callback Function that will be called with a result if found or
   *    any error.
   * @returns A `Promise` object.
   */
  getItem(
    key: string,
    callback?: ?(error: ?Error, result: ?string) => void
  ): Promise {
    return new Promise((resolve, reject) => {
      RCTAsyncStorage.multiGet([key], function(errors, result) {
        // Unpack result to get value from [[key,value]]
        var value = result && result[0] && result[0][1] ? result[0][1] : null;
        var errs = convertErrors(errors);
        callback && callback(errs && errs[0], value);
        if (errs) {
          reject(errs[0]);
        } else {
          resolve(value);
        }
      });
    });
  },

  /**
   * Gets *all* keys known to your app; for all callers, libraries, etc.
   * Returns a `Promise` object.
   * @param callback Function that will be called the keys found and any error.
   * @returns A `Promise` object.
   *
   * Example: see the `multiGet` example.
   */
  getAllKeys(
    callback?: ?(error: ?Error, keys: ?Array<string>) => void
  ): Promise {
    return new Promise((resolve, reject) => {
      RCTAsyncStorage.getAllKeys(function(error, keys) {
        callback && callback(convertError(error), keys);
        if (error) {
          reject(convertError(error));
        } else {
          resolve(keys);
        }
      });
    });
  },

  /**
   * The following batched functions are useful for executing a lot of
   * operations at once, allowing for native optimizations and provide the
   * convenience of a single callback after all operations are complete.
   *
   * These functions return arrays of errors, potentially one for every key.
   * For key-specific errors, the Error object will have a key property to
   * indicate which key caused the error.
   */

  /** Flushes any pending requests using a single batch call to get the data. */
  flushGetRequests(): void {
    const getRequests = this._getRequests;
    const getKeys = this._getKeys;

    this._getRequests = [];
    this._getKeys = [];

    RCTAsyncStorage.multiGet(getKeys, function(errors, result) {
      // Even though the runtime complexity of this is theoretically worse vs if we used a map,
      // it's much, much faster in practice for the data sets we deal with (we avoid
      // allocating result pair arrays). This was heavily benchmarked.
      //
      // Is there a way to avoid using the map but fix the bug in this breaking test?
      // https://github.com/facebook/react-native/commit/8dd8ad76579d7feef34c014d387bf02065692264
      const map = {};
      result &&
        result.forEach(([key, value]) => {
          map[key] = value;
          return value;
        });
      const reqLength = getRequests.length;
      for (let i = 0; i < reqLength; i++) {
        const request = getRequests[i];
        const requestKeys = request.keys;
        const requestResult = requestKeys.map(key => [key, map[key]]);
        request.callback && request.callback(null, requestResult);
        request.resolve && request.resolve(requestResult);
      }
    });
  },

  /**
   * This allows you to batch the fetching of items given an array of `key`
   * inputs. Your callback will be invoked with an array of corresponding
   * key-value pairs found:
   *
   * ```
   * multiGet(['k1', 'k2'], cb) -> cb([['k1', 'val1'], ['k2', 'val2']])
   * ```
   *
   * The method returns a `Promise` object.
   *
   * @param keys Array of key for the items to get.
   * @param callback Function that will be called with a key-value array of
   *     the results, plus an array of any key-specific errors found.
   * @returns A `Promise` object.
   *
   * @example <caption>Example</caption>
   *
   * AsyncStorage.getAllKeys((err, keys) => {
   *   AsyncStorage.multiGet(keys, (err, stores) => {
   *    stores.map((result, i, store) => {
   *      // get at each store's key/value so you can work with it
   *      let key = store[i][0];
   *      let value = store[i][1];
   *     });
   *   });
   * });
   */
  multiGet(
    keys: Array<string>,
    callback?: ?(errors: ?Array<Error>, result: ?Array<Array<string>>) => void
  ): Promise {
    if (!this._immediate) {
      this._immediate = setImmediate(() => {
        this._immediate = null;
        this.flushGetRequests();
      });
    }

    var getRequest = {
      keys,
      callback,
      // do we need this?
      keyIndex: this._getKeys.length,
      resolve: null,
      reject: null,
    };

    var promiseResult = new Promise((resolve, reject) => {
      getRequest.resolve = resolve;
      getRequest.reject = reject;
    });

    this._getRequests.push(getRequest);
    // avoid fetching duplicates
    keys.forEach(key => {
      if (this._getKeys.indexOf(key) === -1) {
        this._getKeys.push(key);
      }
    });

    return promiseResult;
  },
};

function convertErrors(errs) {
  if (!errs) {
    return null;
  }
  return (Array.isArray(errs) ? errs : [errs]).map(e => convertError(e));
}

function convertError(error) {
  if (!error) {
    return null;
  }
  var out = new Error(error.message);
  out.key = error.key; // flow doesn't like this :(
  return out;
}

module.exports = LegacyAsyncStorage;
