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
import { useAuthContext } from "../../context/AuthContext";

const StarredLocation = (props) => {
  // useEffect(() => {
  //   props.route.params[0]((prev) => !prev);
  // });
  const curDate = useRef(new Date());
  const maxDate = useRef(new Date());
  const { spot_create_reservation } = useAuthContext();

  const [fromDate, setFromDate] = useState<Date | null>(new Date());
  const [toDate, setToDate] = useState<Date | null>(new Date());

  const [calNo, setCalNo] = useState(0);

  const [selDate, setSelDate] = useState(false);
  const { spotId, name } = props.route.params
    ? props.route.params
    : { spotId: "abc", name: "Demo Location" };
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
    const days = parseInt(
      (toDate!.getTime() - fromDate!.getTime()) / (1000 * 60 * 60 * 24)
    );
    const hours = parseInt(
      (Math.abs(toDate!.getTime() - fromDate!.getTime()) / (1000 * 60 * 60)) %
        24
    );
    const minutes = parseInt(
      (Math.abs(toDate!.getTime() - fromDate!.getTime()) / (1000 * 60)) % 60
    );
    let res;
    if (days) res = days + " days " + hours + " hrs " + minutes + " mins";
    else res = hours + " hrs " + minutes + " mins";

    return res;
  };
  useEffect(() => {
    maxDate.current.setDate(curDate.current.getDate() + 1);
    maxDate.current.setHours(0);
    maxDate.current.setMinutes(0);
    maxDate.current.setSeconds(0);
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Text style={styles.center}>Reserve : {name.name}</Text>
      <View
        style={{
          // backgroundColor: "#aaa",
          display: "flex",
          alignItems: "center",
          marginVertical: 20,
        }}
      >
        <Text style={{ fontSize: 21 }}>
          From :
          <Text style={{ fontSize: 18, color: "#555" }}>
            {fromDate
              ? ` ${fromDate.toLocaleDateString()} ${fromDate.toLocaleTimeString(
                  "en-US",
                  { hour: "2-digit", minute: "2-digit" }
                )}`
              : null}
          </Text>
        </Text>
        <Pressable onPress={() => calToggle(1)}>
          <View
            style={{ padding: 10, backgroundColor: "#ccc", borderRadius: 10 }}
          >
            <Icon name="calendar" size={20} />
          </View>
        </Pressable>
        <Text style={{ fontSize: 21, marginTop: 20 }}>
          To :
          <Text style={{ fontSize: 18, color: "#555" }}>
            {toDate
              ? ` ${toDate.toLocaleDateString()} ${toDate.toLocaleTimeString(
                  "en-US",
                  { hour: "2-digit", minute: "2-digit" }
                )}`
              : null}
          </Text>
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
            minuteInterval={1}
            onDateChange={calNo == 1 ? setFromDate : setToDate}
            maximumDate={maxDate.current}
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
              onPress={() => {
                let start_time = fromDate;
                let end_time = toDate;
                spot_create_reservation(spotId, {
                  start: `${
                    start_time!.getHours() < 10
                      ? "0" + start_time!.getHours()
                      : start_time!.getHours()
                  }${
                    start_time!.getMinutes() < 10
                      ? "0" + start_time!.getMinutes()
                      : start_time!.getMinutes()
                  }`,
                  end: `${
                    end_time!.getHours() < 10
                      ? "0" + end_time!.getHours()
                      : end_time!.getHours()
                  }${
                    end_time!.getMinutes() < 10
                      ? "0" + end_time!.getMinutes()
                      : end_time!.getMinutes()
                  }`,
                }).then(() => props.navigation.navigate("Home"));
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
