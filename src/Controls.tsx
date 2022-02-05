import React from "react";
import { TouchableOpacity, View, ActivityIndicator, Image } from "react-native";
import styles from "./MediaControls.style";
import { getPlayerStateIcon } from "./utils";
import { Props } from "./MediaControls";
import { PLAYER_STATES } from "./constants/playerStates";

type ControlsProps = Pick<
  Props,
  "isLoading" | "mainColor" | "playerState" | "onReplay"
> & {
  onPause: () => void;
  onForward?: () => void;
  onBackward?: () => void;
  disableTrack?: boolean;
};

const Controls = (props: ControlsProps) => {
  const {
    isLoading,
    mainColor,
    playerState,
    onReplay,
    onPause,
    onForward,
    onBackward,
    disableTrack,
  } = props;
  const icon = getPlayerStateIcon(playerState);
  const goBack = require("./assets/back.png");
  const goForward = require("./assets/forward.png");
  const pressAction = playerState === PLAYER_STATES.ENDED ? onReplay : onPause;

  const content = isLoading ? (
    <ActivityIndicator size="large" color="#FFF" />
  ) : (
    <View style={{ flexDirection: "row" }}>
      {
        disableTrack ? (
          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: mainColor }]}
            onPress={onForward}
            accessibilityLabel={
              PLAYER_STATES.PAUSED ? "Tap to Play" : "Tap to Pause"
            }
            accessibilityHint={"Plays and Pauses the Video"}
          >
            <Image source={goBack} style={styles.playIcon} />
          </TouchableOpacity>
        ) : null
      }

      <TouchableOpacity
        style={[
          styles.playButton,
          { backgroundColor: mainColor, marginHorizontal: 8 },
        ]}
        onPress={pressAction}
        accessibilityLabel={
          PLAYER_STATES.PAUSED ? "Tap to Play" : "Tap to Pause"
        }
        accessibilityHint={"Plays and Pauses the Video"}
      >
        <Image source={icon} style={styles.playIcon} />
      </TouchableOpacity>
      {
        disableTrack ? (
          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: mainColor }]}
            onPress={onBackward}
            accessibilityLabel={
              PLAYER_STATES.PAUSED ? "Tap to Play" : "Tap to Pause"
            }
            accessibilityHint={"Plays and Pauses the Video"}
          >
            <Image source={goForward} style={styles.playIcon} />
          </TouchableOpacity>
        ) : null
      }
    </View>
  );

  return <View style={[styles.controlsRow]}>{content}</View>;
};

export { Controls };
