import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Button,
  Pressable,
  Dimensions,
  PermissionsAndroid,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import styles from "./styles";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAuthContext } from "../../context/AuthContext";
import { TextInput } from "react-native-gesture-handler";
import MapboxGL from "@react-native-mapbox-gl/maps";
import FloatingCard from "../../components/FloatingCard";
import { useTabContext } from "../../context/TabContext";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

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
  const { logout, spot_getall, spot_search, spot_getById } = useAuthContext();
  const [spotLocation, setSpotLocation] = useState<Array<any> | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [spotInfo, setSpotInfo] = useState<{} | null>();
  // useEffect(() => {
  //   console.log(location.latitude, location.longitude);
  // }, [location]);
  // useEffect(() => {
  // console.log(location.latitude, location.longitude);
  // setCurCords(location);
  // });
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
    // console.log("Spots Home : ");
    // console.log(spots);
  };

  useEffect(() => {
    requestLocationPermission().then(() => renderLocationPoints());
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
    props.navigation.navigate("Rent", {
      spotId: spotInfo?.spotId,
      name: spotInfo?.address?.data,
    });
  };
  const inputBox = useRef(null);
  const [searchSugg, setSearchSugg] = useState([]);
  return (
    <>
      <View style={styles.searchBarPos}>
        <View
          style={[
            styles.searchBar,
            searchSugg?.length > 0 && searchText?.length > 1
              ? {
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  borderBottomWidth: 1,
                  borderColor: "#999",
                }
              : null,
          ]}
        >
          <Pressable
            style={[styles.menuBtn, {}]}
            onPress={() => props.navigation.toggleDrawer()}
          >
            <Icon name="menu" size={24} color="#000" />
          </Pressable>
          <TextInput
            ref={inputBox}
            style={[styles.searchInput, {}]}
            placeholder="Enter Location"
            onChangeText={(v) => {
              if (v.length > 2) {
                spot_search(v).then((s) => setSearchSugg(s));
              }
              setSearchText(v);
            }}
          />
          {searchText.length > 0 ? (
            <Pressable
              style={[styles.menuBtn, {}]}
              onPress={() => {
                inputBox?.current.clear();
                setSearchText("");
                setSearchSugg([]);
              }}
            >
              <Icon name="close" size={24} color="#000" />
            </Pressable>
          ) : null}
        </View>
        {searchText?.length > 2 && searchSugg?.length > 0 && (
          <Animated.View
            style={{
              backgroundColor: "#f8f8f8",
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              overflow: "hidden",
              paddingBottom: 10,
            }}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
          >
            {searchSugg?.map((x, y) => (
              <View style={{}}>
                <Pressable
                  key={y}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? "#eee" : null,
                    },
                  ]}
                  onPress={() => {
                    Keyboard.dismiss();
                    console.log(spotInfo?.spotId);
                    console.log(x?.spotId);
                    if (spotInfo?.spotId != x?.spotId)
                      spot_getById(x?.spotId).then((s) => {
                        setSpotInfo(s);
                        setTestLocation(true);
                      });
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      paddingVertical: 5,
                      paddingHorizontal: 20,
                      color: "#555",
                    }}
                  >
                    {x?.address?.data}
                  </Text>
                </Pressable>
              </View>
            ))}
          </Animated.View>
        )}
      </View>
      <Pressable
        style={{
          position: "absolute",
          bottom: 0,
          height: 48,
          width: 48,
          right: 0,
          padding: 10,
          backgroundColor: "#000",
          margin: 10,
          borderRadius: 24,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          borderColor: "#ccc",
          borderWidth: 1.5,
          zIndex: 3,
        }}
        onPress={() => flyToUserLocation()}
      >
        <Icon name="my-location" size={25} color="#fff" />
      </Pressable>

      <View style={styles.container}>
        {/*       <View style={{ height: height, width: width }}> */}

        <MapboxGL.MapView
          // ref={camera}
          style={{ flex: 1, marginBottom: 30 }}
          compassEnabled={true}
          compassViewPosition={4}
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
            onSelected={() => {
              setSpotInfo(null);
              setTestLocation(true);
            }}
          />
          {spotLocation &&
            spotLocation.map((x, y) => {
              // console.log("spot :" + x);
              return (
                <MapboxGL.PointAnnotation
                  key={y}
                  id={x.spotId}
                  title={x.address.data}
                  coordinate={[
                    x.address.location.longitude,
                    x.address.location.latitude,
                  ]}
                  onSelected={() => {
                    console.log("Location Point Pressed" + x.address.data);
                    spot_getById(x?.spotId).then((s) => {
                      setSpotInfo(s);
                      setTestLocation(true);
                    });
                  }}
                />
              );
            })}
        </MapboxGL.MapView>
        {/*
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
          onPress={() => {
            if (testLocation == false) setSpotInfo(null);
            setTestLocation(testLocation ? false : true);
          }}
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
          </Pressable> */}

        {/* </View> */}
      </View>
      {testLocation ? (
        <Pressable
          onPress={() => setTestLocation(false)}
          style={{
            position: "absolute",
            height,
            width,
          }}
        ></Pressable>
      ) : null}
      {testLocation ? (
        <FloatingCard rentScreen={rentScreen} spotInfo={spotInfo} />
      ) : null}
    </>
  );
};

export default Home;
