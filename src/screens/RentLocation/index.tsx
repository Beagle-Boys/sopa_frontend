import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import styles from "./styles";
import DatePicker from "react-native-date-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
  Layout,
} from "react-native-reanimated";

const StarredLocation = (props) => {
  // useEffect(() => {
  //   props.route.params[0]((prev) => !prev);
  // });
  const curDate = useRef(new Date());

  const [fromDate, setFromDate] = useState<Date | null>(new Date());
  const [toDate, setToDate] = useState<Date | null>(new Date());

  const [calNo, setCalNo] = useState(0);

  const [selDate, setSelDate] = useState(false);
  // useEffect(() => {
  //   maxDate.setDate(curDate.current.getDate() + 2);
  //   console.log(maxDate);
  //   setMaxDate(maxDate);
  // }, []);
  const calToggle = (n: number) => {
    setSelDate(!selDate);
    setCalNo(n);
  };
  const getDiffStr = () => {
    const days = parseInt((toDate - fromDate) / (1000 * 60 * 60 * 24));
    const hours = parseInt(
      (Math.abs(toDate - fromDate) / (1000 * 60 * 60)) % 24
    );
    const minutes = parseInt(
      (Math.abs(toDate.getTime() - fromDate.getTime()) / (1000 * 60)) % 60
    );
    let res;
    if (days) res = days + " days " + hours + " hrs " + minutes + " mins";
    else res = hours + " hrs " + minutes + " mins";

    return res;
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Text style={styles.center}>Reserve</Text>
      <View
        style={{
          // backgroundColor: "#aaa",
          display: "flex",
          alignItems: "center",
          marginVertical: 20,
        }}
      >
        <Text style={{ fontSize: 21 }}>
          From : {fromDate ? fromDate.toDateString() : null}
        </Text>
        <Pressable onPress={() => calToggle(1)}>
          <View
            style={{ padding: 10, backgroundColor: "#ccc", borderRadius: 10 }}
          >
            <Icon name="calendar" size={20} />
          </View>
        </Pressable>
        <Text style={{ fontSize: 21, marginTop: 20 }}>
          To : {toDate ? toDate.toDateString() : null}
        </Text>
        <Pressable
          onPress={() => calToggle(2)}
          disabled={fromDate ? false : true}
        >
          <View
            style={{ padding: 10, backgroundColor: "#ccc", borderRadius: 10 }}
          >
            <Icon name="calendar" size={20} />
          </View>
        </Pressable>
      </View>
      {selDate ? (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
        >
          <DatePicker
            date={calNo == 1 ? fromDate : toDate}
            minimumDate={calNo == 1 ? curDate.current : fromDate}
            mode="datetime"
            minuteInterval={30}
            onDateChange={calNo == 1 ? setFromDate : setToDate}
            // maximumDate={curDate.current}
          />
        </Animated.View>
      ) : null}
      {fromDate?.getTime() != toDate?.getTime() &&
      fromDate?.getTime() < toDate?.getTime() ? (
        <Animated.Text
          entering={FadeInDown}
          exiting={FadeOutDown}
          layout={Layout}
          style={{ textAlign: "center", fontSize: 24 }}
        >
          {getDiffStr()}
        </Animated.Text>
      ) : null}
      <Animated.View
        style={{
          display: "flex",
          alignSelf: "center",
          position: "absolute",
          bottom: 100,
        }}
      >
        <Pressable>
          <View style={{ backgroundColor: "#a4c" }}>
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}
            >
              Send Request
            </Text>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default StarredLocation;
