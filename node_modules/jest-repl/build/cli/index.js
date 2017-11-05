#!/usr/bin/env node
'use strict';
/**
               * Copyright (c) 2014, Facebook, Inc. All rights reserved.
               *
               * This source code is licensed under the BSD-style license found in the
               * LICENSE file in the root directory of this source tree. An additional grant
               * of patent rights can be found in the PATENTS file in the same directory.
               *
               * 
               */

const path = require('path');
const Runtime = require('jest-runtime');
const yargs = require('yargs');var _require =
require('jest-util');const validateCLIOptions = _require.validateCLIOptions;
const VERSION = require('../../package.json').version;
const args = require('./args');

const REPL_SCRIPT = path.resolve(__dirname, './repl.js');

module.exports = function () {
  const argv = yargs.usage(args.usage).options(args.options).argv;

  validateCLIOptions(argv, args.options);

  argv._ = [REPL_SCRIPT];

  Runtime.runCLI(argv, [`Jest REPL v${VERSION}`]);
};