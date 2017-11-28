import prettyFormat from 'pretty-format';
import UUID from 'uuid-js';

import Constants from './Constants';
import Queue from './lib/Queue';

let logQueue = new Queue();
let logCounter = 0;
let sessionId = UUID.create().toString();
let isSendingLogs = false;
let groupDepth = 0;

export function enableXDELogging() {
  // don't use level below info. only use debug for things that
  // shouldn't be shown to the developer.
  replaceConsoleFunction('log', 'info');
  replaceConsoleFunction('debug', 'info');
  replaceConsoleFunction('info', 'info');
  replaceConsoleFunction('warn', 'warn');
  replaceConsoleFunction('error', 'error');

  // console.group
  let originalGroup = console.group;
  console.group = function(...args) {
    if (originalGroup) {
      originalGroup.apply(console, args);
    }

    queueRemoteLogAsync('info', {}, args);
    groupDepth++;
  };
  console.group.__restore = function() {
    console.group = originalGroup;
  };

  let originalGroupCollapsed = console.groupCollapsed;
  console.groupCollapsed = function(...args) {
    if (originalGroupCollapsed) {
      originalGroupCollapsed.apply(console, args);
    }

    queueRemoteLogAsync(
      'info',
      {
        groupCollapsed: true,
      },
      args
    );
    groupDepth++;
  };
  console.groupCollapsed.__restore = function() {
    console.groupCollapsed = originalGroupCollapsed;
  };

  let originalGroupEnd = console.groupEnd;
  console.groupEnd = function(...args) {
    if (originalGroupEnd) {
      originalGroupEnd.apply(console, args);
    }

    if (groupDepth > 0) {
      groupDepth--;
    }
    queueRemoteLogAsync(
      'info',
      {
        shouldHide: true,
      },
      args
    );
  };
  console.groupEnd.__restore = function() {
    console.groupEnd = originalGroupEnd;
  };

  // console.assert
  let originalAssert = console.assert;
  console.assert = function(assertion, errorString) {
    if (originalAssert) {
      originalAssert.apply(console, [assertion, errorString]);
    }

    if (!assertion) {
      queueRemoteLogAsync('error', {}, `Assertion failed: ${errorString}`);
    }
  };
  console.assert.__restore = function() {
    console.assert = originalAssert;
  };

  // TODO: support rest of console methods
}

export function disableXDELogging() {
  console.log.__restore();
  console.debug.__restore();
  console.info.__restore();
  console.warn.__restore();
  console.error.__restore();

  console.group.__restore();
  console.groupCollapsed.__restore();
  console.groupEnd.__restore();

  console.assert.__restore();

  // TODO: support rest of console methods
}

async function sendRemoteLogsAsync() {
  if (isSendingLogs) {
    return;
  }

  let logs = [];
  let currentLog = logQueue.dequeue();
  if (!currentLog) {
    return;
  } else {
    isSendingLogs = true;
  }

  while (currentLog) {
    logs.push(currentLog);
    currentLog = logQueue.dequeue();
  }

  try {
    await fetch(Constants.manifest.logUrl, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Connection: 'keep-alive',
        'Proxy-Connection': 'keep-alive',
        Accept: 'application/json',
        'Device-Id': Constants.deviceId,
        'Device-Name': Constants.deviceName,
        'Session-Id': sessionId,
      },
      body: JSON.stringify(logs),
    });
  } catch (e) {}

  isSendingLogs = false;
  sendRemoteLogsAsync();
}

async function queueRemoteLogAsync(level, additionalFields, args) {
  if (!args || !args.map) {
    return;
  }

  //  note(brentvatne): react-native does the same thing internally for yellow-box :/
  if (
    args.length === 1 &&
    typeof args[0] === 'string' &&
    args[0].startsWith('Warning: ')
  ) {
    level = 'warn';

    // Remove the stacktrace from warning message, we will get our own
    let lines = args[0] && args[0].split && args[0].split('\n');
    if (lines && lines[1] && lines[1].match(/^\s+in /)) {
      args[0] = lines[0];
    }
  }

  const { body, includesStack } = await _serializeLogArgsAsync(args, level);

  logQueue.enqueue({
    count: logCounter++,
    level,
    groupDepth,
    includesStack,
    body,
    ...additionalFields,
  });

  // don't block on this
  sendRemoteLogsAsync();
}

function replaceConsoleFunction(consoleFunc, level, additionalFields) {
  const original = console[consoleFunc];

  const newConsoleFunc = function(...args) {
    queueRemoteLogAsync(level, additionalFields, args);

    if (original) {
      original.apply(console, args);
    }
  };

  newConsoleFunc.__restore = function() {
    console[consoleFunc] = original;
  };

  console[consoleFunc] = newConsoleFunc;
}

/* Serialization helpers */

const SENTINEL_ERROR = 'sentinel';
const LOG_FUNCTION_NAME = 'newConsoleFunc';
async function _serializeLogArgsAsync(args, level) {
  let stringifiedArgs;
  let includesStack = false;
  if (
    level === 'warn' &&
    _isUnhandledPromiseRejection(args[0]) &&
    _stackTraceLogsSupported()
  ) {
    // Unhandled promise rejections are mangled and not so useful in their
    // string form, so we take the string, pull the trace out and symbolicate.
    let {
      message,
      stack,
    } = await _symbolicateAndFormatUnhandledPromiseRejectionAsync(args[0]);
    stringifiedArgs = [{ message, stack }];
    includesStack = true;
  } else if (
    ['warn', 'error'].includes(level) &&
    !(args.length === 1 && args[0] instanceof Error) &&
    _stackTraceLogsSupported()
  ) {
    // For console.warn and console.error it is usually useful to know the
    // stack that leads to the warning or error being called. So we provide
    // this information to help out with debugging.
    let error;
    try {
      throw new Error(SENTINEL_ERROR);
    } catch (e) {
      let usefulStackTop = e.stack
        .split('\n')
        .findIndex(frame => frame && frame.includes(LOG_FUNCTION_NAME));
      e.stack = e.stack
        .split('\n')
        .slice(usefulStackTop, e.stack.length)
        .join('\n');
      error = e;
    }

    // ["hello", "world"] becomes hello, world
    let argsString = (await _stringifyLogArgsAsync(args)).join(', ');

    let { message, stack } = await _symbolicateAndFormatErrorAsync(
      error,
      argsString
    );
    stringifiedArgs = [{ message, stack }];
    includesStack = true;
  } else {
    // If there is only one argument to the log function, and that argument
    // is an error, then we print its stack. If there is more than one
    // arg, then we don't include the stack because it's not easy to display this
    // nicely using our current UI.
    if (
      args.length === 1 &&
      args[0] instanceof Error &&
      _stackTraceLogsSupported()
    ) {
      includesStack = true;
    }

    stringifiedArgs = await _stringifyLogArgsAsync(args);
  }

  return {
    body: stringifiedArgs,
    includesStack,
  };
}

async function _stringifyLogArgsAsync(args) {
  return await Promise.all(
    args.map(async arg => {
      if (typeof arg === 'string') {
        return arg;
      } else if (
        arg instanceof Error &&
        args.length === 1 &&
        _stackTraceLogsSupported()
      ) {
        return await _symbolicateAndFormatErrorAsync(arg);
      } else {
        return prettyFormat(arg);
      }
    })
  );
}

/* Error logging helpers */

// If exp/xde versions are out of date and don't include projectRoot yet, they
// also don't support the stack trace logging format: log with `includesStack:bool`
//  `msg:[{message: string, stack:string}]`.
function _stackTraceLogsSupported() {
  return !!(
    Constants.manifest.developer &&
    Constants.manifest.developer.projectRoot &&
    __DEV__
  );
}

function _isUnhandledPromiseRejection(msg) {
  return !!(
    msg &&
    msg.match &&
    msg.match(/^Possible Unhandled Promise Rejection/)
  );
}

async function _symbolicateAndFormatUnhandledPromiseRejectionAsync(message) {
  let stack = await _symbolicateError(message);

  if (!stack || !stack.length) {
    return message;
  }

  let formattedStack = _formatStack(stack);
  let lines = message.split('\n');

  return {
    message: `[Unhandled Promise rejection: ${lines[1]}]`,
    stack: formattedStack,
  };
}

async function _symbolicateAndFormatErrorAsync(error, message) {
  if (!message) {
    message = error.message;
  }

  if (!error.stack || !error.stack.length) {
    return prettyFormat(error);
  }

  let stack = await _symbolicateError(error.stack);
  let formattedStack = _formatStack(stack);

  return {
    message,
    stack: formattedStack,
  };
}

async function _symbolicateError(stack) {
  const parseErrorStack = require('react-native/Libraries/Core/Devtools/parseErrorStack');
  const parsedStack = parseErrorStack({ stack });
  const symbolicateStackTrace = require('react-native/Libraries/Core/Devtools/symbolicateStackTrace');
  try {
    let symbolicatedStack = await symbolicateStackTrace(parsedStack);
    let prettyStack = _cleanStack(symbolicatedStack);
    return prettyStack || [];
  } catch (e) {
    return [];
  }
}

function _cleanStack(stack) {
  return stack
    .filter(
      (frame, i) =>
        frame.file !== null &&
        !(frame.file.includes('expo/src/Logs') && i === 0)
    )
    .map(_removeProjectRoot);
}

function _removeProjectRoot(frame) {
  if (
    Constants.manifest.developer &&
    Constants.manifest.developer.projectRoot &&
    frame.file &&
    frame.file.includes(Constants.manifest.developer.projectRoot)
  ) {
    frame.file = frame.file.replace(
      Constants.manifest.developer.projectRoot,
      ''
    );
    if (frame.file[0] === '/' || frame.file[0] === '\\') {
      frame.file = frame.file.slice(1, frame.file.length);
    }
    return frame;
  } else {
    return frame;
  }
}

function _formatStack(stack) {
  return stack
    .map(
      frame =>
        `${frame.file}:${frame.lineNumber}:${frame.column} in ${frame.methodName}`
    )
    .join('\n');
}

// Enable by default
if (Constants.manifest && Constants.manifest.logUrl) {
  // Checks if the app is running in Chrome. If it is, we do not enable XDE and display a message on the XDE.
  if (!navigator.userAgent) {
    enableXDELogging();
  } else {
    queueRemoteLogAsync('info', {}, [
      'You are now debugging remotely, check your browser console for your application logs.',
    ]);
  }
}
