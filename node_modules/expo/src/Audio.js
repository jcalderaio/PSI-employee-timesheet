// @flow

import { NativeModules } from 'react-native';

import {
  _DEFAULT_PROGRESS_UPDATE_INTERVAL_MILLIS,
  _COMMON_AV_PLAYBACK_METHODS,
  _getURIAndFullInitialStatusForLoadAsync,
  _throwErrorIfValuesOutOfBoundsInStatus,
  _getUnloadedStatus,
  type PlaybackSource,
  type PlaybackStatus,
  type PlaybackStatusToSet,
} from './AV';

export type RecordingOptions = {
  android: {
    extension: string,
    outputFormat: number,
    audioEncoder: number,
    sampleRate?: number,
    numberOfChannels?: number,
    bitRate?: number,
    maxFileSize?: number,
  },
  ios: {
    extension: string,
    outputFormat?: string | number,
    audioQuality: number,
    sampleRate: number,
    numberOfChannels: number,
    bitRate: number,
    bitRateStrategy?: number,
    bitDepthHint?: number,
    linearPCMBitDepth?: number,
    linearPCMIsBigEndian?: boolean,
    linearPCMIsFloat?: boolean,
  },
};

export const RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT = 0;
export const RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_THREE_GPP = 1;
export const RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4 = 2;
export const RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_AMR_NB = 3;
export const RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_AMR_WB = 4;
export const RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_AAC_ADIF = 5;
export const RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_AAC_ADTS = 6;
export const RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_RTP_AVP = 7;
export const RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG2TS = 8;
export const RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_WEBM = 9;

export const RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT = 0;
export const RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AMR_NB = 1;
export const RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AMR_WB = 2;
export const RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC = 3;
export const RECORDING_OPTION_ANDROID_AUDIO_ENCODER_HE_AAC = 4;
export const RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC_ELD = 5;
export const RECORDING_OPTION_ANDROID_AUDIO_ENCODER_VORBIS = 6;

export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM = 'lpcm';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_AC3 = 'ac-3';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_60958AC3 = 'cac3';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_APPLEIMA4 = 'ima4';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC = 'aac ';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4CELP = 'celp';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4HVXC = 'hvxc';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4TWINVQ = 'twvq';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_MACE3 = 'MAC3';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_MACE6 = 'MAC6';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_ULAW = 'ulaw';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_ALAW = 'alaw';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_QDESIGN = 'QDMC';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_QDESIGN2 = 'QDM2';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_QUALCOMM = 'Qclp';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEGLAYER1 = '.mp1';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEGLAYER2 = '.mp2';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEGLAYER3 = '.mp3';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_APPLELOSSLESS = 'alac';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC_HE = 'aach';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC_LD = 'aacl';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC_ELD = 'aace';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC_ELD_SBR = 'aacf';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC_ELD_V2 = 'aacg';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC_HE_V2 = 'aacp';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC_SPATIAL = 'aacs';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_AMR = 'samr';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_AMR_WB = 'sawb';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_AUDIBLE = 'AUDB';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_ILBC = 'ilbc';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_DVIINTELIMA = 0x6d730011;
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_MICROSOFTGSM = 0x6d730031;
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_AES3 = 'aes3';
export const RECORDING_OPTION_IOS_OUTPUT_FORMAT_ENHANCEDAC3 = 'ec-3';

export const RECORDING_OPTION_IOS_AUDIO_QUALITY_MIN = 0;
export const RECORDING_OPTION_IOS_AUDIO_QUALITY_LOW = 0x20;
export const RECORDING_OPTION_IOS_AUDIO_QUALITY_MEDIUM = 0x40;
export const RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH = 0x60;
export const RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX = 0x7f;

export const RECORDING_OPTION_IOS_BIT_RATE_STRATEGY_CONSTANT = 0;
export const RECORDING_OPTION_IOS_BIT_RATE_STRATEGY_LONG_TERM_AVERAGE = 1;
export const RECORDING_OPTION_IOS_BIT_RATE_STRATEGY_VARIABLE_CONSTRAINED = 2;
export const RECORDING_OPTION_IOS_BIT_RATE_STRATEGY_VARIABLE = 3;

// TODO : maybe make presets for music and speech, or lossy / lossless.

export const RECORDING_OPTIONS_PRESET_HIGH_QUALITY: RecordingOptions = {
  android: {
    extension: '.m4a',
    outputFormat: RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: '.caf',
    audioQuality: RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};

export const RECORDING_OPTIONS_PRESET_LOW_QUALITY: RecordingOptions = {
  android: {
    extension: '.3gp',
    outputFormat: RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_THREE_GPP,
    audioEncoder: RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AMR_NB,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: '.caf',
    audioQuality: RECORDING_OPTION_IOS_AUDIO_QUALITY_MIN,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};

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

let _enabled: boolean = true;
let _recorderExists: boolean = false;
const _DISABLED_ERROR: Error = new Error(
  'Cannot complete operation because audio is not enabled.'
);

// Returns true if value is in validValues, and false if not.
const _isValueValid = (value: any, validValues: Array<any>): boolean => {
  return validValues.filter(validValue => validValue === value).length > 0;
};

// Returns array of missing keys in object. Returns an empty array if no missing keys are found.
const _findMissingKeys = (
  object: Object,
  requiredKeys: Array<any>
): Array<any> => {
  return requiredKeys.filter(requiredKey => !(requiredKey in object));
};

export async function setIsEnabledAsync(value: boolean): Promise<void> {
  _enabled = value;
  await NativeModules.ExponentAV.setAudioIsEnabled(value);
  // TODO : We immediately pause all players when disabled, but we do not resume all shouldPlay
  // players when enabled. Perhaps for completeness we should allow this; the design of the
  // enabling API is for people to enable / disable this audio library, but I think that it should
  // intuitively also double as a global pause/resume.
}

export async function setAudioModeAsync(mode: AudioMode): Promise<void> {
  const missingKeys = _findMissingKeys(mode, [
    'allowsRecordingIOS',
    'interruptionModeIOS',
    'playsInSilentModeIOS',
    'interruptionModeAndroid',
    'shouldDuckAndroid',
  ]);
  if (missingKeys.length > 0) {
    throw new Error(
      `Audio mode attempted to be set without the required keys: ${JSON.stringify(
        missingKeys
      )}`
    );
  }
  if (
    !_isValueValid(mode.interruptionModeIOS, [
      INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
      INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      INTERRUPTION_MODE_IOS_DUCK_OTHERS,
    ])
  ) {
    throw new Error(`"interruptionModeIOS" was set to an invalid value.`);
  }
  if (
    !_isValueValid(mode.interruptionModeAndroid, [
      INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
    ])
  ) {
    throw new Error(`"interruptionModeAndroid" was set to an invalid value.`);
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
  _options: ?RecordingOptions;

  constructor() {
    this._canRecord = false;
    this._isDoneRecording = false;
    this._finalDurationMillis = 0;
    this._uri = null;
    this._progressUpdateTimeoutVariable = null;
    this._progressUpdateIntervalMillis = _DEFAULT_PROGRESS_UPDATE_INTERVAL_MILLIS;
    this._options = null;
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

  async prepareToRecordAsync(
    options: RecordingOptions = RECORDING_OPTIONS_PRESET_LOW_QUALITY
  ): Promise<RecordingStatus> {
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

    if (!options || !options.android || !options.ios) {
      throw new Error(
        'You must provide recording options for android and ios in order to prepare to record.'
      );
    }

    const extensionRegex = /^\.\w+$/;
    if (
      !options.android.extension ||
      !options.ios.extension ||
      !extensionRegex.test(options.android.extension) ||
      !extensionRegex.test(options.ios.extension)
    ) {
      throw new Error(
        `Your file extensions must match ${extensionRegex.toString()}.`
      );
    }

    if (!this._canRecord) {
      const {
        uri,
        status,
      }: {
        uri: string,
        status: Object, // status is of type RecordingStatus, but without the canRecord field populated.
      } = await NativeModules.ExponentAV.prepareAudioRecorder(options);
      _recorderExists = true;
      this._uri = uri;
      this._options = options;
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
    if (this._uri == null || !this._isDoneRecording) {
      throw new Error(
        'Cannot create sound when the Recording has not finished!'
      );
    }
    // $FlowFixMe: Flow can't distinguish between this literal and Asset
    return Sound.create({ uri: this._uri }, initialStatus, callback, false);
  }
}
