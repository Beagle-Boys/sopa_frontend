import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Pressable, } from "react-native";
import styles from "./styles";
import { Card } from "react-native-ui-lib"

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuthContext } from "../../context/AuthContext";
import FloatingCard from "../../components/FloatingCard";


const SpotFull = (props) => {
  const {data, bookmark} = props.route.params;
    return (
        <View style={{ flex: 1, }}>
          <FloatingCard spotInfo={data} full={true} bookmark={bookmark} />
        </View>
    );
};


export default SpotFull;
