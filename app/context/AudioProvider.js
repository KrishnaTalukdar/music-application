import React, { Component, createContext } from "react";
import { Alert, Text, View } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { DataProvider } from "recyclerlistview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { storeAudioForNextOpening } from "../decoration/audiosyncronization";
import { play, pause, resume, playNext } from "../decoration/audiocontroller";

export const AudioContext = createContext();

export class AudioProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioFiles: [],

      playList: [],
      addToPlayList: null,
          permissionError: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2), //we put audioFiles in this dataProvider

      playbackObject: null,
      soundObject: null,
      currentAudio: {},
      isPlaying: false,
      currentAudioIndex: null,
      playbackPosition: null,
      playbackDuration: null,
    };
    this.totalAudioCount = 0; // it will be use in player session for draging name and count details from audiolist to player
  }
  permissionAllert = () => {
    Alert.alert(
      "Permission Required",
      "This app needs to read audio flies",
      [
        {
          text: "I am ready",
          onPress: () => this.getPermission(),
        },
        {
          text: "cancel",
          onPress: () => this.permissionAllert(),
        },
      ]
    ); //alert(title: string, message?: string, buttons?: AlertButton[], options?: AlertOptions): void
  };
  getAudioFiles = async () => {
    const { dataProvider, audioFiles } = this.state;
    let media = await MediaLibrary.getAssetsAsync({
      //for accessing all media
      mediaType: "audio",
    });

    media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
      first: media.totalCount,
    });
    this.totalAudioCount = media.totalCount;
    //console.log(media.assets.length);
    this.setState({
      ...this.state,
      dataProvider: dataProvider.cloneWithRows([
        ...audioFiles,
        ...media.assets,
      ]),
      audioFiles: [...audioFiles, ...media.assets],
    });
  };

  loadPreviousAudio = async () => {
    // SUPPOSE WE RELOAD APP THEN WE NEED THAT  AUDIO WHICH IS PREVIOUSELY LOADED IN PLAYER SCREEN(FROM ASYNC STORAGE)

    let previousAudio = await AsyncStorage.getItem("previousAudio"); //from audiosyncronization.js
    let currentAudio;
    let currentAudioIndex;

    if (previousAudio === null) {
      ///running audi for the 1st tym
      currentAudio = this.state.audioFiles[0];
      currentAudioIndex = 0;
    } else {
      previousAudio = JSON.parse(previousAudio);
      currentAudio = previousAudio.audio;
      currentAudioIndex = previousAudio.index;
    }

    this.setState({ ...this.state, currentAudio, currentAudioIndex });
  };

  getPermission = async () => {
    // {
    //"canAskAgain":true,
    //"expires":"never",
    //"granted":false,
    //"status":"undetermined",
    // }
    const permission = await MediaLibrary.getPermissionsAsync();
    if (permission.granted) {
      this.getAudioFiles();
      //we want to get all the audio file
    }

    if (!permission.canAskAgain && !permission.granted) {
      this.serState({ ...this.state, permissionError: true });
    }
    if (!permission.granted && permission.canAskAgain) {
      const {
        status,
        canAskAgain,
      } = await MediaLibrary.requestPermissionsAsync();
      if (status === "denied" && canAskAgain) {
        this.permissionAllert();
        //we are going to show one alert that user must allow the permission to work this app
      }
      if (status === "granted") {
        this.getAudioFiles();
        //we want to get all the audio file
      }
      if (status === "denied" && !canAskAgain) {
        this.serState({ ...this.state, permissionError: true });
        // display some error to the user
      }
    }
  };

  OnPlaybackStatusUpdate = async (playbackStatus) => {
    //regularly call the update status
    // console.log(playbackStatus);
    if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
      this.updateState(this, {
        playbackPosition: playbackStatus.positionMillis,
        playbackDuration: playbackStatus.durationMillis,
      });
    }

    if (playbackStatus.didJustFinish) {
      const nextAudioIndex = this.state.currentAudioIndex + 1;
      //--------------------------play song in sequence-----------------------//
      if (nextAudioIndex >= this.totalAudioCount) {
        //------------IF THERE HAVE NO AUDIO TO PLAY THAT MEANS THE CURRENT AUDIO IS THE LAST-------------------//
        //----------------------After Compliting the all the listed song the next song will turn to the 1st------------------------//
        this.state.playbackObject.unloadAsync(); //stop playing
        this.updateState(this, {
          soundObject: null,
          currentAudio: this.state.audioFiles[0],
          isPlaying: false,
          currentAudioIndex: [0],
          playbackPosition: null,
          playbackDuration: null,
        });

        return await storeAudioForNextOpening(this.state.audioFiles[0], 0);
      }

      
      //OTHERWISE WE WILL SELECT NEXT AUDIO 
      const audio = this.state.audioFiles[nextAudioIndex];
      const status = await playNext(this.state.playbackObject, audio.uri);
      this.updateState(this, {
        soundObject: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: nextAudioIndex,
      });
      await storeAudioForNextOpening(audio, nextAudioIndex);
    }
  };

  componentDidMount() {
    this.getPermission();
    if (this.state.playbackObject === null) {
      this.setState({ ...this.state, playbackObject: new Audio.Sound() });
    }
  }

  updateState = (previousState, newState = {}) => {
    this.setState({ ...previousState, ...newState });
  };
  render() {
    const {
      audioFiles,
      playList,
      addToPlayList,
      dataProvider,
      permissionError,
      playbackObject,
      soundObject,
      currentAudio,
      isPlaying,
      currentAudioIndex,
      playbackPosition,
      playbackDuration,
    } = this.state;
    if (permissionError) return;
    <View
      style={{
        flex: 1,
        backgroundColor: "#473",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 26, textAlign: "center", color: "red" }}>
        you haven't accept the permission.
      </Text>
    </View>;
    return (
      <AudioContext.Provider
        value={{
          audioFiles,
          playList,
          addToPlayList,
          dataProvider,
          playbackObject,
          soundObject,
          currentAudio,
          isPlaying,
          currentAudioIndex,
          totalAudioCount: this.totalAudioCount, //it will be use in player section
          playbackPosition,
          playbackDuration,

          updateState: this.updateState,
          loadPreviousAudio: this.loadPreviousAudio,
          OnPlaybackStatusUpdate: this.OnPlaybackStatusUpdate,
        }}
      >
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}

export default AudioProvider;
