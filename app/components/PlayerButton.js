import React from "react";
//import { View, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import color from "../decoration/color";

const PlayerButton = (props) => {
  const { iconType, size = 40, iconColor = "#168099", onPress } = props;

  const getIconName = (type) => {
    switch (type) {
      case "PLAY": //<AntDesign name="play" size={24} color="black" />
        return "pausecircle";
      case "PAUSE": //<AntDesign name="pausecircle" size={24} color="black" />
        return "play";
      case "NEXT": //<AntDesign name="forward" size={24} color="black" />;
        return "forward";
      case "PREVIOUS": //<AntDesign name="banckward" size={24} color="black" />
        return "banckward";
    }
  };
  return (
    <AntDesign
    {...props}
      onPress={onPress}
      name={getIconName(iconType)}
      size={size}
      color={iconColor}
    />
  );
};

export default PlayerButton;
