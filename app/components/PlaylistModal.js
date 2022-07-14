import React, { useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  TextInput,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { greaterThan } from "react-native-reanimated";
import color from "../decoration/color";

const PlaylistModal = ({ visible, onClose, onSubmit }) => {
  const [playListName, setPlayListName] = useState("");

  const handleOnSubmit = () => {
    if (!playListName.trim()) {
      onClose();
    } else {
      onSubmit(playListName);
      setPlayListName("");
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.inputContainer}>
          <Text styles={{ color: color.ACTIVE_BG }}>create New Playlist</Text>
          <TextInput
            value={playListName}
            onChangeText={(text) => setPlayListName(text)}
            style={styles.input}
          />
          <AntDesign
            name="check"
            size={30}
            color="blue"
            style={styles.submitIcon}
            onPress={handleOnSubmit}
          />
        </View>
      </View>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[StyleSheet.absoluteFillObject, styles.modalBG]} />
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: width - 20,
    height: 150,
    borderRadius: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: width - 40,
    borderBottomWidth: 1,
    borderBottomColor: "green",
    fontSize: 18,
    paddingVertical: 5,
  },
  submitIcon: {
    padding: 0,
    backgroundColor: "pink",
    borderRadius: 10,
    marginTop: 10,
  },
  modalBG: {
    backgroundColor: "rgba(44, 145, 87, 0.2)",
    zIndex: -1,
  },
});

export default PlaylistModal;
