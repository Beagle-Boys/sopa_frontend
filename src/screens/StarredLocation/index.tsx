import React from "react";
import { View, Text } from "react-native";
import styles from "./styles";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const StarredLocation = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Text style={styles.center}>Starred Locations List</Text>
      {/* <Icon name="heart" size={400} color="#fffc" /> */}
    </View>
  );
};

export default StarredLocation;
