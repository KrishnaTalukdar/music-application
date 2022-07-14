import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import color from "../decoration/color";
import { FontAwesome } from "@expo/vector-icons";

const getThumnailText = (filename) => filename[0];
const convertTime = (minutes) => {
  if (minutes) {
    const hrs = minutes / 60;
    const minute = hrs.toString().split(".")[0];
    const percent = parseInt(hrs.toString().split(".")[1].slice(0, 2));
    const sec = Math.ceil((60 * percent) / 100);

    if (parseInt(minute) < 10 && sec < 10) {
      return `0${minute}:0${sec}`;
    }

    if (parseInt(minute) < 10) {
      return `0${minute}:${sec}`;
    }

    if (sec < 10) {
      return `${minute}:0${sec}`;
    }

    return `${minute}:${sec}`;
  }
};

const renderPlayPauseIcon = (isPlaying) => {
  if (isPlaying)
    return (
      <Entypo name="controller-paus" size={24} color={color.ACTIVE_FONT} />
    ); //play icon
  return <FontAwesome name="play" size={24} color="black" />; //pause icon
};

const AudioListItem = ({
  title,
  duration,
  onOptionPress,
  onAudioPress,
  isPlaying,
  activeListItem,
}) => {
  return (
    <>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onAudioPress}>
          <View style={styles.leftContainer}>
            <View
              style={[
                styles.thumbnail,
                {
                  backgroundColor: activeListItem
                    ? color.ACTIVE_BG
                    : color.FONT_LIGHT,
                },
              ]}
            >
              <Text style={styles.thumbnailText}>
                {activeListItem
                  ? renderPlayPauseIcon(isPlaying) //in audiolist file
                  : getThumnailText(title)}
              </Text>
            </View>
            <View style={styles.titleContainer}>
              <Text numberOfLines={1} style={styles.title}>
                {title}
              </Text>
              <Text style={styles.timeText}>{convertTime(duration)}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.rightContainer}>
          <Entypo
            onPress={onOptionPress}
            name="dots-three-vertical"
            size={15}
            color={"#B6B5B9"}
            style={{ padding: 15 }}
          />
        </View>
      </View>
      <View style={styles.seperator} />
    </>
  );
};
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    width: width - 30,
    marginTop: 15,
    //backgroundColor: "#636363",
  },

  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    //backgroundColor: "pink",
  },
  rightContainer: {
    flexBasis: 50,
    height: 50,
    justifyContent: "center",
    //backgroundColor: "yellow",
  },
  thumbnail: {
    height: 43,
    flexBasis: 43,
    backgroundColor: "#A6b8D1",
    alignItems: "center",
    borderRadius: 24,
  },
  thumbnailText: {
    fontSize: 21,
    fontWeight: "bold",
    paddingTop: 7,
    alignItems: "center",
    color: "#0C093A",
  },
  titleContainer: {
    width: width - 140,
    paddingLeft: 10,
  },
  title: {
    fontSize: 16,
    color: "#B7B5B9",
  },
  seperator: {
    width: width - 90,
    backgroundColor: "white",
    opacity: 0.15,
    height: 0.5,
    alignSelf: "center",
    marginTop: 10,
    marginLeft: 35,
  },
  timeText: {
    fontSize: 11,
    color: color.FONT,
  },
});

export default AudioListItem;
