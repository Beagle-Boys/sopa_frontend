import React from "react";
import { View, Text } from "react-native";
import styles from "./styles";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuthContext } from "../../context/AuthContext";

const Profile = () => {
  const {} = useAuthContext();
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* <Text style={styles.center}>Profile</Text> */}
      <Text>user data with update</Text>
    </View>
  );
};

export default Profile;
