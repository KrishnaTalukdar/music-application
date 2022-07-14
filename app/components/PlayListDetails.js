import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import AudioListItem from "./AudioListItem";

const PlaylistDetails = ({ visible, playList, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{playList.title}</Text>
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={playList.audios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginLeft: 20 }}>
              <AudioListItem title={item.filename} duration={item.duration} />
            </View>
          )}
        />
      </View>
      <View style={[StyleSheet.absoluteFillObject, styles.modalbg]} />
    </Modal>
  );
};

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    height: height - 270,
    width: width - 25,
    marginTop: 50,
    marginBottom: 50,
    backgroundColor: "rgba(44, 145, 87, 0.2)",
    borderRadius: 15,
  },

  modalbg: {},

  listContainer: {
    padding: 20,
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
    paddingVertical: 4,
    color: "rgb(98,90,189)",
  },
});
export default PlaylistDetails;
