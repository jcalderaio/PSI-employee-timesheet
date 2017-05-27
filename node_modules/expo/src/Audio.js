// @flow

import { NativeModules } from 'react-native';
import Asset from './Asset';

type SoundStatus =
  | {
      isLoaded: false,
    }
  | {
      isLoaded: true,
      isPlaying: boolean,
      durationMillis: number,
      positionMillis: number,
      rate: number,
      shouldCorrectPitch: boolean,
      volume: number,
      isMuted: boolean,
      isLooping: boolean,
      didJustFinish: boolean,
    };

type RecordingStatus =
  | {
      canRecord: false,
      isDoneRecording: false,
    }
  | {
      canRecord: true,
      isRecording: boolean,
      durationMillis: number,
    }
  | {
      canRecord: false,
      isDoneRecording: true,
      durationMillis: number,
    };

type AudioMode = {
  allowsRecordingIOS: boolean,
  interruptionModeIOS: number,
  playsInSilentLockedModeIOS: boolean,
  interruptionModeAndroid: boolean,
  shouldDuckAndroid: boolean,
};

export const INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS = 0;
export const INTERRUPTION_MODE_IOS_DO_NOT_MIX = 1;
export const INTERRUPTION_MODE_IOS_DUCK_OTHERS = 2;

export const INTERRUPTION_MODE_ANDROID_DO_NOT_MIX = 1;
export const INTERRUPTION_MODE_ANDROID_DUCK_OTHERS = 2;

let _enabled: boolean = false;
let _recorderExists: boolean = false;
const _DISABLED_ERROR: Error = new Error(
  'Cannot complete operation because audio is not enabled.'
);
const _DEFAULT_POLLING_TIMEOUT_MILLIS: number = 500;

export async function setIsEnabledAsync(value: boolean): Promise<void> {
  _enabled = value;
  await NativeModules.ExponentAudio.setIsEnabled(value);
}

export async function setAudioModeAsync(mode: AudioMode): Promise<void> {
  if (
    !('allowsRecordingIOS' in mode) ||
    !('interruptionModeIOS' in mode) ||
    !('playsInSilentLockedModeIOS' in mode) ||
    !('interruptionModeAndroid' in mode) ||
    !('shouldDuckAndroid' in mode)
  ) {
    throw new Error(
      'Audio mode must contain keys "allowsRecordingIOS", "interruptionModeIOS", "playsInSilentLockedModeIOS", "interruptionModeAndroid", and "shouldDuckAndroid".'
    );
  }
  if (
    mode.interruptionModeIOS !== INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS &&
    mode.interruptionModeIOS !== INTERRUPTION_MODE_IOS_DO_NOT_MIX &&
    mode.interruptionModeIOS !== INTERRUPTION_MODE_IOS_DUCK_OTHERS
  ) {
    throw new Error(
      `"interruptionModeIOS" must an integer between ${INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS} and ${INTERRUPTION_MODE_IOS_DUCK_OTHERS}.`
    );
  }
  if (
    mode.interruptionModeAndroid !== INTERRUPTION_MODE_ANDROID_DO_NOT_MIX &&
    mode.interruptionModeAndroid !== INTERRUPTION_MODE_ANDROID_DUCK_OTHERS
  ) {
    throw new Error(
      `"interruptionModeAndroid" must an integer between ${INTERRUPTION_MODE_ANDROID_DO_NOT_MIX} and ${INTERRUPTION_MODE_ANDROID_DUCK_OTHERS}.`
    );
  }
  if (
    typeof mode.allowsRecordingIOS !== 'boolean' ||
    typeof mode.playsInSilentLockedModeIOS !== 'boolean' ||
    typeof mode.shouldDuckAndroid !== 'boolean'
  ) {
    throw new Error(
      '"allowsRecordingIOS", "playsInSilentLockedModeIOS", and "shouldDuckAndroid" must be booleans.'
    );
  }
  await NativeModules.ExponentAudio.setAudioMode(mode);
}

class StatusHandler<T: Object> {
  areOperationsAllowed: () => boolean;
  getExtraStatusFieldsWhenOperationsAreAllowed: () => Object;
  operationsDisallowedError: Error;
  getStatusAsync: () => Promise<T>;
  shouldPollAfterStatus: (status: T) => boolean;

  pollingTimeoutMillis: number;
  callback: ?(status: T) => void;

  _shouldPoll: boolean;
  _pollingTimeoutVariable: ?number;

  constructor({
    areOperationsAllowed,
    getExtraStatusFieldsWhenOperationsAreAllowed,
    operationsDisallowedError,
    getStatusAsync,
    shouldPollAfterStatus,
  }: {
    areOperationsAllowed: () => boolean,
    getExtraStatusFieldsWhenOperationsAreAllowed: () => Object,
    operationsDisallowedError: Error,
    getStatusAsync: () => Promise<T>,
    shouldPollAfterStatus: (status: T) => boolean,
  }) {
    this.areOperationsAllowed = areOperationsAllowed;
    this.getExtraStatusFieldsWhenOperationsAreAllowed = getExtraStatusFieldsWhenOperationsAreAllowed;
    this.operationsDisallowedError = operationsDisallowedError;
    this.getStatusAsync = getStatusAsync;
    this.shouldPollAfterStatus = shouldPollAfterStatus;

    this.pollingTimeoutMillis = _DEFAULT_POLLING_TIMEOUT_MILLIS;
    this.callback = null;

    this._shouldPoll = false;
    this._pollingTimeoutVariable = null;
  }

  _pollingLoop = () => {
    if (
      !_enabled ||
      !this.areOperationsAllowed() ||
      this.callback == null ||
      !this._shouldPoll
    ) {
      return;
    }
    this.getStatusAsync(); // Automatically calls this.callback.
    this._pollingTimeoutVariable = setTimeout(
      this._pollingLoop,
      this.pollingTimeoutMillis
    );
  };

  _enablePollingIfNecessaryAndPossible() {
    if (
      _enabled &&
      this.callback != null &&
      this.areOperationsAllowed() &&
      this._shouldPoll
    ) {
      this._disablePolling();
      this._pollingLoop();
    }
  }

  _disablePolling() {
    if (this._pollingTimeoutVariable != null) {
      clearTimeout(this._pollingTimeoutVariable);
      this._pollingTimeoutVariable = null;
    }
  }

  _applyMissingFieldsToStatus(status: T): T {
    if (this.areOperationsAllowed()) {
      // Apply the fields returned by this.getExtraStatusFieldsWhenOperationsAreAllowed()
      // only when necessary.
      const extraStatusFields: Object = this.getExtraStatusFieldsWhenOperationsAreAllowed();
      for (let property in extraStatusFields) {
        if (
          extraStatusFields.hasOwnProperty(property) &&
          status.hasOwnProperty(property)
        ) {
          delete extraStatusFields[property];
        }
      }
      Object.assign(status, extraStatusFields);
    }
    return status;
  }

  // status is of type T, but possibly without the fields returned by
  // this.getExtraStatusFieldsWhenOperationsAreAllowed(). It returns the status including all fields.
  getFullStatusAndHandle(status: T): T {
    const statusWithAllFields: T = this._applyMissingFieldsToStatus(status);
    if (this.callback != null) {
      this.callback(statusWithAllFields);
    }
    const shouldPoll: boolean = this.shouldPollAfterStatus(statusWithAllFields);
    if (shouldPoll !== this._shouldPoll) {
      this._shouldPoll = shouldPoll;
      if (shouldPoll) {
        this._enablePollingIfNecessaryAndPossible();
      } else {
        this._disablePolling();
      }
    }
    return statusWithAllFields;
  }

  // operation is of type () => Promise<{ status: T }>, but status lacks the fields returned by
  // this.getExtraStatusFieldsWhenOperationsAreAllowed().
  async performOperationAndHandleStatusAsync(
    operation: () => Promise<{ status: T }>
  ): Promise<T> {
    if (!_enabled) {
      throw _DISABLED_ERROR;
    }
    if (this.areOperationsAllowed()) {
      const { status } = await operation();
      return this.getFullStatusAndHandle(status);
    } else {
      throw this.operationsDisallowedError;
    }
  }

  setCallback(callback: ?(status: T) => void) {
    this.callback = callback;
    if (callback == null) {
      this._disablePolling();
    } else {
      this._enablePollingIfNecessaryAndPossible();
    }
  }

  setPollingTimeoutMillis(value: number) {
    this.pollingTimeoutMillis = value;
  }
}

export class Sound {
  _uri: string;
  _loaded: boolean;
  _key: number;
  _durationMillis: number;
  _statusHandler: StatusHandler<SoundStatus>;

  constructor({ source }: { source: number | string | Asset }) {
    if (typeof source === 'number') {
      // source is an asset module
      let asset = Asset.fromModule(source);
      this._uri = asset.localUri || asset.uri;
    } else if (typeof source === 'string') {
      // source is a remote URI
      this._uri = source;
    } else {
      // source is an Asset
      this._uri = source.localUri || source.uri;
    }

    this._loaded = false;
    this._key = -1;
    this._durationMillis = 0;

    this._statusHandler = new StatusHandler({
      areOperationsAllowed: (): boolean => {
        return this._loaded;
      },
      getExtraStatusFieldsWhenOperationsAreAllowed: (): Object => {
        return {
          isLoaded: true,
          didJustFinish: false,
          durationMillis: this._durationMillis,
        };
      },
      operationsDisallowedError: new Error(
        'Cannot complete operation because sound is not loaded.'
      ),
      getStatusAsync: this.getStatusAsync,
      shouldPollAfterStatus: (status: SoundStatus): boolean => {
        // TODO: ensure that we always receive isPlaying flags appropriately.
        // return status.isLoaded && status.isPlaying;
        return status.isLoaded;
      },
    });
  }

  // Internal methods

  _playbackFinishedCallback = (status: Object) => {
    status.didJustFinish = true;
    this._statusHandler.getFullStatusAndHandle(status);
    this._setPlaybackFinishedCallback(); // Callbacks are only called once and then released.
  };

  _setPlaybackFinishedCallback() {
    if (this._loaded) {
      NativeModules.ExponentAudio.setPlaybackFinishedCallback(
        this._key,
        this._playbackFinishedCallback
      );
    }
  }

  // Status API

  getStatusAsync = async (): Promise<SoundStatus> => {
    // Automatically calls the callback.
    if (this._loaded) {
      return this._statusHandler.performOperationAndHandleStatusAsync(() =>
        NativeModules.ExponentAudio.getStatus(this._key)
      );
    }
    const status: SoundStatus = {
      isLoaded: false,
    };
    return this._statusHandler.getFullStatusAndHandle(status);
  };

  setCallback(callback: ?(status: SoundStatus) => void) {
    this._statusHandler.setCallback(callback);
  }

  setCallbackPollingMillis(value: number) {
    this._statusHandler.setPollingTimeoutMillis(value);
  }

  // Loading / unloading API

  async loadAsync(): Promise<SoundStatus> {
    if (!_enabled) {
      throw _DISABLED_ERROR;
    }
    if (!this._loaded) {
      const {
        key,
        durationMillis,
        status, // status is of type SoundStatus, but without the isLoaded field populated.
      }: {
        key: number,
        durationMillis: number,
        status: Object,
      } = await NativeModules.ExponentAudio.load(this._uri);
      this._key = key;
      this._durationMillis = durationMillis;
      this._loaded = true;
      this._setPlaybackFinishedCallback();
      return this._statusHandler.getFullStatusAndHandle(status);
    } else {
      throw new Error('The Sound is already loaded.');
    }
  }

  async unloadAsync(): Promise<SoundStatus> {
    if (this._loaded) {
      this._loaded = false;
      this._durationMillis = 0;
      await NativeModules.ExponentAudio.unload(this._key);
      this._key = -1;
    }
    return this.getStatusAsync(); // Automatically calls the callback for the unloaded state.
  }

  // Playback API

  async playAsync(): Promise<SoundStatus> {
    return this._statusHandler.performOperationAndHandleStatusAsync(() =>
      NativeModules.ExponentAudio.play(this._key)
    );
  }

  async pauseAsync(): Promise<SoundStatus> {
    return this._statusHandler.performOperationAndHandleStatusAsync(() =>
      NativeModules.ExponentAudio.pause(this._key)
    );
  }

  async stopAsync(): Promise<SoundStatus> {
    return this._statusHandler.performOperationAndHandleStatusAsync(() =>
      NativeModules.ExponentAudio.stop(this._key)
    );
  }

  async setPositionAsync(millis: number): Promise<SoundStatus> {
    return this._statusHandler.performOperationAndHandleStatusAsync(() =>
      NativeModules.ExponentAudio.setPosition(this._key, millis)
    );
  }

  async setRateAsync(
    value: number,
    shouldCorrectPitch: boolean
  ): Promise<SoundStatus> {
    if (value < 0.0 || value > 32.0) {
      throw new Error('Rate value must be between 0.0 and 32.0.');
    }
    return this._statusHandler.performOperationAndHandleStatusAsync(() =>
      NativeModules.ExponentAudio.setRate(this._key, value, shouldCorrectPitch)
    );
  }

  async setVolumeAsync(value: number): Promise<SoundStatus> {
    if (value < 0.0 || value > 1.0) {
      throw new Error('Volume value must be between 0.0 and 1.0.');
    }
    return this._statusHandler.performOperationAndHandleStatusAsync(() =>
      NativeModules.ExponentAudio.setVolume(this._key, value)
    );
  }

  async setIsMutedAsync(value: boolean): Promise<SoundStatus> {
    return this._statusHandler.performOperationAndHandleStatusAsync(() =>
      NativeModules.ExponentAudio.setIsMuted(this._key, value)
    );
  }

  async setIsLoopingAsync(value: boolean): Promise<SoundStatus> {
    return this._statusHandler.performOperationAndHandleStatusAsync(() =>
      NativeModules.ExponentAudio.setIsLooping(this._key, value)
    );
  }
}

export class Recording {
  _canRecord: boolean;
  _isDoneRecording: boolean;
  _finalDurationMillis: number;
  _uri: ?string;
  _statusHandler: StatusHandler<RecordingStatus>;

  constructor() {
    this._canRecord = false;
    this._isDoneRecording = false;
    this._finalDurationMillis = 0;
    this._uri = null;
    this._statusHandler = new StatusHandler({
      areOperationsAllowed: (): boolean => {
        return this._canRecord;
      },
      getExtraStatusFieldsWhenOperationsAreAllowed: (): Object => {
        return {
          canRecord: true,
        };
      },
      operationsDisallowedError: new Error(
        'Cannot complete operation because this recorder is not ready to record.'
      ),
      getStatusAsync: this.getStatusAsync,
      shouldPollAfterStatus: (status: RecordingStatus): boolean => {
        // TODO: ensure that we always return isRecording appropriately.
        // return status.canRecord && status.isRecording;
        return status.canRecord;
      },
    });
  }

  // Status API

  getStatusAsync = async (): Promise<RecordingStatus> => {
    // Automatically calls the callback.
    if (this._canRecord) {
      return this._statusHandler.performOperationAndHandleStatusAsync(() =>
        NativeModules.ExponentAudio.getRecordingStatus()
      );
    }
    const status: RecordingStatus = this._isDoneRecording
      ? {
          canRecord: false,
          isDoneRecording: true,
          durationMillis: this._finalDurationMillis,
        }
      : {
          canRecord: false,
          isDoneRecording: false,
        };
    return this._statusHandler.getFullStatusAndHandle(status);
  };

  setCallback(callback: ?(status: RecordingStatus) => void) {
    this._statusHandler.setCallback(callback);
  }

  setCallbackPollingMillis(value: number) {
    this._statusHandler.setPollingTimeoutMillis(value);
  }

  // Record API

  async prepareToRecordAsync(): Promise<RecordingStatus> {
    if (!_enabled) {
      throw _DISABLED_ERROR;
    }

    if (_recorderExists) {
      throw new Error(
        'Only one Recording object can be prepared at a given time.'
      );
    }

    if (this._isDoneRecording) {
      throw new Error(
        'This Recording object is done recording; you must make a new one.'
      );
    }

    if (!this._canRecord) {
      const {
        uri,
        status, // status is of type RecordingStatus, but without the canRecord field populated.
      }: {
        uri: string,
        status: Object,
      } = await NativeModules.ExponentAudio.prepareToRecord();
      _recorderExists = true;
      this._uri = uri;
      this._canRecord = true;
      return this._statusHandler.getFullStatusAndHandle(status);
    } else {
      throw new Error('This Recording object is already prepared to record.');
    }
  }

  async startAsync(): Promise<RecordingStatus> {
    return this._statusHandler.performOperationAndHandleStatusAsync(() =>
      NativeModules.ExponentAudio.startRecording()
    );
  }

  async pauseAsync(): Promise<RecordingStatus> {
    return this._statusHandler.performOperationAndHandleStatusAsync(() =>
      NativeModules.ExponentAudio.pauseRecording()
    );
  }

  async stopAndUnloadAsync(): Promise<RecordingStatus> {
    if (!this._canRecord) {
      throw new Error('Cannot unload a Recording that has not been prepared.');
    }
    // We perform a separate native API call so that the state of the Recording can be updated with
    // the final duration of the recording. (We cast stopStatus as Object to appease Flow)
    const stopStatus: Object = await NativeModules.ExponentAudio.stopRecording();
    this._finalDurationMillis = stopStatus.durationMillis;

    await NativeModules.ExponentAudio.unloadRecorder();
    this._canRecord = false;
    this._isDoneRecording = true;
    _recorderExists = false;
    return this.getStatusAsync(); // Automatically calls the callback for the final state.
  }

  // Read API

  getURI(): ?string {
    return this._uri;
  }

  getNewSound(): ?Sound {
    return this._uri === null || !this._isDoneRecording
      ? null
      : new Sound({ source: this._uri });
  }
}
