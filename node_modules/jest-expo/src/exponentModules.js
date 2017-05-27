module.exports = [
  {
    ExponentAccelerometer: [
      { setUpdateInterval: 'function' },
      { addListener: 'function' },
      { removeListeners: 'function' },
    ],
  },
  {
    ExponentAmplitude: [
      { initialize: 'function' },
      { setUserId: 'function' },
      { setUserProperties: 'function' },
      { clearUserProperties: 'function' },
      { logEvent: 'function' },
      { logEventWithProperties: 'function' },
      { setGroup: 'function' },
    ],
  },
  { ExponentAppLoadingManager: [{ finishedAsync: 'function' }] },
  {
    ExponentAudio: [
      { setIsEnabled: 'function' },
      { setAudioMode: 'function' },
      { load: 'function' },
      { play: 'function' },
      { pause: 'function' },
      { stop: 'function' },
      { unload: 'function' },
      { setPosition: 'function' },
      { setRate: 'function' },
      { setVolume: 'function' },
      { setIsMuted: 'function' },
      { setIsLooping: 'function' },
      { getStatus: 'function' },
      { setPlaybackFinishedCallback: 'function' },
      { prepareToRecord: 'function' },
      { startRecording: 'function' },
      { pauseRecording: 'function' },
      { stopRecording: 'function' },
      { getRecordingStatus: 'function' },
      { unloadRecorder: 'function' },
    ],
  },
  {
    ExponentBarCodeScannerManager: [
      { BarCodeType: 'object' },
      { Type: 'object' },
      { TorchMode: 'object' },
    ],
  },
  { ExponentBlurViewManager: [] },
  {
    ExponentConstants: [
      { isDevice: 'boolean' },
      { linkingUri: 'string' },
      { deviceId: 'string' },
      { expoVersion: 'string' },
      { manifest: 'object' },
      { deviceName: 'string' },
      { platform: 'object' },
      { statusBarHeight: 'number' },
      { sessionId: 'string' },
      { systemFonts: 'object' },
      { deviceYearClass: 'number' },
      { appOwnership: 'string' },
    ],
  },
  { ExponentContacts: [{ getContactsAsync: 'function' }] },
  { ExponentDocumentPicker: [{ getDocumentAsync: 'function' }] },
  { ExponentErrorRecovery: [{ setRecoveryProps: 'function' }] },
  { ExponentFacebook: [{ logInWithReadPermissionsAsync: 'function' }] },
  {
    ExponentFileSystem: [
      { downloadAsync: 'function' },
      { getInfoAsync: 'function' },
      { deleteAsync: 'function' },
    ],
  },
  {
    ExponentFingerprint: [
      { hasHardwareAsync: 'function' },
      { isEnrolledAsync: 'function' },
      { authenticateAsync: 'function' },
    ],
  },
  { ExponentFontLoader: [{ loadAsync: 'function' }] },
  { ExponentGLViewManager: [] },
  { ExponentGoogle: [{ logInAsync: 'function' }] },
  {
    ExponentGyroscope: [
      { setUpdateInterval: 'function' },
      { addListener: 'function' },
      { removeListeners: 'function' },
    ],
  },
  {
    ExponentImagePicker: [
      { launchCameraAsync: 'function' },
      { launchImageLibraryAsync: 'function' },
    ],
  },
  { ExponentKeepAwake: [{ activate: 'function' }, { deactivate: 'function' }] },
  {
    ExponentLegacyAsyncLocalStorage: [
      { multiGet: 'function' },
      { getAllKeys: 'function' },
      { isMigrationDone: 'function' },
      { setMigrationDone: 'function' },
    ],
  },
  { ExponentLinearGradientManager: [] },
  {
    ExponentLocation: [
      { getCurrentPositionAsync: 'function' },
      { watchPositionImplAsync: 'function' },
      { removeWatchAsync: 'function' },
      { addListener: 'function' },
      { removeListeners: 'function' },
    ],
  },
  {
    ExponentNotifications: [
      { presentLocalNotification: 'function' },
      { getExponentPushTokenAsync: 'function' },
      { scheduleLocalNotification: 'function' },
      { cancelScheduledNotification: 'function' },
      { cancelAllScheduledNotifications: 'function' },
      { getBadgeNumberAsync: 'function' },
      { setBadgeNumberAsync: 'function' },
    ],
  },
  { ExponentPermissions: [{ getAsync: 'function' }, { askAsync: 'function' }] },
  { ExponentSQLite: [{ exec: 'function' }] },
  { ExponentScope: [] },
  {
    ExponentSegment: [
      { initializeIOS: 'function' },
      { initializeAndroid: 'function' },
      { identify: 'function' },
      { identifyWithTraits: 'function' },
      { track: 'function' },
      { trackWithProperties: 'function' },
      { flush: 'function' },
    ],
  },
  {
    ExponentUtil: [
      { reload: 'function' },
      { getCurrentLocaleAsync: 'function' },
    ],
  },
  {
    ExponentVideoManager: [
      { ScaleToFill: 'string' },
      { ScaleAspectFill: 'string' },
      { ScaleAspectFit: 'string' },
      { ScaleNone: 'string' },
    ],
  },
  {
    ExponentWebBrowser: [
      { dismissBrowser: 'function' },
      { openBrowserAsync: 'function' },
    ],
  },
];
