import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import PlayListDetails from "../components/PlayListDetails";
import PlaylistModal from "../components/PlaylistModal";
import { AudioContext } from "../context/AudioProvider";
let selectedPlayList = {};

const PlayList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showPlayList, setShowPlayList] = useState(false); //for PlayListDetails.js file

  const context = useContext(AudioContext);
  const { playList, addToPlayList, updateState } = context;

  const createPlayList = async (playListName) => {
    const result = await AsyncStorage.getItem("playlist");

    if (result !== null) {
      const audios = [];
      if (addToPlayList) {
        audios.push(addToPlayList);
      }
      const newList = {
        id: Date.now(),
        title: playListName,
        audios: audios,
      };

      const updatedList = [...playList, newList];
      updateState(context, { addToPlayList: null, playList: updatedList });
      await AsyncStorage.setItem("playlist", JSON.stringify(updatedList));
    }

    setModalVisible(false);
  };

  const renderPlayList = async () => {
    const result = await AsyncStorage.getItem("playlist");
    if (result === null) {
      const defaultPlayList = {
        id: Date.now(),
        title: "My Favorite",
        audios: [],
      };

      const newPlayList = [...playList, defaultPlayList];
      updateState(context, { playList: [...newPlayList] });
      return await AsyncStorage.setItem(
        "playlist",
        JSON.stringify([...newPlayList])
      );
    }
    updateState(context, { playList: JSON.parse(result) });
  };

  useEffect(() => {
    if (!playList.length) {
      renderPlayList();
    }
  }, []);

  const handleBannerPress = async (playList) => {
    //update our playlist if there have any selectd audio
    if (addToPlayList) {
      const result = await AsyncStorage.getItem("playlist");
      let oldList = [];
      let updatedList = [];
      let sameAudio = false;

      if (result !== null) {
        oldList = JSON.parse(result);
        // console.log(oldList);
        updatedList = oldList.filter((list) => {
          if (list.id === playList.id) {
            /*comming from the item */ //we want to check same audio is inside our list or not

            for (let audio of list.audios) {
              if (audio.id === addToPlayList.id) {
                //alert with some msg

                sameAudio = true;
                return;
              }
            }
            //otherwise we wil update our playlist
            list.audios = [...list.audios, addToPlayList];
          }
          return list;
        });
      }

      if (sameAudio) {
        Alert.alert(
          "found same audio !",
          `${addToPlaylist.filename} is alread inside the list .`
        );

        sameAudio = false;
        return updateState(context, { addToPlayList: null });
      }

      updateState(context, { addToPlayList: null, playList: [...updatedList] });
      return AsyncStorage.setItem("playlist", JSON.stringify([...updatedList]));
    }

    //if no audio is selected then open the list

    //console.log("opening list");
    selectedPlayList = playList;
    setShowPlayList(true);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {playList.length
          ? playList.map((item) => (
              <TouchableOpacity
                key={item.id.toString()}
                style={styles.PlayListScreen}
                onPress={() => handleBannerPress(item)}
              >
                <Text style={styles.text}>{item.title}</Text>

                <Text style={styles.audioCount}>
                  {item.audios.length > 1
                    ? `${item.audios.length} Songs`
                    : `${item.audios.length} Song`}
                </Text>
              </TouchableOpacity>
            ))
          : null}

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{ marginTop: 18 }}
        >
          <Text style={styles.addplaylist}>+ Add New Playlist</Text>
        </TouchableOpacity>

        <PlaylistModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={createPlayList}
        />
      </ScrollView>

      <PlayListDetails
        visible={showPlayList}
        playList={selectedPlayList}
        onClose={() => setShowPlayList(false)}
      />
    </> // for PlayListDetails.js file                              //react fregment
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0C0120",
    padding: 30,
    flex: 1,
  },
  PlayListScreen: {
    padding: 5,
    backgroundColor: "rgba(44,404,304,0.09)",
    borderRadius: 7,
    marginBottom: 2,
  },
  text: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },

  audioCount: {
    color: "white",
    marginTop: 4,
    opacity: 0.6,
    fontSize: 17,
  },
  addplaylist: {
    color: "white",
    letterSpacing: 1,
    fontSize: 17,
    fontWeight: "bold",
    padding: 6,
  },
});

export default PlayList;
