import map from 'lodash.map';
import zipObject from 'lodash.zipobject';

import customOpenDatabase from 'websql/custom';

import { NativeModules, Platform } from 'react-native';
const { ExponentSQLite } = NativeModules;

if (!process.nextTick) {
  process.nextTick = callback => setTimeout(callback, 0);
}

function SQLiteResult(error, insertId, rowsAffected, rows) {
  this.error = error;
  this.insertId = insertId;
  this.rowsAffected = rowsAffected;
  this.rows = rows;
}

function massageError(err) {
  return typeof err === 'string' ? new Error(err) : err;
}

function SQLiteDatabase(name) {
  this._name = name;
}

function dearrayifyRow(res) {
  // use a compressed array format to send minimal data between
  // native and web layers
  var rawError = res[0];
  if (rawError) {
    return new SQLiteResult(massageError(res[0]));
  }
  var insertId = res[1];
  if (insertId === null) {
    insertId = void 0; // per the spec, should be undefined
  }
  var rowsAffected = res[2];
  var columns = res[3];
  var rows = res[4];
  var zippedRows = [];
  for (var i = 0, len = rows.length; i < len; i++) {
    zippedRows.push(zipObject(columns, rows[i]));
  }

  // v8 likes predictable objects
  return new SQLiteResult(null, insertId, rowsAffected, zippedRows);
}

// send less data over the wire, use an array
function arrayifyQuery(query) {
  return [query.sql, escapeForAndroid(query.args || [])];
}

// for avoiding strings truncated with '\u0000'
function escapeForAndroid(args) {
  if (Platform.OS === 'android') {
    return JSON.stringify(args);
  } else {
    return args;
  }
}

SQLiteDatabase.prototype.exec = function exec(queries, readOnly, callback) {
  function onSuccess(rawResults) {
    var results = map(rawResults, dearrayifyRow);
    callback(null, results);
  }

  function onError(err) {
    callback(massageError(err));
  }

  ExponentSQLite.exec(this._name, map(queries, arrayifyQuery), readOnly).then(
    onSuccess,
    onError
  );
};

const openDB = customOpenDatabase(SQLiteDatabase);

function openDatabase(name, version, description, size, callback) {
  if (name && typeof name === 'object') {
    // accept SQLite Plugin 1-style object here
    callback = version;
    size = name.size;
    description = name.description;
    version = name.version;
    name = name.name;
  }
  if (!size) {
    size = 1;
  }
  if (!description) {
    description = name;
  }
  if (!version) {
    version = '1.0';
  }
  if (typeof name === 'undefined') {
    throw new Error('please be sure to call: openDatabase("myname.db")');
  }
  return openDB(name, version, description, size, callback);
}

export default {
  openDatabase,
};
