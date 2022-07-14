import React, { Component } from "react";
import { Text, View, StyleSheet, ScrollView, Dimensions } from "react-native";
//import { greaterThan } from "react-native-reanimated";
import { AudioContext } from "../context/AudioProvider";
//import { ScrollView } from "react-native-gesture-handler";
import { RecyclerListView, LayoutProvider } from "recyclerlistview";
import AudioListItem from "../components/AudioListItem";
import Screen from "../components/Screen";
import OutModal from "../components/OutModal";
import { Audio } from "expo-av";
import { play, pause, resume, playNext } from "../decoration/audiocontroller";
import { storeAudioForNextOpening } from "../decoration/audiosyncronization";

export class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      outModalVisible: false,
      // playbackObject: null,
      //soundObject: null,
      //currentAudio: {},
    };

    this.currentItem = {};
  }
  layoutProvider = new LayoutProvider(
    (i) => "audio",
    (type, dim) => {
      switch (type) {
        case "audio":
          dim.width = Dimensions.get("window").width;
          dim.height = 70;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    },
  );
  /*OnPlaybackStatusUpdate = async (playbackStatus) => {
    //regularly call the update status
    // console.log(playbackStatus);
    if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
      this.context.updateState(this.context, {
        playbackPosition: playbackStatus.positionMillis,
        playbackDuration: playbackStatus.durationMillis,
      });
    }

    if (playbackStatus.didJustFinish) {
      const nextAudioIndex = this.context.currentAudioIndex + 1;
      //--------------------------play song in sequence-----------------------//
      if (nextAudioIndex >= this.context.totalAudioCount) {
        //------------IF THERE HAVE NO AUDIO TO PLAY THAT MEANS THE CURRENT AUDIO IS THE LAST-------------------//
        //----------------------After Compliting the all the listed song the next song will turn to the 1st------------------------//
        this.context.playbackObject.unloadAsync(); //stop playing
         this.context.updateState(this.context, {
          soundObject: null,
          currentAudio: this.context.audioFiles[0],
          isPlaying: false,
          currentAudioIndex: [0],
          playbackPosition: null,
          playbackDuration: null,
        });

        return await storeAudioForNextOpening(this.context.audioFiles[0],0);
      }

      //OTHERWISE WE WILL SELECT NEXT AUDIO
      const audio = this.context.audioFiles[nextAudioIndex];
      const status = await playNext(this.context.playbackObject, audio.uri);
      this.context.updateState(this.context, {
        soundObject: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: nextAudioIndex,
      });
      await storeAudioForNextOpening(audio, nextAudioIndex);
    }
  };*/
  handleAudioPress = async (audio) => {
    //play audio

    const {
      soundObject,
      playbackObject,
      currentAudio,
      updateState,
      audioFiles,
    } = this.context;

    if (soundObject === null) {
      //console.log(audio); //press on audio item
      const playbackObject = new Audio.Sound();
      const status = await play(playbackObject, audio.uri); //await playbackObject.loadAsync(
      //  { uri: audio.uri },
      //  { shouldPlay: true }
      //  ); //song is playing again and again from beginning

      const index = audioFiles.indexOf(audio);

      updateState(this.context, {
        currentAudio: audio,
        playbackObject: playbackObject,
        soundObject: status,
        isPlaying: true,
        currentAudioIndex: index, //for knowing which song is currently playing
      });

      playbackObject.setOnPlaybackStatusUpdate(
        this.context.OnPlaybackStatusUpdate
      );
      return storeAudioForNextOpening(audio, index);

      /* return this.setState({
        ...this.state,
        currentAudio: audio,
        playbackObject: playbackObject,
        soundObject: status,
      });*/
    }

    //  pause audio

    if (
      soundObject.isLoaded &&
      soundObject.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await pause(playbackObject);
      return updateState(this.context, {
        soundObject: status,
        isPlaying: false, //resume after using isPlaying:false
      });
      /*return this.setState({
        ...this.state,
        soundObject: status,
      });*/
    }

    //resume audio
    if (
      soundObject.isLoaded &&
      !soundObject.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await resume(playbackObject);
      /* return this.setState({
        ...this.state,
        soundObject: status,
      });*/
      return updateState(this.context, {
        soundObject: status,
        isPlaying: true, //back to play after using isPlaying:true
      });
    }

    //select another audio after resume

    if (soundObject.isLoaded && currentAudio.id !== audio.id) {
      const status = await playNext(playbackObject, audio.uri);
      const index = audioFiles.indexOf(audio);
      updateState(this.context, {
        currentAudio: audio,
        soundObject: status,
        isPlaying: true, //when we will select new song status will  isPlaying:true
        currentAudioIndex: index,
      });

      return storeAudioForNextOpening(audio, index);
    }
  };

  componentDidMount() {
    this.context.loadPreviousAudio(); //from audioprovider.js
  }

  rowRenderer = (type, item, index, extendedState) => {
    return (
      <AudioListItem
        title={item.filename}
        isPlaying={extendedState.isPlaying} //isPlaying={this.context.isPlaying}
        activeListItem={this.context.currentAudioIndex === index}
        duration={item.duration}
        onAudioPress={() => this.handleAudioPress(item)}
        onOptionPress={() => {
          this.currentItem = item; //play for current item                             //press on the song then the play screen will open
          this.setState({ ...this.state, outModalVisible: true });
        }}
      />
    ); //for passing pass audio title and duration
  };
  render() {
    return (
      //for minimizing play screen use <OutModal visible={this.state.outModalVisible} />
      <AudioContext.Consumer>
        {({ dataProvider, isPlaying }) => {
          if (!dataProvider._data.length) return null;
          //console.log(dataProvider);
          return (
            <Screen>
              <RecyclerListView
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
                extendedState={{ isPlaying }} //isPlaying function is stored
              />

              <OutModal
                onPlayPress={() => console.log("Playing Audio")}
                onPlaylistPress={() => {
                  this.context.updateState(this.context, {
                    addToPlayList: this.currentItem,
                  });
                  this.props.navigation.navigate("PlayList");
                }}
                currentItem={this.currentItem} //passing the current item details to play screen
                onClose={() =>
                  this.setState({ ...this.state, outModalVisible: false })
                }
                visible={this.state.outModalVisible}
              />
            </Screen>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#363",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default AudioList;
