import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Dimensions,
  Alert,
  ToastAndroid,
  Keyboard,
  ScrollView,
  Image
} from "react-native";
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
import { Button, Incubator } from "react-native-ui-lib";

const { height, width } = Dimensions.get("window");
const radio_props = [
  { label: "Public", value: 0 },
  { label: "Private", value: 1 },
];

const AddLocation = (props) => {
  const { spot_add, spot_image_add } = useAuthContext();
  const { curCords } = useTabContext();
  const [images, setImages] = useState<any>([]);
  const [valueIndex, setValueIndex] = useState<number | null>(null);

  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [imgId, setImgId] = useState<[]>([]);

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
    // let imagesId;
    // let imagesIdP = images.map(
    // ({ id_promise }) => console.log(id_promise)
    // ({ id_promise }) => id_promise
    // id_promise.then((x) => console.log(x))
    // );
    // console.log(typeof images[0].id_promise);

    // await Promise.all(imagesIdP)
    // .then(console.log)
    // .then((a) => (imagesId = a))
    // .catch(() => console.log("Promise All failed"));
    // console.log(imagesId);
    let imagesId = imgId.map((x) => x[0]);
    console.log("imgId" + imgId);
    console.log("image Id" + imagesId);
    if (imagesId.length != images.length) Alert.alert("Image Still Uploading");
    // console.log(imagesId);
    // console.log("handle Submit ids " + imgId);
    spot_add(
      {"name":locationName,"address":locationAddress},
      { latitude, longitude, altitude },
      imagesId,
      valueIndex ? "PRIVATE" : "PUBLIC"
    ).then(() => {
      setValueIndex(null);
      setLocationName("");
      setLocationAddress("");
      setImages([]);
      setImgId([]);
    });
  };
  useEffect(() => {
    console.log("use effect imgid : " + imgId);
    console.log(
      "length imgId " + imgId.length + " length of imgs " + images.length
    );
    if (imgId.length != 0)
      ToastAndroid.show("Uploaded " + imgId?.length + " of "+ images.length, ToastAndroid.SHORT);
  }, [imgId]);
  const isValid =
    locationName.length != 0 && valueIndex != null && images.length != 0; //&&
  // imgId?.length == images.length;

  return (
    <View style={{ backgroundColor: "#FFF", flex: 1, zIndex: 0 }}>
      <Text style={styles.center}>Add Location Page</Text>
      <TextInput
        placeholder="Location Name"
        style={[styles.textInp, {marginBottom: 15}]}
        onChangeText={setLocationName}
        value={locationName}
      />
      <TextInput
        placeholder="Location Address"
        style={styles.textInp}
        onChangeText={setLocationAddress}
        value={locationAddress}
      multiline={true}
      />

      {/* <Text>{curCords ? JSON.stringify(curCods) : "no"}</Text> */}
      <RadioForm
        formHorizontal={false}
        animation={true}
        style={styles.radioForm}
      >
        {radio_props.map((obj, i) => (
          <RadioButton labelHorizontal={false} key={i}>
            {/*  You can set RadioButtonLabel before RadioButtonInput */}
            <View style={{flexDirection: "row"}}>
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
                  Keyboard.dismiss();
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
      <View style={{height: 180, }}>
      <ScrollView horizontal={true} centerContent={true} style={{}}>
        {images.map(({ uri }, index) => (
          <Image
            //source={{ uri, width: 150, height: 150 * 2.07 }}
            source={{ uri, width: 150, height: 150 }}
            key={index}
            style={{ margin: 5, borderRadius: 10, backgroundColor: "#f00" }}
          />
        ))}
        <Pressable onPress={()=> {
          openCamera();
          Keyboard.dismiss();
        }}>
          <View style={{width: 150, height: 150, borderWidth: 6,borderStyle: "dashed", alignItems: "center", justifyContent: "center", borderRadius: 20, borderColor: "#ccc", marginLeft: 10}}>
            <Icon name="plus" color="#ccc" size={69} />
          </View>
        </Pressable>
      </ScrollView>
      </View>

      {/* <Pressable
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
        */}
      <View style={{flexGrow: 1, justifyContent: "center"}}>
      <Button style={{marginHorizontal: 20}} disabled={!isValid} onPress={() => {
        handleSubmit();
      }}>
        <Text style={{fontSize: 20, color: "white"}}>Add Location</Text>
      </Button>

      </View>
      {/* <Pressable
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
          onPress={() => {
          openCamera();
          Keyboard.dismiss();
          }}
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
          </Pressable> */}
      {showCamera ? (
        <View style={{ position: "absolute" }}>
          <CameraLocation
            images={images}
            setImages={setImages}
            setShowCamera={setShowCamera}
            imgId={imgId}
            setImgId={setImgId}
          />
        </View>
      ) : images.length == 0 ? null : (
        <View
          style={
            imgId.length != images.length ? { opacity: 0.5 } : { opacity: 1 }
          }
        >
        </View>
      )}
    </View>
  );
};

export default AddLocation;
