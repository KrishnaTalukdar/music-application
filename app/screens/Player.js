import React, { useContext, useEffect } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { color } from "react-native-reanimated";
import Screen from "../components/Screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import PlayerButton from "../components/PlayerButton";
import { FontAwesome } from "@expo/vector-icons";
import { AudioContext } from "../context/AudioProvider";
import { play, pause, resume, playNext } from "../decoration/audiocontroller";
import { storeAudioForNextOpening } from "../decoration/audiosyncronization";

const { width } = Dimensions.get("window");

const Player = () => {
  const context = useContext(AudioContext);
  const { playbackPosition, playbackDuration } = context;

  const calculateSeebBar = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      return playbackPosition / playbackDuration;
    }
    return 0;
  };
  useEffect(() => {
    context.loadPreviousAudio();
  }, []);

  const handlePlayPause = async () => {
    //PLAY

    if (context.soundObject === null) {
      const audio = context.currentAudio;
      const status = await play(context.playbackObject, audio.uri);
      context.playbackObject.setOnPlaybackStatusUpdate(
        //-----------------------------------------------------------------FOR SEEKBAR------------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>
        context.OnPlaybackStatusUpdate
      );
      return context.updateState(context, {
        soundObject: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: context.currentAudioIndex,
      });
    }
    //PAUSE

    if (context.soundObject && context.soundObject.isPlaying) {
      const status = await pause(context.playbackObject);
      return context.updateState(context, {
        soundObject: status,
        isPlaying: false,
      });
    }
    //RESUME

    if (context.soundObject && !context.soundObject.isPlaying) {
      //sound is available but not playing
      const status = await resume(context.playbackObject);
      return context.updateState(context, {
        soundObject: status,
        isPlaying: true,
      });
    }
  };

  //--------------------------------FOR PLAYING NEXT AUDIO------------------------------------------//

  const handleNext = async () => {
    const { isLoaded } = await context.playbackObject.getStatusAsync();
    const isLastAudio = //current audio is last audio then after pressing next it will add 1 to last audio and play next audio....then that audio will last audio
      context.currentAudioIndex + 1 === context.totalAudioCount;
    let audio = context.audioFiles[context.currentAudioIndex + 1];
    let index;
    let status;

    if (!isLoaded && !isLastAudio) {
      index = context.currentAudioIndex + 1;
      status = await play(context.playbackObject, audio.uri);
    }

    if (isLoaded && !isLastAudio) {
      index = context.currentAudioIndex + 1;
      status = await playNext(context.playbackObject, audio.uri);
    }

    if (isLastAudio) {
      //--------------------------AFTER LAST AUDIO BACK TO 1ST ONE-------------------------------------//
      index = 0;
      audio = context.audioFiles[index];
      if (isLoaded) {
        status = await playNext(context.playbackObject, audio.uri);
      } else {
        status = await play(context.playbackObject, audio.uri);
      }
    }

    context.updateState(context, {
      currentAudio: audio,
      playbackObject: context.playbackObject,
      soundObject: status,
      isPlaying: true,
      currentAudioIndex: index, //for knowing which song is currently playing
      playbackPosition: null,
      playbackDuration: null,
    });

    storeAudioForNextOpening(audio, index);
  };

  //--------------------------------FOR PLAYING PREVIOUS AUDIO------------------------------------------//

  const handlePrevious = async () => {
    const { isLoaded } = await context.playbackObject.getStatusAsync();
    const isFirstAudio = context.currentAudioIndex <= 0; //current audio is last audio then after pressing next it will add 1 to last audio and play next audio....then that audio will last audio
    let audio = context.audioFiles[context.currentAudioIndex - 1];
    let index;
    let status;

    if (!isLoaded && !isFirstAudio) {
      index = context.currentAudioIndex - 1;
      status = await play(context.playbackObject, audio.uri);
    }

    if (isLoaded && !isFirstAudio) {
      index = context.currentAudioIndex - 1;
      status = await playNext(context.playbackObject, audio.uri);
    }

    if (isFirstAudio) {
      //--------------------------AFTER LAST AUDIO BACK TO 1ST ONE-------------------------------------//
      index = context.totalAudioCount - 1;
      audio = context.audioFiles[index];
      if (isLoaded) {
        status = await playNext(context.playbackObject, audio.uri);
      } else {
        status = await play(context.playbackObject, audio.uri);
      }
    }

    context.updateState(context, {
      currentAudio: audio,
      playbackObject: context.playbackObject,
      soundObject: status,
      isPlaying: true,
      currentAudioIndex: index, //for knowing which song is currently playing
      playbackPosition: null,
      playbackDuration: null,
    });

    storeAudioForNextOpening(audio, index);
  };

  if (!context.currentAudio) return null;
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.audioCount}>{`${context.currentAudioIndex + 1}/${
          context.totalAudioCount
        }`}</Text>
        <View style={styles.playericon}>
          <FontAwesome
            name="music"
            size={150}
            color={context.isPlaying ? "#F0A94E" : "white"}
          />
        </View>
        <View style={styles.playbar}>
          <Text numberOfLines={1} style={styles.audiotitle}>
            {context.currentAudio.filename}
          </Text>
          <Slider
            style={{ width: width, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeebBar()} //line no 17
            minimumTrackTintColor="#99c10C"
            maximumTrackTintColor="#809000"
          />
          <View>
            <View style={styles.AudioController}>
              <PlayerButton iconType="PREVIOUS" onPress={handlePrevious} />
              <PlayerButton
                onPress={handlePlayPause}
                style={{ marginHorizontal: 60 }}
                iconType={context.isPlaying ? "PLAY" : "PAUSE"} // isPlaying function is from audioProvider
                isplaying
                function
                is
                from
                AudioProvider
              />

              <PlayerButton iconType="NEXT" onPress={handleNext} />
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C0120",
    //justifyContent: "center",
    //alignItems: "center",
  },
  AudioController: {
    width,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 35,
  },

  audioCount: {
    textAlign: "right",
    color: "white",
    padding: 20,
    color: "lightyellow",
  },
  playericon: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width - 100,
    backgroundColor: "#27282A",
    padding: 10,
    marginLeft: 45,
    marginTop: 45,
    marginRight: 50,
    borderRadius: 14,
  },
  playbar: {
    textAlign: "center",
    color: "white",
  },
  audiotitle: {
    fontSize: 18,
    color: "white",
    padding: 45,
  },
});

export default Player;
