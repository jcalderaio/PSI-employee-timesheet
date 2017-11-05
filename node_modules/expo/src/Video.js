// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  findNodeHandle,
  NativeModules,
  Platform,
  requireNativeComponent,
  StyleSheet,
  View,
  ViewPropTypes,
} from 'react-native';

import {
  _COMMON_AV_PLAYBACK_METHODS,
  _getURIFromSource,
  _getURIAndFullInitialStatusForLoadAsync,
  _throwErrorIfValuesOutOfBoundsInStatus,
  _getUnloadedStatus,
  type PlaybackSource,
  type PlaybackStatus,
  type PlaybackStatusToSet,
} from './AV';

export type NaturalSize = {
  width: number,
  height: number,
  orientation: 'portrait' | 'landscape',
};

type ResizeMode = 'contain' | 'cover' | 'stretch';

type ReadyForDisplayEvent = {
  naturalSize: NaturalSize,
  status: PlaybackStatus,
};

type FullscreenUpdateEvent = {
  fullscreenUpdate: 0 | 1 | 2 | 3,
  status: PlaybackStatus,
};

// TODO extend the Props type from Component
type Props = {
  // Source stuff
  source?: PlaybackSource, // { uri: 'http://foo/bar.mp4' }, Asset, or require('./foo/bar.mp4')
  posterSource?: { uri: string } | number, // { uri: 'http://foo/bar.mp4' } or require('./foo/bar.mp4')

  // Callbacks
  callback?: (status: PlaybackStatus) => void, // TODO for consistency should this also be "event" encapsulated? What about with Audio? Should we call this onStatusUpdate?
  onLoadStart?: () => void,
  onLoad?: (status: PlaybackStatus) => void,
  onError?: (error: string) => void,
  onReadyForDisplay?: (event: ReadyForDisplayEvent) => void,
  onIOSFullscreenUpdate?: (event: FullscreenUpdateEvent) => void,

  // UI stuff
  useNativeControls?: boolean,
  resizeMode?: ResizeMode,
  usePoster?: boolean,

  // Playback API
  status?: PlaybackStatusToSet,
  progressUpdateIntervalMillis?: number,
  positionMillis?: number,
  shouldPlay?: boolean,
  rate?: number,
  shouldCorrectPitch?: boolean,
  volume?: number,
  isMuted?: boolean,
  isLooping?: boolean,

  // Required by react-native
  scaleX?: number,
  scaleY?: number,
  translateX?: number,
  translateY?: number,
  rotation?: number,

  // plus View props
};

type NativeProps = {
  uri?: ?string,
  nativeResizeMode?: Object,
  status?: PlaybackStatusToSet,
  onStatusUpdateNative?: (event: Object) => void,
  onReadyForDisplayNative?: (event: Object) => void,
  onFullscreenUpdateNative?: (event: Object) => void,
  useNativeControls?: boolean,

  // plus View props
  style?: Object,
  // etc...
};

export const IOS_FULLSCREEN_UPDATE_PLAYER_WILL_PRESENT = 0;
export const IOS_FULLSCREEN_UPDATE_PLAYER_DID_PRESENT = 1;
export const IOS_FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS = 2;
export const IOS_FULLSCREEN_UPDATE_PLAYER_DID_DISMISS = 3;

const _STYLES = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  poster: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'contain',
  },
});

export default class Video extends Component {
  static RESIZE_MODE_CONTAIN = 'contain';
  static RESIZE_MODE_COVER = 'cover';
  static RESIZE_MODE_STRETCH = 'stretch';

  state: {
    showPoster: boolean,
  };
  props: Props;
  _root: ExponentVideo;

  constructor(props: Props) {
    super(props);
    this.state = {
      showPoster: props.usePoster != null && props.usePoster,
    };
  }

  setNativeProps(nativeProps: NativeProps) {
    this._root.setNativeProps(nativeProps);
  }

  // Internal methods

  _assignRoot = (component: ExponentVideo) => {
    this._root = component;
  };

  _handleNewStatus = (status: PlaybackStatus) => {
    if (
      this.state.showPoster &&
      status.isLoaded &&
      (status.isPlaying || status.positionMillis !== 0)
    ) {
      this.setState({ showPoster: false });
    }

    if (this.props.callback) {
      this.props.callback(status);
    }
  };

  _performOperationAndHandleStatusAsync = async (
    operation: (tag: number) => Promise<PlaybackStatus>
  ): Promise<PlaybackStatus> => {
    if (this._root) {
      const status: PlaybackStatus = await operation(
        findNodeHandle(this._root)
      );
      this._handleNewStatus(status);
      return status;
    } else {
      throw new Error(
        'Cannot complete operation because the Video component has not yet loaded.'
      );
    }
  };

  // ### iOS Fullscreening API ###

  _setIOSFullscreen = async (value: boolean) => {
    if (Platform.OS !== 'ios') {
      throw new Error('Cannot call fullscreen method if the OS is not iOS!');
    }
    return this._performOperationAndHandleStatusAsync((tag: number) =>
      NativeModules.ExponentVideoManager.setFullscreen(tag, value)
    );
  };

  presentIOSFullscreenPlayer = async () => {
    return this._setIOSFullscreen(true);
  };

  dismissIOSFullscreenPlayer = async () => {
    return this._setIOSFullscreen(false);
  };

  // ### Unified playback API ### (consistent with Audio.js)
  // All calls automatically call the callback as a side effect.

  // Get status API

  getStatusAsync = async (): Promise<PlaybackStatus> => {
    return this._performOperationAndHandleStatusAsync((tag: number) =>
      NativeModules.ExponentAV.getStatusForVideo(tag)
    );
  };

  setCallback = (callback: ?(status: PlaybackStatus) => void) => {
    this.setNativeProps({ callback });
    this.getStatusAsync();
  };

  // Loading / unloading API

  loadAsync = async (
    source: PlaybackSource,
    initialStatus: PlaybackStatusToSet = {},
    downloadFirst: boolean = true
  ): Promise<PlaybackStatus> => {
    const {
      uri,
      fullInitialStatus,
    } = await _getURIAndFullInitialStatusForLoadAsync(
      source,
      initialStatus,
      downloadFirst
    );
    return this._performOperationAndHandleStatusAsync((tag: number) =>
      NativeModules.ExponentAV.loadForVideo(tag, uri, fullInitialStatus)
    );
  };

  // Equivalent to setting URI to null.
  unloadAsync = async (): Promise<PlaybackStatus> => {
    return this._performOperationAndHandleStatusAsync((tag: number) =>
      NativeModules.ExponentAV.unloadForVideo(tag)
    );
  };

  // Set status API (only available while isLoaded = true)

  setStatusAsync = async (
    status: PlaybackStatusToSet
  ): Promise<PlaybackStatus> => {
    _throwErrorIfValuesOutOfBoundsInStatus(status);
    return this._performOperationAndHandleStatusAsync((tag: number) =>
      NativeModules.ExponentAV.setStatusForVideo(tag, status)
    );
  };

  // Additional convenience methods on top of setStatusAsync are defined via _COMMON_AV_PLAYBACK_METHODS:
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

  // ### Callback wrappers ###

  _nativeCallback = (event: { nativeEvent: PlaybackStatus }) => {
    this._handleNewStatus(event.nativeEvent);
  };

  // TODO make sure we are passing the right stuff
  _nativeOnLoadStart = (event: SyntheticEvent) => {
    if (this.props.onLoadStart) {
      this.props.onLoadStart();
    }
  };

  _nativeOnLoad = (event: { nativeEvent: PlaybackStatus }) => {
    if (this.props.onLoad) {
      this.props.onLoad(event.nativeEvent);
    }
    this._handleNewStatus(event.nativeEvent);
  };

  _nativeOnError = (event: { nativeEvent: { error: string } }) => {
    const error: string = event.nativeEvent.error;
    if (this.props.onError) {
      this.props.onError(error);
    }
    this._handleNewStatus(_getUnloadedStatus(error));
  };

  _nativeOnReadyForDisplay = (event: { nativeEvent: ReadyForDisplayEvent }) => {
    if (this.props.onReadyForDisplay) {
      this.props.onReadyForDisplay(event.nativeEvent);
    }
  };

  _nativeOnFullscreenUpdate = (event: {
    nativeEvent: FullscreenUpdateEvent,
  }) => {
    if (this.props.onIOSFullscreenUpdate) {
      this.props.onIOSFullscreenUpdate(event.nativeEvent);
    }
  };

  render() {
    const uri: ?string = _getURIFromSource(this.props.source);

    let nativeResizeMode: Object =
      NativeModules.UIManager.ExponentVideo.Constants.ScaleNone;
    if (this.props.resizeMode) {
      let resizeMode: ResizeMode = this.props.resizeMode;
      if (resizeMode === Video.RESIZE_MODE_STRETCH) {
        nativeResizeMode =
          NativeModules.UIManager.ExponentVideo.Constants.ScaleToFill;
      } else if (resizeMode === Video.RESIZE_MODE_CONTAIN) {
        nativeResizeMode =
          NativeModules.UIManager.ExponentVideo.Constants.ScaleAspectFit;
      } else if (resizeMode === Video.RESIZE_MODE_COVER) {
        nativeResizeMode =
          NativeModules.UIManager.ExponentVideo.Constants.ScaleAspectFill;
      }
    }

    // Set status via individual props (casting as Object to appease flow)
    const status: Object = { ...this.props.status };
    [
      'progressUpdateIntervalMillis',
      'positionMillis',
      'shouldPlay',
      'rate',
      'shouldCorrectPitch',
      'volume',
      'isMuted',
      'isLooping',
    ].forEach(prop => {
      if (prop in this.props) {
        status[prop] = this.props[prop];
      }
    });

    // Replace selected native props (casting as Object to appease flow)
    const nativeProps: NativeProps = {
      style: _STYLES.base,
      ...this.props,
      uri,
      nativeResizeMode,
      status,
      onStatusUpdateNative: this._nativeCallback,
      onLoadStartNative: this._nativeOnLoadStart,
      onLoadNative: this._nativeOnLoad,
      onErrorNative: this._nativeOnError,
      onReadyForDisplayNative: this._nativeOnReadyForDisplay,
      onFullscreenUpdateNative: this._nativeOnFullscreenUpdate,
    };

    return this.props.usePoster && this.state.showPoster
      ? <View style={nativeProps.style}>
          <ExponentVideo ref={this._assignRoot} {...nativeProps} />
          <Image style={_STYLES.poster} source={this.props.posterSource} />
        </View>
      : <ExponentVideo ref={this._assignRoot} {...nativeProps} />;
  }
}

Object.assign(Video.prototype, _COMMON_AV_PLAYBACK_METHODS);

Video.propTypes = {
  // Source stuff
  source: PropTypes.oneOfType([
    PropTypes.shape({
      uri: PropTypes.string,
    }), // remote URI like { uri: 'http://foo/bar.mp4' }
    PropTypes.number, // asset module like require('./foo/bar.mp4')
  ]),
  posterSource: PropTypes.oneOfType([
    PropTypes.shape({
      uri: PropTypes.string,
    }), // remote URI like { uri: 'http://foo/bar.mp4' }
    PropTypes.number, // asset module like require('./foo/bar.mp4')
  ]),

  // Callbacks
  callback: PropTypes.func,
  onLoadStart: PropTypes.func,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  onIOSFullscreenUpdate: PropTypes.func,
  onReadyForDisplay: PropTypes.func,

  // UI stuff
  useNativeControls: PropTypes.bool,
  resizeMode: PropTypes.string,
  usePoster: PropTypes.bool,

  // Playback API
  status: PropTypes.shape({
    progressUpdateIntervalMillis: PropTypes.number,
    positionMillis: PropTypes.number,
    shouldPlay: PropTypes.bool,
    rate: PropTypes.number,
    shouldCorrectPitch: PropTypes.bool,
    volume: PropTypes.number,
    isMuted: PropTypes.bool,
    isLooping: PropTypes.bool,
  }),
  progressUpdateIntervalMillis: PropTypes.number,
  positionMillis: PropTypes.number,
  shouldPlay: PropTypes.bool,
  rate: PropTypes.number,
  shouldCorrectPitch: PropTypes.bool,
  volume: PropTypes.number,
  isMuted: PropTypes.bool,
  isLooping: PropTypes.bool,

  // Required by react-native
  scaleX: PropTypes.number,
  scaleY: PropTypes.number,
  translateX: PropTypes.number,
  translateY: PropTypes.number,
  rotation: PropTypes.number,
  ...ViewPropTypes,
};

const ExponentVideo = requireNativeComponent('ExponentVideo', Video, {
  nativeOnly: {
    uri: true,
    nativeResizeMode: true,
    onStatusUpdateNative: true,
    onLoadStartNative: true,
    onLoadNative: true,
    onErrorNative: true,
    onReadyForDisplayNative: true,
    onFullscreenUpdateNative: true,
  },
});
