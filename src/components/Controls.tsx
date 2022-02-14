import React, { ReactNode } from "react";
import {
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  Text,
  ViewStyle,
} from "react-native";
import styles from "./MediaControls.style";
import { getPlayerStateIcon } from "../utils";
import { Props } from "./MediaControls";
import { PLAYER_STATES } from "../constants/playerStates";

type ControlsProps = Pick<
  Props,
  "isLoading" | "mainColor" | "playerState" | "onReplay"
> & {
  onPause: () => void;
  onForward?: () => void;
  onBackward?: () => void;
  disableTrack?: boolean;
  onNextTrack?: () => void;
  isLastTrack?: boolean;
  LastTruckMessage?: ReactNode;
  playPauseStyle?: ViewStyle;
  forwardBackwardStyle?: ViewStyle;
  nextButtonStyle?: ViewStyle;
};

const Controls = (props: ControlsProps) => {
  const {
    isLoading,
    mainColor,
    playerState,
    onReplay,
    onNextTrack,
    onPause,
    onForward,
    onBackward,
    disableTrack,
    isLastTrack,
    LastTruckMessage,
    playPauseStyle,
    forwardBackwardStyle,
    nextButtonStyle,
  } = props;
  const icon = getPlayerStateIcon(playerState);
  const goBack = require("./assets/back.png");
  const goForward = require("./assets/forward.png");
  const pressAction = playerState === PLAYER_STATES.ENDED ? onReplay : onPause;

  const content = isLoading ? (
    <ActivityIndicator size="large" color="#FFF" />
  ) : !isLastTrack ? (
    playerState === PLAYER_STATES.ENDED && onNextTrack ? (
      <TouchableOpacity
        style={[
          styles.playButton,
          { backgroundColor: mainColor, marginHorizontal: 8 },
          nextButtonStyle,
        ]}
        onPress={onNextTrack}
        accessibilityLabel="Move to next track"
        accessibilityHint={"Move to next track"}
      >
        <Text style={{ color: "white" }}>NEXT</Text>
      </TouchableOpacity>
    ) : (
      <View style={{ flexDirection: "row" }}>
        {!disableTrack ? (
          <TouchableOpacity
            style={[
              styles.playButton,
              { backgroundColor: mainColor },
              forwardBackwardStyle,
            ]}
            onPress={onBackward}
            accessibilityLabel={
              PLAYER_STATES.PAUSED ? "Tap to Play" : "Tap to Pause"
            }
            accessibilityHint={"Plays and Pauses the Video"}
          >
            <Image source={goBack} style={styles.playIcon} />
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={[
            styles.playButton,
            { backgroundColor: mainColor, marginHorizontal: 8 },
            playPauseStyle,
          ]}
          onPress={pressAction}
          accessibilityLabel={
            PLAYER_STATES.PAUSED ? "Tap to Play" : "Tap to Pause"
          }
          accessibilityHint={"Plays and Pauses the Video"}
        >
          <Image source={icon} style={styles.playIcon} />
        </TouchableOpacity>
        {!disableTrack ? (
          <TouchableOpacity
            style={[
              styles.playButton,
              { backgroundColor: mainColor },
              forwardBackwardStyle,
            ]}
            onPress={onForward}
            accessibilityLabel={
              PLAYER_STATES.PAUSED ? "Tap to Play" : "Tap to Pause"
            }
            accessibilityHint={"Plays and Pauses the Video"}
          >
            <Image source={goForward} style={styles.playIcon} />
          </TouchableOpacity>
        ) : null}
      </View>
    )
  ) : LastTruckMessage ? (
    LastTruckMessage
  ) : (
    <View style={{ padding: 8, backgroundColor: mainColor }}>
      <Text style={{ color: "white" }}>Thank you for being with us</Text>
    </View>
  );
  return <View style={[styles.controlsRow]}>{content}</View>;
};

export { Controls };
