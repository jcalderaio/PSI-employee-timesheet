// @flow

import { NativeModules } from 'react-native';
import Asset from './Asset';

import type { PlaybackSource, PlaybackStatus, PlaybackStatusToSet } from './AV';
import {
  _DEFAULT_PROGRESS_UPDATE_INTERVAL_MILLIS,
  _DEFAULT_INITIAL_PLAYBACK_STATUS,
  _COMMON_AV_PLAYBACK_METHODS,
  _getURIAndFullInitialStatusForLoadAsync,
  _throwErrorIfValuesOutOfBoundsInStatus,
  _getUnloadedStatus,
} from './AV';

// TODO For consistency with PlaybackStatus, should we include progressUpdateIntervalMillis here as well?
export type RecordingStatus =
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

export type AudioMode = {
  allowsRecordingIOS: boolean,
  interruptionModeIOS: number,
  playsInSilentModeIOS: boolean,
  interruptionModeAndroid: boolean,
  shouldDuckAndroid: boolean,
};

export const INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS = 0;
export const INTERRUPTION_MODE_IOS_DO_NOT_MIX = 1;
export const INTERRUPTION_MODE_IOS_DUCK_OTHERS = 2;

export const INTERRUPTION_MODE_ANDROID_DO_NOT_MIX = 1;
export const INTERRUPTION_MODE_ANDROID_DUCK_OTHERS = 2;

let _enabled: boolean = true; // @terribleben Note that @nikki93 and I think true should be the default here.
let _recorderExists: boolean = false;
const _DISABLED_ERROR: Error = new Error(
  'Cannot complete operation because audio is not enabled.'
);

export async function setIsEnabledAsync(value: boolean): Promise<void> {
  _enabled = value;
  await NativeModules.ExponentAV.setAudioIsEnabled(value);
  // TODO : We immediately pause all players when disabled, but we do not resume all shouldPlay
  // players when enabled. Perhaps for completeness we should allow this; the design of the
  // enabling API is for people to enable / disable this audio library, but I think that it should
  // intuitively also double as a global pause/resume.
}

export async function setAudioModeAsync(mode: AudioMode): Promise<void> {
  if (
    !('allowsRecordingIOS' in mode) ||
    !('interruptionModeIOS' in mode) ||
    !('playsInSilentModeIOS' in mode) ||
    !('interruptionModeAndroid' in mode) ||
    !('shouldDuckAndroid' in mode)
  ) {
    throw new Error(
      'Audio mode must contain keys "allowsRecordingIOS", "interruptionModeIOS", "playsInSilentModeIOS", "interruptionModeAndroid", and "shouldDuckAndroid".'
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
    typeof mode.playsInSilentModeIOS !== 'boolean' ||
    typeof mode.shouldDuckAndroid !== 'boolean'
  ) {
    throw new Error(
      '"allowsRecordingIOS", "playsInSilentModeIOS", and "shouldDuckAndroid" must be booleans.'
    );
  }
  await NativeModules.ExponentAV.setAudioMode(mode);
}

export class Sound {
  _loaded: boolean;
  _loading: boolean;
  _key: number;
  _callback: ?(status: PlaybackStatus) => void;

  constructor() {
    this._loaded = false;
    this._loading = false;
    this._key = -1;
    this._callback = null;
  }

  static create = async (
    source: PlaybackSource,
    initialStatus: PlaybackStatusToSet = {},
    callback: ?(status: PlaybackStatus) => void = null,
    downloadFirst: boolean = true
  ): Promise<{ sound: Sound, status: PlaybackStatus }> => {
    const sound: Sound = new Sound();
    sound.setCallback(callback);
    const status: PlaybackStatus = await sound.loadAsync(
      source,
      initialStatus,
      downloadFirst
    );
    return { sound, status };
  };

  // Internal methods

  _callCallbackForNewStatus(status: PlaybackStatus) {
    if (this._callback != null) {
      this._callback(status);
    }
  }

  async _performOperationAndHandleStatusAsync(
    operation: () => Promise<PlaybackStatus>
  ): Promise<PlaybackStatus> {
    if (!_enabled) {
      throw _DISABLED_ERROR;
    }
    if (this._loaded) {
      const status = await operation();
      this._callCallbackForNewStatus(status);
      return status;
    } else {
      throw new Error('Cannot complete operation because sound is not loaded.');
    }
  }

  _statusUpdateCallback = (status: PlaybackStatus) => {
    this._callCallbackForNewStatus(status);
    this._setStatusUpdateCallback(); // Callbacks are only called once and then released.
  };

  // TODO: We can optimize by only using time observer on native if (this._callback).
  _setStatusUpdateCallback() {
    if (this._loaded) {
      NativeModules.ExponentAV.setStatusUpdateCallbackForSound(
        this._key,
        this._statusUpdateCallback
      );
    }
  }

  _errorCallback = (error: string) => {
    this._loaded = false;
    this._key = -1;
    this._callCallbackForNewStatus(_getUnloadedStatus(error));
  };

  // ### Unified playback API ### (consistent with Video.js)
  // All calls automatically call the callback as a side effect.

  // Get status API

  getStatusAsync = async (): Promise<PlaybackStatus> => {
    if (this._loaded) {
      return this._performOperationAndHandleStatusAsync(() =>
        NativeModules.ExponentAV.getStatusForSound(this._key)
      );
    }
    const status: PlaybackStatus = _getUnloadedStatus();
    this._callCallbackForNewStatus(status);
    return status;
  };

  setCallback(callback: ?(status: PlaybackStatus) => void) {
    this._callback = callback;
    this.getStatusAsync();
  }

  // Loading / unloading API

  async loadAsync(
    source: PlaybackSource,
    initialStatus: PlaybackStatusToSet = {},
    downloadFirst: boolean = true
  ): Promise<PlaybackStatus> {
    if (!_enabled) {
      throw _DISABLED_ERROR;
    }
    if (this.loading) {
      throw new Error('The Sound is already loading.');
    }
    if (!this._loaded) {
      this._loading = true;

      const {
        uri,
        fullInitialStatus,
      } = await _getURIAndFullInitialStatusForLoadAsync(
        source,
        initialStatus,
        downloadFirst
      );

      // This is a workaround, since using load with resolve / reject seems to not work.
      return new Promise(
        function(resolve, reject) {
          const loadSuccess = (key: number, status: PlaybackStatus) => {
            this._key = key;
            this._loaded = true;
            this._loading = false;
            NativeModules.ExponentAV.setErrorCallbackForSound(
              this._key,
              this._errorCallback
            );
            this._setStatusUpdateCallback();
            this._callCallbackForNewStatus(status);
            resolve(status);
          };
          const loadError = (error: string) => {
            this._loading = false;
            reject(new Error(error));
          };
          NativeModules.ExponentAV.loadForSound(
            uri,
            fullInitialStatus,
            loadSuccess,
            loadError
          );
        }.bind(this)
      );
    } else {
      throw new Error('The Sound is already loaded.');
    }
  }

  async unloadAsync(): Promise<PlaybackStatus> {
    if (this._loaded) {
      this._loaded = false;
      const key = this._key;
      this._key = -1;
      const status = await NativeModules.ExponentAV.unloadForSound(key);
      this._callCallbackForNewStatus(status);
      return status;
    } else {
      return this.getStatusAsync(); // Automatically calls the callback.
    }
  }

  // Set status API (only available while isLoaded = true)

  async setStatusAsync(status: PlaybackStatusToSet): Promise<PlaybackStatus> {
    _throwErrorIfValuesOutOfBoundsInStatus(status);
    return this._performOperationAndHandleStatusAsync(() =>
      NativeModules.ExponentAV.setStatusForSound(this._key, status)
    );
  }

  // Additional convenience methods on top of setStatusAsync are set via _COMMON_AV_PLAYBACK_METHODS.
  playAsync: () => Promise<PlaybackStatus>;
  playFromPositionAsync: (positionMillis: number) => Promise<PlaybackStatus>;
  pauseAsync: () => Promise<PlaybackStatus>;
  stopAsync: () => Promise<PlaybackStatus>;
  setPositionAsync: (positionMillis: number) => Promise<PlaybackStatus>;
  setRateAsync: (
    rate: number,
    shouldCorrectPitch: boolean
  ) => Promise<PlaybackStatus>;
  setVolumeAsync: (volume: number) => Promise<PlaybackStatus>;
  setIsMutedAsync: (isMuted: boolean) => Promise<PlaybackStatus>;
  setIsLoopingAsync: (isLooping: boolean) => Promise<PlaybackStatus>;
  setProgressUpdateIntervalAsync: (
    progressUpdateIntervalMillis: number
  ) => Promise<PlaybackStatus>;
}

Object.assign(Sound.prototype, _COMMON_AV_PLAYBACK_METHODS);

export class Recording {
  _canRecord: boolean;
  _isDoneRecording: boolean;
  _finalDurationMillis: number;
  _uri: ?string;
  _callback: ?(status: RecordingStatus) => void;
  _progressUpdateTimeoutVariable: ?number;
  _progressUpdateIntervalMillis: number;

  constructor() {
    this._canRecord = false;
    this._isDoneRecording = false;
    this._finalDurationMillis = 0;
    this._uri = null;
    this._progressUpdateTimeoutVariable = null;
    this._progressUpdateIntervalMillis = _DEFAULT_PROGRESS_UPDATE_INTERVAL_MILLIS;
  }

  // Internal methods

  _pollingLoop = () => {
    if (_enabled && this._canRecord && this._callback != null) {
      this.getStatusAsync(); // Automatically calls this._callback.
      this._progressUpdateTimeoutVariable = setTimeout(
        this._pollingLoop,
        this._progressUpdateIntervalMillis
      );
    }
  };

  _disablePolling() {
    if (this._progressUpdateTimeoutVariable != null) {
      clearTimeout(this._progressUpdateTimeoutVariable);
      this._progressUpdateTimeoutVariable = null;
    }
  }

  _enablePollingIfNecessaryAndPossible() {
    if (_enabled && this._canRecord && this._callback != null) {
      this._disablePolling();
      this._pollingLoop();
    }
  }

  _callCallbackForNewStatus(status: RecordingStatus) {
    if (this._callback != null) {
      this._callback(status);
    }
  }

  async _performOperationAndHandleStatusAsync(
    operation: () => Promise<RecordingStatus>
  ): Promise<RecordingStatus> {
    if (!_enabled) {
      throw _DISABLED_ERROR;
    }
    if (this._canRecord) {
      const status = await operation();
      this._callCallbackForNewStatus(status);
      return status;
    } else {
      throw new Error(
        'Cannot complete operation because this recorder is not ready to record.'
      );
    }
  }

  // Note that all calls automatically call the callback as a side effect.

  // Get status API

  getStatusAsync = async (): Promise<RecordingStatus> => {
    // Automatically calls the callback.
    if (this._canRecord) {
      return this._performOperationAndHandleStatusAsync(() =>
        NativeModules.ExponentAV.getAudioRecordingStatus()
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
    this._callCallbackForNewStatus(status);
    return status;
  };

  setCallback(callback: ?(status: RecordingStatus) => void) {
    this._callback = callback;
    if (callback == null) {
      this._disablePolling();
    } else {
      this._enablePollingIfNecessaryAndPossible();
    }
    this.getStatusAsync();
  }

  setProgressUpdateInterval(progressUpdateIntervalMillis: number) {
    this._progressUpdateIntervalMillis = progressUpdateIntervalMillis;
    this.getStatusAsync();
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
        status,
      }: {
        uri: string,
        status: Object, // status is of type RecordingStatus, but without the canRecord field populated.
      } = await NativeModules.ExponentAV.prepareAudioRecorder();
      _recorderExists = true;
      this._uri = uri;
      this._canRecord = true;
      this._callCallbackForNewStatus(status);
      this._enablePollingIfNecessaryAndPossible();
      return status;
    } else {
      throw new Error('This Recording object is already prepared to record.');
    }
  }

  async startAsync(): Promise<RecordingStatus> {
    return this._performOperationAndHandleStatusAsync(() =>
      NativeModules.ExponentAV.startAudioRecording()
    );
  }

  async pauseAsync(): Promise<RecordingStatus> {
    return this._performOperationAndHandleStatusAsync(() =>
      NativeModules.ExponentAV.pauseAudioRecording()
    );
  }

  async stopAndUnloadAsync(): Promise<RecordingStatus> {
    if (!this._canRecord) {
      throw new Error('Cannot unload a Recording that has not been prepared.');
    }
    // We perform a separate native API call so that the state of the Recording can be updated with
    // the final duration of the recording. (We cast stopStatus as Object to appease Flow)
    const stopStatus: Object = await NativeModules.ExponentAV.stopAudioRecording();
    this._finalDurationMillis = stopStatus.durationMillis;
    this._disablePolling();

    await NativeModules.ExponentAV.unloadAudioRecorder();
    this._canRecord = false;
    this._isDoneRecording = true;
    _recorderExists = false;
    return this.getStatusAsync(); // Automatically calls the callback for the final state.
  }

  // Read API

  getURI(): ?string {
    return this._uri;
  }

  async createNewLoadedSound(
    initialStatus: PlaybackStatusToSet = {},
    callback: ?(status: PlaybackStatus) => void = null
  ): Promise<{ sound: Sound, status: PlaybackStatus }> {
    if (this._uri === null || !this._isDoneRecording) {
      throw new Error(
        'Cannot create sound when the Recording has not finished!'
      );
    }
    return Sound.create({ uri: this._uri }, initialStatus, callback, false);
  }
}
