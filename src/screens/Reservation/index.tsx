import React from "react";
import { View, Text } from "react-native";
import styles from "./styles";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Reservation = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* <Text style={styles.center}>Reservation</Text> */}
      {/* <Icon name="heart" size={400} color="#fffc" /> */}
      <Text>Created Reservations</Text>
      <Text>Raised Reservations</Text>
    </View>
  );
};

export default Reservation;
