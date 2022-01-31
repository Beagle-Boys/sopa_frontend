import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import {
  Camera,
  useCameraDevices,
  CameraDevice,
} from "react-native-vision-camera";
import ImageView from "react-native-image-viewing";

const CameraAdd = ({ images, setImages }) => {
  const camera = useRef<Camera>(null);

  const [visible, setIsVisible] = useState(false);

  const devices = useCameraDevices();
  const device = devices.back as CameraDevice;
  // console.log(devices.back);
  const clickPhoto = async () => {
    console.log("take photo start");
    const photo = await camera.current
      ?.takePhoto({
        qualityPrioritization: "speed",
        flash: "off",
        skipMetadata: true,
      })
      .then((p) => p)
      .catch((e) => console.error(e.stack));
    console.log(photo?.path);
    console.log("take photo end");
    // images.push({ uri: "file://" + photo?.path });
    setImages([...images, { uri: "file://" + photo?.path }]);
  };
  // useEffect(() => {
  //   images.map(({ uri }, i) => console.log(i + " ", uri));
  // }, [images]);
  return (
    <>
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
              backgroundColor: "#C73E1D",
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
        onPress={clickPhoto}
        style={{ padding: 10, backgroundColor: "#2d2" }}
      >
        <Text>CLick Photo</Text>
      </Pressable>
      <Pressable
        style={{
          backgroundColor: "#ccc",
          padding: 10,
        }}
        onPress={() => {
          console.log(images.length);
          setIsVisible(true);
        }}
      >
        <Text>show</Text>
      </Pressable>
      {visible ? (
        <ImageView
          images={images}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
      ) : null}
    </>
  );
};

export default CameraAdd;
