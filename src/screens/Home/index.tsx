import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Pressable,
  Dimensions,
  PermissionsAndroid,
} from "react-native";
import styles from "./styles";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAuthContext } from "../../context/AuthContext";
import { TextInput } from "react-native-gesture-handler";
import MapboxGL from "@react-native-mapbox-gl/maps";
import FloatingCard from "../../components/FloatingCard";

MapboxGL.setAccessToken(
  "sk.eyJ1IjoiYW51cmFxIiwiYSI6ImNreHVsanZrYzJ1bjQycGtvdXk4dW1nZ2YifQ.GkpyynQmykNnhkdEcGN7KQ"
);

const { width, height } = Dimensions.get("window");

const geo = MapboxGL.geoUtils;

const Home = (props: any) => {
  const floatExit = () => {
    console.log("nothing");
  };
  const [location, setLocation] = useState<MapboxGL.Coordinates>([]);
  const [testLocation, setTestLocation] = useState(false);
  useEffect(() => {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ])
      .then((granted) => {
        console.log(granted);
      })
      .catch((err) => {
        console.warn(err);
      });
  }, []);
  // useEffect(() => {
  //   console.log(location.latitude, location.longitude);
  // }, [location]);
  return (
    <>
      <View style={styles.searchBar}>
        <Pressable style={styles.menuBtn}>
          <Icon name="menu" size={24} color="#000" />
        </Pressable>
        <TextInput style={styles.searchInput} placeholder="Enter Location" />
      </View>
      <View style={styles.container}>
        <View style={{ height: height, width: width }}>
          <MapboxGL.MapView
            style={{ flex: 1, marginBottom: 25 }}
            compassEnabled={true}
            compassViewPosition={3}
          >
            <MapboxGL.UserLocation
              showsUserHeadingIndicator={true}
              renderMode={"native"}
              onUpdate={(loc) => {
                setLocation(loc.coords);
              }}
            />
            <MapboxGL.Camera
              zoomLevel={10}
              maxZoomLevel={19}
              animationDuration={1000}
              followUserMode={"normal"}
              followUserLocation={true}
              // centerCoordinate={[location?.longitude, location?.latitude]}
            />
            <MapboxGL.PointAnnotation
              id="1"
              title="nooooooooooooooooooooo"
              coordinate={[77.2658739, 28.6369355]}
            ></MapboxGL.PointAnnotation>
          </MapboxGL.MapView>
          <Pressable
            style={{
              position: "absolute",
              right: 0,
              top: height / 2 - 80,
              padding: 10,
              backgroundColor: "#90EE90",
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
            }}
            onPress={() => setTestLocation(testLocation ? false : true)}
          >
            <Text style={{ fontSize: 17 }}>Card</Text>
          </Pressable>
        </View>
      </View>
      {testLocation ? <FloatingCard floatExit={floatExit} /> : null}
    </>
  );
};

export default Home;
