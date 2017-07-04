module.exports = [
  {
    ExponentScope: [],
  },
  {
    ExponentAccelerometer: [
      {
        setUpdateInterval: 'function',
      },
      {
        addListener: 'function',
      },
      {
        removeListeners: 'function',
      },
    ],
  },
  {
    ExponentAmplitude: [
      {
        initialize: 'function',
      },
      {
        setUserId: 'function',
      },
      {
        setUserProperties: 'function',
      },
      {
        clearUserProperties: 'function',
      },
      {
        logEvent: 'function',
      },
      {
        logEventWithProperties: 'function',
      },
      {
        setGroup: 'function',
      },
    ],
  },
  {
    ExponentAppLoadingManager: [
      {
        finishedAsync: 'function',
      },
    ],
  },
  {
    ExponentAV: [
      {
        setAudioIsEnabled: 'function',
      },
      {
        setAudioMode: 'function',
      },
      {
        loadForSound: 'function',
      },
      {
        unloadForSound: 'function',
      },
      {
        setStatusForSound: 'function',
      },
      {
        getStatusForSound: 'function',
      },
      {
        setStatusUpdateCallbackForSound: 'function',
      },
      {
        setErrorCallbackForSound: 'function',
      },
      {
        loadForVideo: 'function',
      },
      {
        unloadForVideo: 'function',
      },
      {
        setStatusForVideo: 'function',
      },
      {
        getStatusForVideo: 'function',
      },
      {
        prepareAudioRecorder: 'function',
      },
      {
        startAudioRecording: 'function',
      },
      {
        pauseAudioRecording: 'function',
      },
      {
        stopAudioRecording: 'function',
      },
      {
        getAudioRecordingStatus: 'function',
      },
      {
        unloadAudioRecorder: 'function',
      },
    ],
  },
  {
    ExponentBarCodeScannerManager: [
      {
        BarCodeType: 'object',
      },
      {
        Type: 'object',
      },
      {
        TorchMode: 'object',
      },
    ],
  },
  {
    ExponentBlurViewManager: [],
  },
  {
    ExponentContacts: [
      {
        getContactsAsync: 'function',
      },
    ],
  },
  {
    ExponentDocumentPicker: [
      {
        getDocumentAsync: 'function',
      },
    ],
  },
  {
    ExponentErrorRecovery: [
      {
        setRecoveryProps: 'function',
      },
    ],
  },
  {
    ExponentFacebook: [
      {
        logInWithReadPermissionsAsync: 'function',
      },
    ],
  },
  {
    ExponentFileSystem: [
      {
        downloadAsync: 'function',
      },
      {
        getInfoAsync: 'function',
      },
      {
        deleteAsync: 'function',
      },
    ],
  },
  {
    ExponentFingerprint: [
      {
        hasHardwareAsync: 'function',
      },
      {
        isEnrolledAsync: 'function',
      },
      {
        authenticateAsync: 'function',
      },
    ],
  },
  {
    ExponentFontLoader: [
      {
        loadAsync: 'function',
      },
    ],
  },
  {
    ExponentGLObjectManager: [
      {
        createObjectAsync: 'function',
      },
      {
        destroyObjectAsync: 'function',
      },
    ],
  },
  {
    ExponentGLViewManager: [],
  },
  {
    ExponentGoogle: [
      {
        logInAsync: 'function',
      },
    ],
  },
  {
    ExponentGyroscope: [
      {
        setUpdateInterval: 'function',
      },
      {
        addListener: 'function',
      },
      {
        removeListeners: 'function',
      },
    ],
  },
  {
    ExponentImagePicker: [
      {
        launchCameraAsync: 'function',
      },
      {
        launchImageLibraryAsync: 'function',
      },
    ],
  },
  {
    ExponentKeepAwake: [
      {
        activate: 'function',
      },
      {
        deactivate: 'function',
      },
    ],
  },
  {
    ExponentLegacyAsyncLocalStorage: [
      {
        multiGet: 'function',
      },
      {
        getAllKeys: 'function',
      },
      {
        isMigrationDone: 'function',
      },
      {
        setMigrationDone: 'function',
      },
    ],
  },
  {
    ExponentLinearGradientManager: [],
  },
  {
    ExponentNotifications: [
      {
        getDevicePushTokenAsync: 'function',
      },
      {
        getExponentPushTokenAsync: 'function',
      },
      {
        presentLocalNotification: 'function',
      },
      {
        scheduleLocalNotification: 'function',
      },
      {
        cancelScheduledNotification: 'function',
      },
      {
        cancelAllScheduledNotifications: 'function',
      },
      {
        getBadgeNumberAsync: 'function',
      },
      {
        setBadgeNumberAsync: 'function',
      },
    ],
  },
  {
    ExponentPedometer: [
      {
        getStepCountAsync: 'function',
      },
      {
        watchStepCount: 'function',
      },
      {
        stopWatchingStepCount: 'function',
      },
      {
        isAvailableAsync: 'function',
      },
      {
        addListener: 'function',
      },
      {
        removeListeners: 'function',
      },
    ],
  },
  {
    ExponentScreenOrientation: [
      {
        allow: 'function',
      },
    ],
  },
  {
    ExponentSegment: [
      {
        initializeIOS: 'function',
      },
      {
        initializeAndroid: 'function',
      },
      {
        identify: 'function',
      },
      {
        identifyWithTraits: 'function',
      },
      {
        track: 'function',
      },
      {
        trackWithProperties: 'function',
      },
      {
        reset: 'function',
      },
      {
        flush: 'function',
      },
    ],
  },
  {
    ExponentSQLite: [
      {
        exec: 'function',
      },
    ],
  },
  {
    ExponentUtil: [
      {
        reload: 'function',
      },
      {
        getCurrentLocaleAsync: 'function',
      },
      {
        getCurrentDeviceCountryAsync: 'function',
      },
      {
        getCurrentTimeZoneAsync: 'function',
      },
    ],
  },
  {
    ExponentVideoManager: [
      {
        setFullscreen: 'function',
      },
      {
        ScaleToFill: 'string',
      },
      {
        ScaleAspectFill: 'string',
      },
      {
        ScaleAspectFit: 'string',
      },
      {
        ScaleNone: 'string',
      },
    ],
  },
  {
    ExponentWebBrowser: [
      {
        dismissBrowser: 'function',
      },
      {
        openBrowserAsync: 'function',
      },
    ],
  },
  {
    ExponentConstants: [
      {
        getWebViewUserAgentAsync: 'function',
      },
      {
        isDevice: 'boolean',
      },
      {
        linkingUri: 'string',
      },
      {
        deviceId: 'string',
      },
      {
        expoVersion: 'string',
      },
      {
        manifest: 'object',
      },
      {
        deviceName: 'string',
      },
      {
        platform: 'object',
      },
      {
        statusBarHeight: 'number',
      },
      {
        sessionId: 'string',
      },
      {
        systemFonts: 'object',
      },
      {
        deviceYearClass: 'number',
      },
      {
        appOwnership: 'string',
      },
    ],
  },
  {
    ExponentPermissions: [
      {
        getAsync: 'function',
      },
      {
        askAsync: 'function',
      },
    ],
  },
  {
    ExponentLocation: [
      {
        getProviderStatusAsync: 'function',
      },
      {
        getCurrentPositionAsync: 'function',
      },
      {
        watchPositionImplAsync: 'function',
      },
      {
        watchDeviceHeading: 'function',
      },
      {
        removeWatchAsync: 'function',
      },
      {
        addListener: 'function',
      },
      {
        removeListeners: 'function',
      },
    ],
  },
];
