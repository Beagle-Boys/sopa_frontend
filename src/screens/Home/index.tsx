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
    ActivityIndicator,
    AsyncStorage,
} from "react-native";
import styles from "./styles";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAuthContext } from "../../context/AuthContext";
import { TextInput } from "react-native-gesture-handler";
import MapboxGL from "@react-native-mapbox-gl/maps";
import FloatingCard from "../../components/FloatingCard";
import { useTabContext } from "../../context/TabContext";
import Animated, {
    FadeIn,
    FadeOut,
    SlideInDown,
    SlideInUp,
    SlideOutDown,
} from "react-native-reanimated";
import AsyncStorageLib from "@react-native-async-storage/async-storage";

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
    const [userLocation, setUserLocation] = useState<null | boolean>();
    const { spot_insert_review, logout, spot_getall, spot_search, spot_getById, user_details_fetch, is_bookmark, bookmarks_fetch } = useAuthContext();
    const [spotLocation, setSpotLocation] = useState<Array<any> | null>(null);
    const [searchText, setSearchText] = useState<string>("");
    const [spotInfo, setSpotInfo] = useState<{} | null>();
    const [camLocation, setCamLocation] = useState<Array<number>>();
    const [loadingSpotInfo, setLoadingSpotInfo] = useState(false);
    const [showReview, setShowReview] = useState(false);

    const renderLocationPoints = async () => {
        setUserLocation(false);
        console.log("render location points ==== START ====");
        console.log(location.latitude);
        const spots = await spot_getall({
            latitude: location.latitude,
            longitude: location.longitude,
            // altitude: location.altitude,
            altitude: 0,
        });
        if (spots[0]?.address == null) {
            Alert.alert(`${spots.length} spot(s) are found nearby`);
            console.log("render location points ==== END ====");
            return;
        }
        setSpotLocation(spots);
        // console.log("Spots Home : ");
        // console.log(spots);
        console.log("render location points ==== END ====");
    };

    const flyToUserLocation = async () => {
        setZoom((prev) => (prev != 14 ? 14 : 13));
        console.log(
            "moving to user location " + location.longitude + " " + location.latitude
        );
        // console.log("cam location" + camLocation);
        // setCamLocation([location.latitude, location.longitude]);
        const { latitude, longitude } = location;
        setCamLocation([latitude, longitude]);
        // setCamLocation([-122.400021, 37.789085]);
    };
    const rentScreen = () => {
        props.navigation.navigate("Rent", {
            spotId: spotInfo?.spotId,
            name: spotInfo?.address?.data,
        });
    };
    const inputBox = useRef(null);
    const [searchSugg, setSearchSugg] = useState([]);
    const map = useRef(null);
    const [zoom, setZoom] = useState(14);

    const [bookmark, setBookmark] = useState(false);
    const [reviewText, setReviewText] = useState();

    const onRegionDidChange = () => {
        map?.current.getCenter().then((res) => {
            // setCamLocation(res);
            // console.log(res);
        });
    };
    useEffect(() => {
        user_details_fetch();
        bookmarks_fetch();
    }, []);
    return (
        <>
            <View style={styles.container}>
                {/*       <View style={{ height: height, width: width }}> */}

                <MapboxGL.MapView
                    // onRegionDidChange={onRegionDidChange}
                    // ref={map}
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
                    <MapboxGL.UserLocation
                        showsUserHeadingIndicator={true}
                        renderMode={"native"}
                        onUpdate={(loc) => {
                            setLocation(loc.coords);
                            setCurCords(loc.coords);
                            if (userLocation == null && location.latitude != undefined) {
                                renderLocationPoints().then(() => setUserLocation(true));
                            }
                        }}
                    />

                    <MapboxGL.Camera
                        // ref={camera}
                        zoomLevel={zoom}
                        maxZoomLevel={19}
                        animationDuration={6000}
                        followUserMode={"normal"}
                        followUserLocation={true}
                        animationMode={"flyTo"}
                        // followUserMode={"compass"}
                        centerCoordinate={
                            camLocation
                                ? camLocation
                                : [location.latitude, location.longitude]
                        }
                    />
                    <MapboxGL.PointAnnotation
                        id="1"
                        title="no"
                        coordinate={[77.2658739, 28.6369355]}
                        onSelected={() => {
                            setSpotInfo(null);
                            setTestLocation(true);
                        }}
                    />
                    {spotLocation &&
                        spotLocation.map((x, y) => {
                            // console.log("spot :" + x);
                            if (x.address != null)
                                return (
                                    <MapboxGL.PointAnnotation
                                        key={y}
                                        id={x.spotId}
                                        title={x?.address.data.name}
                                        coordinate={[
                                            x?.address.location.longitude,
                                            x?.address.location.latitude,
                                        ]}
                                        onSelected={async () => {
                                            setLoadingSpotInfo(true);
                                            console.log("Location Point Pressed" + x.address.data);
                                            await is_bookmark(x?.spotId).then((s) => {
                                                if (s == "true")
                                                    setBookmark(true)
                                                else
                                                    setBookmark(false)
                                            })
                                            spot_getById(x?.spotId).then((s) => {
                                                setSpotInfo(s);
                                                setLoadingSpotInfo(false);
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
                        zIndex: 3,
                        elevation: 3,
                    }}
                ></Pressable>
            ) : null}
            {testLocation ? (
                <FloatingCard
                    rentScreen={rentScreen}
                    spotInfo={spotInfo}
                    setShowReview={setShowReview}
                    bookmark={bookmark}
                    full={false}
                />
            ) : null}
            {loadingSpotInfo ? (
                <Animated.View
                    entering={SlideInDown}
                    exiting={SlideOutDown}
                    style={{
                        position: "absolute",
                        zIndex: 3,
                        elevation: 3,
                        alignSelf: "center",
                        bottom: 0,
                        marginVertical: 30,
                        backgroundColor: "white",
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 9,
                        borderWidth: 1,
                        borderColor: "#eee",
                        flexDirection: "row",
                    }}
                >
                    <ActivityIndicator />
                    <Text style={{ fontSize: 16, marginLeft: 5 }}>
                        {"Loading Spot's Info"}
                    </Text>
                </Animated.View>
            ) : null}
            {userLocation == false ? (
                <Animated.View
                    entering={SlideInDown}
                    exiting={SlideOutDown}
                    style={{
                        position: "absolute",
                        zIndex: 3,
                        elevation: 3,
                        alignSelf: "center",
                        bottom: 0,
                        marginVertical: 30,
                        backgroundColor: "white",
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 9,
                        borderWidth: 1,
                        borderColor: "#eee",
                        flexDirection: "row",
                    }}
                >
                    <ActivityIndicator />
                    <Text style={{ fontSize: 16, marginLeft: 5 }}>Loading All Spots</Text>
                </Animated.View>
            ) : null}

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
                        !testLocation ? { zIndex: 3 } : null,
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
                        placeholder="Search Location"
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
                                        setLoadingSpotInfo(true);
                                        console.log(spotInfo?.spotId);
                                        console.log(x?.spotId);
                                        if (spotInfo?.spotId != x?.spotId)
                                            spot_getById(x?.spotId).then((s) => {
                                                setSpotInfo(s);
                                                setTestLocation(true);
                                                setLoadingSpotInfo(false);
                                            });
                                        else {
                                            setTestLocation(true);
                                            setLoadingSpotInfo(false);
                                        }
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
            {!testLocation && (
                <View
                    style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                    }}
                >
                    <Pressable
                        style={{
                            height: 48,
                            width: 48,
                            padding: 10,
                            backgroundColor: "#000",
                            margin: 10,
                            borderRadius: 24,
                            borderColor: "#ccc",
                            borderWidth: 1.5,
                            zIndex: 3,
                            elevation: 3,
                        }}
                        onPress={() =>
                            renderLocationPoints().then(() => setUserLocation(true))
                        }
                    >
                        <Icon name="refresh" size={25} color="#fff" />
                    </Pressable>
                    <Pressable
                        style={{
                            height: 48,
                            width: 48,
                            padding: 10,
                            backgroundColor: "#000",
                            margin: 10,
                            borderRadius: 24,
                            borderColor: "#ccc",
                            borderWidth: 1.5,
                            zIndex: 3,
                            elevation: 3,
                        }}
                        onPress={() => flyToUserLocation().then(() => setCamLocation([]))}
                    >
                        <Icon name="my-location" size={25} color="#fff" />
                    </Pressable>
                </View>
            )}
            <Modal visible={showReview} transparent={true} animationType="fade">
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(100,100,100, 0.7)",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "white",
                            height: 200,
                            maxheight: height,
                            width: 300,
                            elevation: 2,
                            padding: 15,
                            borderRadius: 10,
                            justifyContent: "space-evenly",
                        }}
                    >
                        <Text style={{ fontSize: 24, textAlign: "center", marginVertical: 5 }}>
                            Post a Comment
                        </Text>
                        <TextInput
                            keyboardType="default"
                            placeholder="comment"
                            style={{ fontSize: 24, textAlign: "center" }}
                            multiline={true}
                            onChangeText={setReviewText}
                            value={reviewText}
                        />
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                marginVertical: 5
                            }}
                        >
                            <Pressable
                                style={({ pressed }) => [
                                    {
                                        borderRadius: 10,
                                        borderWidth: 2,
                                        borderColor: "black",
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                    },
                                    pressed
                                        ? {
                                            backgroundColor: "rgba(208, 52, 44, 0.6)",
                                        }
                                        : null,
                                ]}
                                onPress={() => setShowReview(false)}
                            >
                                <Text style={{ fontSize: 18 }}>CANCEL</Text>
                            </Pressable>
                            <Pressable
                                style={({ pressed }) => [
                                    {
                                        borderRadius: 10,
                                        borderWidth: 2,
                                        borderColor: "black",
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                    },
                                    pressed
                                        ? {
                                            backgroundColor: "#90ee90",
                                        }
                                        : null,
                                ]}
                                onPress={() => {
                                    spot_insert_review(spotInfo?.spotId, { "comment": reviewText, "stars": 5 }).then(() => {
                                        spot_getById(spotInfo?.spotId).then((s) => {
                                            setSpotInfo(s);
                                            setShowReview(false)
                                        });
                                    });
                                }}
                            >
                                <Text style={{ fontSize: 18 }}>POST</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default Home;
