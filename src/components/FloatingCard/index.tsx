import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  Pressable,
  TextInput,
  Linking,
  Platform,
} from "react-native";
import styles from "./styles";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCom from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import ShowImages from "../ShowImages";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  SlideInDown,
  SlideOutDown,
  Transition,
  Layout,
  withSpring,
  FadeOut,
  FadeIn,
} from "react-native-reanimated";
import {
  GestureDetector,
  Gesture,
  Directions,
} from "react-native-gesture-handler";

const { height, width } = Dimensions.get("screen");
const IMAGE_URI =
  "https://public-spot-image-bucket.s3.ap-south-1.amazonaws.com";
const FloatingCard = ({ rentScreen, spotInfo, setShowReview }) => {
  const Ypos = useRef(new Animated.Value(400)).current;
  const [cardStatus, setCardStatus] = useState(false);

  // const offset = useSharedValue(1);
  // const animatedStyles = useAnimatedStyle(() => {
  //   return { transform: [{ scale: offset.value }] };
  // });

  const genBucketURIs = () => {
    const uriImg = spotInfo?.images.map((imgId) => ({
      uri: IMAGE_URI + `/${imgId}.jpeg`,
    }));
    // console.log("Generate URIs");
    // console.log(uriImg);
    return uriImg;
  };

  const images = spotInfo
    ? genBucketURIs()
    : [
        {
          uri: "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4",
        },
        {
          uri: "https://images.unsplash.com/photo-1573273787173-0eb81a833b34",
        },
        {
          uri: "https://images.unsplash.com/photo-1569569970363-df7b6160d111",
        },
      ];

  const posts = spotInfo
    ? spotInfo.reviews
    : [
        { comment: "asd", userName: "Name Name" },
        { comment: "asd", userName: "Name Name" },
        { comment: "asd", userName: "Name Name" },
        { comment: "asd", userName: "Name Name" },
        { comment: "asd", userName: "Name Name" },
        { comment: "asd", userName: "Name Name" },
      ];
  const animateCard = () => {
    // if (!cardStatus) offset.value = withSpring(2);
    // else offset.value = withSpring(1);
    setCardStatus(!cardStatus);
  };

  return (
    // <GestureDetector
    // gesture={Gesture.Fling()
    //   .direction(Directions.UP)
    //   .onStart(() => {
    //     console.log("animation started");
    //   })
    //   .onFinalize(() => {
    //     console.log("animation finalized");
    //     animateCard();
    //   })}
    // >
    <Animated.View
      entering={SlideInDown.duration(300)}
      exiting={SlideOutDown}
      layout={Layout.duration(300).springify().mass(0.5)}
      style={[
        styles.container,

        cardStatus
          ? {
              height: "100%",
              width: "100%",
              marginBottom: 0,
              borderRadius: 0,
            }
          : {
              height: "auto",
              width: "95%",
              marginBottom: 5,
              marginHorizontal: "2.5%",
              borderRadius: 5,
            },

        // animatedStyles,
        // cardStatus
        //   ? {
        //       height: "100%",
        //       width: "100%",
        //       marginHorizontal: 0,
        //       marginBottom: 0,
        //       borderRadius: 0,
        //     }
        //   : null,
      ]}
    >
      <Pressable onPress={animateCard} style={{ width: "100%" }}>
        <Text style={{ fontSize: 18, textAlign: "center" }}>
          {cardStatus ? "Down" : "Up"}
        </Text>
      </Pressable>
      <View
        style={{
          flexDirection: "row",
          width: "80%",
          justifyContent: "space-between",
          paddingVertical: 20,
        }}
      >
        <View>
          <Text style={{ fontSize: 20 }}>
            {spotInfo ? spotInfo.address.data : "Location Name"}
          </Text>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Icon name="location" size={20} color="black" />
            <Text>1 km</Text>
          </View>
        </View>
        <View
          style={[
            { display: "flex", justifyContent: "center" },
            cardStatus ? { paddingRight: 15 } : null,
          ]}
        >
          <Text
            style={[
              { color: "white", backgroundColor: "#bA3434", padding: 5 },
              spotInfo?.type == "PUBLIC"
                ? { backgroundColor: "#90ee90" }
                : null,
            ]}
          >
            {spotInfo ? spotInfo?.type : "PRIVATE"}
          </Text>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          height: height * 0.2,
        }}
      >
        <ScrollView horizontal={true} style={{ paddingStart: 10 }}>
          {images.map(({ uri }, index) => (
            <Image
              source={{ uri, width: 200, height: height * 0.2 }}
              key={index}
              style={{ marginHorizontal: 5 }}
            />
          ))}
        </ScrollView>
      </View>
      <View
        style={{
          alignSelf: "flex-start",
          paddingHorizontal: 20,
          marginTop: 20,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <MaterialCom name="clock-outline" size={20} />
          <Text style={{ marginStart: 10 }}>
            {spotInfo
              ? spotInfo?.lastActivity
              : "last visited 2 hrs ago by a SOPA user."}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Octicons name="graph" size={20} />

          <Text style={{ marginStart: 10 }}>
            {spotInfo
              ? `${spotInfo.useCount} times used by a SOPA user.`
              : "high number of user parking this hour."}
          </Text>
        </View>
      </View>
      <View
        style={[
          {
            // backgroundColor: "#ccc",
            // justifyContent: "space-between",
            // alignContent: "space-between",
            flexDirection: "row",
            paddingHorizontal: 20,
            paddingVertical: 15,
            width: "100%",
          },
          cardStatus
            ? { justifyContent: "space-between" }
            : { justifyContent: "flex-end" },
        ]}
      >
        {cardStatus ? (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: 40,
                width: 40,
                backgroundColor: "#e9e9e9",
                borderWidth: 3,
                borderColor: "#00f",
                borderRadius: 20,
              }}
            />
            <Text style={{ fontSize: 18, marginLeft: 10 }}>
              {spotInfo ? spotInfo.by.userName : "Name Name"}
            </Text>
          </Animated.View>
        ) : null}
        {spotInfo?.type == "PRIVATE" ? (
          <Pressable
            style={[
              {
                paddingHorizontal: 30,
                borderRadius: 10,
                paddingVertical: 5,
                backgroundColor: "#923ed3",
              },

              cardStatus ? { marginRight: 15 } : null,
            ]}
            onPress={() => rentScreen()}
          >
            <Text style={{ fontSize: 20, color: "#fff" }}>BOOK</Text>
          </Pressable>
        ) : null}
      </View>
      {cardStatus && (
        <Animated.View layout={Layout} exiting={FadeOut} style={{ flex: 1 }}>
          <ScrollView
            style={{ width: width, paddingHorizontal: 10 }}
            horizontal={false}
            scrollEnabled={true}
          >
            <Text style={{ fontSize: 18 }}>Reviews</Text>
            {posts.map((x, y) => (
              <View
                key={y}
                style={{
                  marginVertical: 5,
                  backgroundColor: "#e9e9e9",
                  borderRadius: 10,
                  padding: 5,
                  paddingHorizontal: 20,
                }}
              >
                <Text>{x.userName}</Text>
                <Text>{x.comment}</Text>
              </View>
            ))}
          </ScrollView>
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
            }}
          >
            {/* <TextInput
                placeholder="Write a Review"
                style={{
                flexGrow: 1,
                fontSize: 18,
                paddingHorizontal: 10,
                }}
                // multiline={true}
                /> */}
            <Pressable
              style={{
                justifyContent: "center",
                paddingHorizontal: 10,
                borderWidth: 1,
                elevation: 10,
                backgroundColor: "#fff",
                marginHorizontal: 10,
                height: 60,
                width: 60,
                borderRadius: 80,
                display: "flex",
                alignItems: "center",
              }}
              onPress={() => {
                const scheme = Platform.select({
                  ios: "maps:0,0?q=",
                  android: "geo:0,0?q=",
                });
                const latLng = `${spotInfo.address.location.latitude},${spotInfo.address.location.longitude}`;
                const label = spotInfo.address.data;
                const url = Platform.select({
                  ios: `${scheme}${label}@${latLng}`,
                  android: `${scheme}${latLng}(${label})`,
                });

                Linking.openURL(url);
              }}
            >
              <MaterialIcon name="map" size={30} />
            </Pressable>
            <Pressable
              style={{
                justifyContent: "center",
                paddingHorizontal: 10,
                display: "flex",
                alignItems: "center",
                borderWidth: 1,
                elevation: 10,
                backgroundColor: "#fff",
                margin: 10,
                height: 60,
                width: 60,
                borderRadius: 80,
              }}
              onPress={() => setShowReview(true)}
            >
              <MaterialIcon name="rate-review" size={30} />
            </Pressable>
          </View>
        </Animated.View>
      )}
    </Animated.View>
    // </GestureDetector>
  );
};

export default FloatingCard;
