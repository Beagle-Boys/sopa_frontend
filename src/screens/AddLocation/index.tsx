import React, { useState, useEffect } from "react";
import { View, Text, Pressable, TextInput, Dimensions } from "react-native";
import styles from "./styles";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";
import { Camera } from "react-native-vision-camera";
import Icon from "react-native-vector-icons/FontAwesome";

import CameraLocation from "../../components/CameraLocation";
import ShowImages from "../../components/ShowImages";
import { useAuthContext } from "../../context/AuthContext";
import { useTabContext } from "../../context/TabContext";

const { height, width } = Dimensions.get("window");
const radio_props = [
  { label: "Public", value: 0 },
  { label: "Private", value: 1 },
];

const AddLocation = (props) => {
  const { spot_add, spot_image_add } = useAuthContext();
  const { curCords } = useTabContext();
  const [images, setImages] = useState<any>([]);
  const [valueIndex, setValueIndex] = useState<number>();

  const [showCamera, setShowCamera] = useState(false);

  const openCamera = async () => {
    console.log("TOGGLE CAMERA");
    const newCameraPermission = await Camera.requestCameraPermission().catch(
      (e) => console.log(e)
    );
    if (newCameraPermission) setShowCamera(showCamera ? false : true);
  };

  useEffect(() => {
    (async () =>
      await Camera.requestCameraPermission().then((e) => console.log(e)))();
    console.log("camera req hook");
  }, []);

  useEffect(() => {
    props.route.params.setHide(showCamera);
    // if (showCamera == false && images.length > 0) {
    //   (async () => await spot_image_add(images).then((a) => setImagesId(a)))();
    // }
  }, [showCamera]);
  const handleSubmit = async () => {
    const { latitude, longitude, altitude } = curCords;
    // data location images type
    let imagesId;
    let imagesIdP = images.map(
      ({ id_promise }) => console.log(id_promise)
      // ({ id_promise }) => id_promise
      // id_promise.then((x) => console.log(x))
    );
    console.log(typeof images[0].id_promise);

    await Promise.all(imagesIdP)
      .then(console.log)
      // .then((a) => (imagesId = a))
      .catch(() => console.log("Promise All failed"));
    // console.log(imagesId);
    // spot_add(
    //   locationName,
    //   { latitude, longitude, altitude },
    //   imagesId,
    //   valueIndex ? "PRIVATE" : "PUBLIC"
    // );
  };
  const [locationName, setLocationName] = useState("");
  const isValid =
    locationName.length != 0 && valueIndex != null && images.length != 0;

  return (
    <View style={{ backgroundColor: "#FFF", flex: 1, zIndex: 0 }}>
      <Text style={styles.center}>Add Location Page</Text>
      <TextInput
        placeholder="Location Name"
        style={styles.textInp}
        onChangeText={setLocationName}
        value={locationName}
      />
      {/* <Text>{curCords ? JSON.stringify(curCods) : "no"}</Text> */}
      <RadioForm
        formHorizontal={true}
        animation={true}
        style={styles.radioForm}
      >
        {radio_props.map((obj, i) => (
          <RadioButton labelHorizontal={true} key={i}>
            {/*  You can set RadioButtonLabel before RadioButtonInput */}
            <View>
              <RadioButtonInput
                obj={obj}
                index={i}
                isSelected={valueIndex === i}
                borderWidth={3}
                buttonInnerColor={"#008081"}
                buttonOuterColor={valueIndex === i ? "#008081" : "#444"}
                buttonSize={18}
                buttonOuterSize={30}
                buttonStyle={{}}
                buttonWrapStyle={{ marginLeft: 10 }}
                onPress={(value: number) => {
                  setValueIndex(value);
                }}
              />
              <RadioButtonLabel
                obj={obj}
                index={i}
                labelHorizontal={true}
                labelStyle={{ fontSize: 18, color: "#000", marginTop: 5 }}
                labelWrapStyle={{}}
                onPress={(value: number) => {
                  setValueIndex(value);
                }}
              />
            </View>
          </RadioButton>
        ))}
      </RadioForm>
      <Pressable
        style={{
          backgroundColor: "#ddd",
          width: 150,
          alignSelf: "center",
          paddingVertical: 5,
          flexDirection: "row",
          justifyContent: "center",
          borderRadius: 10,
          elevation: 2,
        }}
        onPress={openCamera}
      >
        <Text style={{ fontSize: 20, textAlign: "center" }}>add photos</Text>
        <Icon
          name="camera"
          size={20}
          style={{
            position: "relative",
            top: 3,
            marginHorizontal: 3,
          }}
        />
      </Pressable>
      {showCamera ? (
        <View style={{ position: "absolute" }}>
          <CameraLocation
            images={images}
            setImages={setImages}
            setShowCamera={setShowCamera}
          />
        </View>
      ) : images.length == 0 ? null : (
        <ShowImages images={images} />
      )}
      <Pressable
        onPress={handleSubmit}
        style={[
          styles.submitBtn,
          !isValid ? { backgroundColor: "#ccc" } : null,
          showCamera ? { height: 0 } : null,
        ]}
        disabled={!isValid}
      >
        <Text style={styles.submitBtnText}>Add Location</Text>
      </Pressable>
    </View>
  );
};

export default AddLocation;
