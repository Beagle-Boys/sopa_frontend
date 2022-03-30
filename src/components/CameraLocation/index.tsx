import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  Dimensions,
  Animated,
  Easing,
  Image,
} from "react-native";
import {
  Camera,
  useCameraDevices,
  CameraDevice,
} from "react-native-vision-camera";
import ImageView from "react-native-image-viewing";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuthContext } from "../../context/AuthContext";

const { height, width } = Dimensions.get("window");

const CameraAdd = ({ images, setImages, setShowCamera }) => {
  const { spot_image_add } = useAuthContext();
  const Ypos = useRef(new Animated.Value(height)).current;
  const camera = useRef<Camera>(null);

  const [visible, setIsVisible] = useState(false);

  const devices = useCameraDevices();
  const device = devices.back as CameraDevice;
  // console.log(devices.back);
  const clickPhoto = async () => {
    // console.log("take photo start");
    const photo = await camera.current
      ?.takePhoto({
        qualityPrioritization: "speed",
        flash: "off",
        skipMetadata: true,
      })
      .then((p) => p)
      .catch((e) => console.error(e.stack));
    console.log(photo?.path);
    // console.log("take photo end");
    // images.push({ uri: "file://" + photo?.path });
    let img_id;
    await spot_image_add(["file://" + photo?.path]).then((id) => {
      img_id = id;
      console.log(id);
    });
    console.log("img id : " + img_id);
    console.log(typeof img_id);
    setImages([
      {
        uri: "file://" + photo?.path,
        height: photo?.height,
        width: photo?.width,
        id_promise: img_id,
      },
      ...images,
    ]);
    // console.log("height width " + height + " " + width);
  };
  useEffect(() => {
    Animated.timing(Ypos, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.back(1)),
    }).start();
  }, []);

  // useEffect(() => {
  //   images.map(({ uri }, i) => console.log(i + " ", uri));
  // }, [images]);
  return (
    <Animated.View
      style={[
        {
          height,
          width,
          zIndex: 3,
          position: "relative",
          elevation: 3,
        },
        { translateY: Ypos },
      ]}
    >
      <View style={{ flex: 1 }}>
        {devices.back != undefined ? (
          <Camera
            isActive={true}
            device={device}
            ref={camera}
            photo={true}
            style={{ flex: 1 }}
          />
        ) : (
          <View
            style={{
              flex: 1,
              backgroundColor: "#000",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 40,
              }}
            >
              No Camera detected
            </Text>
          </View>
        )}
      </View>
      <Pressable
        onPress={() => setShowCamera(false)}
        style={{
          padding: 10,
          // backgroundColor: "#2d2",
          position: "absolute",
          top: 0,
          left: 0,
          marginVertical: 15,
          marginHorizontal: 10,
        }}
      >
        <Icon name="arrow-back" size={30} color="white" />
      </Pressable>

      <Pressable
        onPress={clickPhoto}
        style={({ pressed }) => [
          {
            padding: 10,
            backgroundColor: pressed ? "white" : null,
            position: "absolute",
            bottom: 0,
            left: (width - 80) / 2,
            width: 80,
            height: 80,
            borderRadius: 80 / 2,
            borderWidth: 6,
            borderColor: "white",
            marginVertical: 20,
          },
        ]}
      />
      {images.length !== 0 && (
        <Pressable
          style={{
            backgroundColor: "#ccc",
            position: "absolute",
            bottom: 0,
            right: 0,
            borderRadius: 10,
            borderWidth: 3,
            borderColor: "#fff",
            marginVertical: 30,
            marginHorizontal: 25,
          }}
          onPress={() => {
            console.log(images.length);
            setIsVisible(true);
          }}
        >
          <Image
            source={{
              uri: "file://" + images[0].uri,
              height: 50,
              width: 50,
            }}
            style={{ borderRadius: 10 }}
          />
        </Pressable>
      )}
      {visible ? (
        <ImageView
          images={images}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
      ) : null}
    </Animated.View>
  );
};

export default CameraAdd;
