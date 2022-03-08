import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Button,
  Pressable,
  Dimensions,
  PermissionsAndroid,
  Alert,
} from "react-native";
import styles from "./styles";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAuthContext } from "../../context/AuthContext";
import { TextInput } from "react-native-gesture-handler";
import MapboxGL from "@react-native-mapbox-gl/maps";
import FloatingCard from "../../components/FloatingCard";
import { useTabContext } from "../../context/TabContext";

MapboxGL.setAccessToken(
  "sk.eyJ1IjoiYW51cmFxIiwiYSI6ImNreHVsanZrYzJ1bjQycGtvdXk4dW1nZ2YifQ.GkpyynQmykNnhkdEcGN7KQ"
);

const { width, height } = Dimensions.get("window");

const geo = MapboxGL.geoUtils;

const Home = (props: any) => {
  const camera = useRef<any>(null);
  const { setCurCords } = useTabContext();
  const [location, setLocation] = useState<MapboxGL.Coordinates>([]);
  const [testLocation, setTestLocation] = useState(false);
  const [userLocation, setUserLocation] = useState(false);
  const { logout, spot_getall } = useAuthContext();
  const [spotLocation, setSpotLocation] = useState<Array<any> | null>(null);
  // useEffect(() => {
  //   console.log(location.latitude, location.longitude);
  // }, [location]);
  useEffect(() => {
    console.log(location.latitude, location.longitude);
    return setCurCords(location);
  });
  const requestLocationPermission = async () => {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ])
      .then((granted) => {
        console.log(granted);
        setUserLocation(true);
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  const renderLocationPoints = async () => {
    console.log("rendering spots");
    console.log(location);
    const spots = await spot_getall({
      latitude: location.latitude,
      longitude: location.longitude,
      // altitude: location.altitude,
      altitude: 0,
    });
    setSpotLocation(spots);
    console.log("Spots Home : ");
    console.log(spots);
  };

  useEffect(() => {
    requestLocationPermission();
    renderLocationPoints();
  }, []);
  const createLocationPermissionAlert = () =>
    Alert.alert("Alert", "Give Persmission for Location", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          console.log("OK Pressed");
          requestLocationPermission();
        },
      },
    ]);
  const flyToUserLocation = () => {
    renderLocationPoints();
    if (!userLocation) {
      createLocationPermissionAlert();
      return;
    }
    console.log(
      "moving to user location " + location.longitude + " " + location.latitude
    );
    console.log(camera.current.props);
    camera.current.flyTo([location.longitude, location.latitude], 2500);
    // camera.current?.moveTo([location.longitude, location.latitude]);
    camera.current.zoomTo(1, 2500);
  };
  const rentScreen = () => {
    props.navigation.navigate("Rent");
  };
  return (
    <>
      <View style={styles.searchBar}>
        <Pressable
          style={[styles.menuBtn, {}]}
          onPress={() => props.navigation.toggleDrawer()}
        >
          <Icon name="menu" size={24} color="#000" />
        </Pressable>
        <TextInput
          style={[styles.searchInput, {}]}
          placeholder="Enter Location"
        />
      </View>
      <View style={styles.container}>
        {/*       <View style={{ height: height, width: width }}> */}
        <MapboxGL.MapView
          // ref={camera}
          style={{ flex: 1, marginBottom: 30 }}
          compassEnabled={true}
          compassViewPosition={3}
          logoEnabled={false}
          attributionEnabled={false}
          compassViewMargins={{ x: 10, y: 80 }}
          animated={true}
          style={{ flex: 1, flexGrow: 1 }}
          // surfaceView={true}
        >
          {userLocation && (
            <MapboxGL.UserLocation
              showsUserHeadingIndicator={true}
              renderMode={"native"}
              onUpdate={(loc) => {
                setLocation(loc.coords);
              }}
            />
          )}
          <MapboxGL.Camera
            ref={camera}
            zoomLevel={10}
            maxZoomLevel={19}
            animationDuration={1000}
            followUserMode={"normal"}
            animationMode={"flyTo"}
            // followUserMode={"compass"}
            followUserLocation={true}
            // centerCoordinate={[location?.longitude, location?.latitude]}
          />
          <MapboxGL.PointAnnotation
            id="1"
            title="nooooooooooooooooooooo"
            coordinate={[77.2658739, 28.6369355]}
          />
          {spotLocation &&
            spotLocation.map((x, y) => {
              console.log("spot :" + x);
              return (
                <MapboxGL.PointAnnotation
                  id="1"
                  title="nooooooooooooooooooooo"
                  coordinate={[
                    x.address.location.latitude,
                    x.address.location.longitude,
                  ]}
                />
              );
            })}
        </MapboxGL.MapView>
        <Pressable
          style={{
            position: "absolute",
            right: 0,
            top: height / 2 - 100,
            padding: 10,
            backgroundColor: "#90EE90",
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}
          onPress={() => setTestLocation(testLocation ? false : true)}
        >
          <Text style={{ fontSize: 17 }}>Card</Text>
        </Pressable>
        <Pressable
          style={{
            position: "absolute",
            right: 0,
            top: height / 2 - 170,
            padding: 10,
            backgroundColor: "#ff326f",
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}
          onPress={() => logout()}
        >
          <Text style={{ fontSize: 17, color: "#fff" }}>Logout</Text>
        </Pressable>

        <Pressable
          style={{
            position: "absolute",
            height: 48,
            width: 48,
            right: 0,
            bottom: 50, // MapView margin + range(0, margin of compass)
            padding: 10,
            backgroundColor: "#000",
            marginRight: 10,
            borderRadius: 24,
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            borderColor: "#ccc",
            borderWidth: 1.5,
          }}
          onPress={() => flyToUserLocation()}
        >
          <Icon name="my-location" size={25} color="#fff" />
        </Pressable>
        {/* </View> */}
      </View>
      {testLocation ? <FloatingCard rentScreen={rentScreen} /> : null}
    </>
  );
};

export default Home;
