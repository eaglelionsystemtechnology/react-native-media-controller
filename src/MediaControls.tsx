import React, { useState, useEffect } from "react";
import {
  View,
  Animated,
  TouchableWithoutFeedback,
  GestureResponderEvent,
  ViewStyle,
} from "react-native";
import styles from "./MediaControls.style";
import { PLAYER_STATES } from "./constants/playerStates";
import { Controls } from "./Controls";
import { Slider, CustomSliderStyle } from "./Slider";
import { Toolbar } from "./Toolbar";

export type Props = {
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  duration: number;
  fadeOutDelay?: number;
  isFullScreen: boolean;
  isLoading: boolean;
  mainColor: string;
  onFullScreen?: (event: GestureResponderEvent) => void;
  onPaused: (playerState: PLAYER_STATES) => void;
  onReplay: () => void;
  onSeek: (value: number) => void;
  onSeeking: (value: number) => void;
  playerState: PLAYER_STATES;
  progress: number;
  showOnStart?: boolean;
  sliderStyle?: CustomSliderStyle;
  toolbarStyle?: ViewStyle;
  maximumTrackTintColor?: string;
  minimumTrackTintColor?: string;
  thumbTintColor?: string;
  disableTrack?: boolean;
  onForward?: () => void;
  onBackWard?: () => void;
};

const MediaControls = (props: Props) => {
  const {
    children,
    containerStyle: customContainerStyle = {},
    duration,
    fadeOutDelay = 5000,
    isLoading = false,
    mainColor = "rgba(12, 83, 175, 0.9)",
    onFullScreen,
    onReplay: onReplayCallback,
    onSeek,
    onSeeking,
    playerState,
    progress,
    showOnStart = true,
    sliderStyle, // defaults are applied in Slider.tsx
    toolbarStyle: customToolbarStyle = {},
    maximumTrackTintColor,
    minimumTrackTintColor,
    thumbTintColor,
    disableTrack,
    onForward,
    onBackWard,
  } = props;
  const { initialOpacity, initialIsVisible } = (() => {
    if (showOnStart)
    {
      return {
        initialOpacity: 1,
        initialIsVisible: true,
      };
    }

    return {
      initialOpacity: 0,
      initialIsVisible: false,
    };
  })();

  const [opacity] = useState(new Animated.Value(initialOpacity));
  const [isVisible, setIsVisible] = useState(initialIsVisible);

  useEffect(() => {
    fadeOutControls(fadeOutDelay);
  }, []);

  const fadeOutControls = (delay = 0) => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      delay,
      useNativeDriver: false,
    }).start((result: { finished: any }) => {
      if (result.finished)
      {
        setIsVisible(false);
      }
    });
  };

  const fadeInControls = (loop = true) => {
    setIsVisible(true);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      delay: 0,
      useNativeDriver: false,
    }).start(() => {
      if (loop)
      {
        fadeOutControls(fadeOutDelay);
      }
    });
  };

  const onReplay = () => {
    fadeOutControls(fadeOutDelay);
    onReplayCallback();
  };

  const cancelAnimation = () => opacity.stopAnimation(() => setIsVisible(true));

  const onPause = () => {
    const { playerState, onPaused } = props;
    const { PLAYING, PAUSED, ENDED } = PLAYER_STATES;
    switch (playerState)
    {
      case PLAYING: {
        cancelAnimation();
        break;
      }
      case PAUSED: {
        fadeOutControls(fadeOutDelay);
        break;
      }
      case ENDED:
        break;
    }

    const newPlayerState = playerState === PLAYING ? PAUSED : PLAYING;
    return onPaused(newPlayerState);
  };

  const toggleControls = () => {
    opacity.stopAnimation((value: number) => {
      setIsVisible(!!value);
      return value ? fadeOutControls() : fadeInControls();
    });
  };

  return (
    <TouchableWithoutFeedback accessible={false} onPress={toggleControls}>
      <Animated.View
        style={[styles.container, customContainerStyle, { opacity }]}
      >
        {isVisible && (
          <View style={[styles.container, customContainerStyle]}>
            <View
              style={[
                styles.controlsRow,
                styles.toolbarRow,
                customToolbarStyle,
              ]}
            >
              {children}
            </View>
            <Controls
              onPause={onPause}
              onReplay={onReplay}
              isLoading={isLoading}
              mainColor={mainColor}
              playerState={playerState}
              onForward={onForward}
              onBackward={onBackWard}
              disableTrack={disableTrack}
            />
            <Slider
              progress={progress}
              duration={duration}
              mainColor={mainColor}
              onFullScreen={onFullScreen}
              playerState={playerState}
              onSeek={onSeek}
              onSeeking={onSeeking}
              onPause={onPause}
              customSliderStyle={sliderStyle}
              maximumTrackTintColor={maximumTrackTintColor}
              minimumTrackTintColor={minimumTrackTintColor}
              thumbTintColor={thumbTintColor}
              disableTrack={disableTrack}
            />
          </View>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

MediaControls.Toolbar = Toolbar;

export default MediaControls;
