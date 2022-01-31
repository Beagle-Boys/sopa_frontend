import React, { useState, useEffect } from "react";
import { View, Text, Pressable, TextInput, Dimensions } from "react-native";
import styles from "./styles";
import { Formik } from "formik";
import * as yup from "yup";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";
import {
  Camera,
  CameraDevice,
  useCameraDevices,
} from "react-native-vision-camera";
import CameraLocation from "../../components/CameraLocation";
import ShowImages from "../../components/ShowImages";

const { height, width } = Dimensions.get("window");

const AddLocation = () => {
  const radio_props = [
    { label: "Public", value: 0 },
    { label: "Private", value: 1 },
  ];

  const [images, setImages] = useState<any>([]);

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

  return (
    <View style={{ backgroundColor: "#7FFFD4", flex: 1 }}>
      <Text style={styles.center}>Add Location Page</Text>
      <Formik
        initialValues={{ username: "", email: "", mobile: "" }}
        onSubmit={(values) => console.log(values)}
        // validationSchema={loginValidationSchema}
      >
        {({ handleChange, handleSubmit, values, errors, touched, isValid }) => (
          <>
            <TextInput
              placeholder="Location Name"
              style={styles.textInp}
              onChangeText={handleChange("username")}
              value={values.username}
            />
            {errors.username && touched.username && (
              <Text style={styles.errorBox}>{errors.username}</Text>
            )}
            <RadioForm
              style={styles.radioForm}
              radio_props={radio_props}
              initial={0}
              formHorizontal={true}
              animation={true}
              onPress={(value: number) => {
                console.log(value);
              }}
            />
            <Pressable
              style={{
                backgroundColor: "#caa",
                width: 150,
                alignSelf: "center",
              }}
              onPress={openCamera}
            >
              <Text style={{ fontSize: 20, margin: 15 }}>
                camera {showCamera ? "true" : "false"}
              </Text>
            </Pressable>
            {showCamera ? (
              <CameraLocation images={images} setImages={setImages} />
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
          </>
        )}
      </Formik>
    </View>
  );
};

export default AddLocation;
