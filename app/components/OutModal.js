import React from "react";
import { View, Text, StyleSheet, Modal, StatusBar,TouchableWithoutFeedback } from "react-native";

import color from "../decoration/color";

//for giving hide effect of audio list

const Outmodal = ({ visible, currentItem, onClose ,onPlayPress,onPlaylistPress}) => {
    const{filename}= currentItem                           //song title
  return (
    <>
      <StatusBar hidden />

      <Modal animationType="slide" transparent visible={visible}>
        <View style={styles.modal}>
          <Text style={styles.title} numberOfLines={2}>
            {filename}
          </Text>
          <View style={styles.outContainer}>
            <TouchableWithoutFeedback onPress={onPlayPress}>
              <Text style={styles.option}>Play</Text>
            </TouchableWithoutFeedback>
             <TouchableWithoutFeedback onPress={onPlaylistPress}>
            <Text style={styles.option}>Add to Playlist</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalBackground} />
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "gray",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 1000,
  },
  outContainer: {
    padding: 20,
  },
  title: {
    // title of play / add to play screen
    fontSize: 19,
    fontWeight: "bold",
    padding: 20,
    paddingBottom: 0,
    color: "#000",
  },
  option: {
    // play && add to playlist
    fontSize: 19,
    fontWeight: "bold",
    color: "rgb(75,0,130)",
    paddingVertical: 9,
    letterSpacing: 1,
  },
  modalBackground: {
    //when play/add to play screen is open then whole backgroud will fade
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: color.MODAL_BG,
  },
});

export default Outmodal;
