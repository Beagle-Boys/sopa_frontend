import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    Pressable,
    Modal,
    TextInput,
    TouchableHighlight,
    Alert,
    RefreshControl,
    ActivityIndicator,
    useWindowDimensions
} from "react-native";
import { TabView, SceneMap } from 'react-native-tab-view';
import styles from "./styles";
import Tab2 from "./tab1";
import Animated, {
    FadeIn,
    FadeInLeft,
    FadeOut,
    Layout,
} from "react-native-reanimated";

import { TabController, Colors, TabControllerItemProps, Assets } from 'react-native-ui-lib';

import RazorpayCheckout from "react-native-razorpay";

import Icon from "react-native-vector-icons/AntDesign";
import FA from "react-native-vector-icons/FontAwesome";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useAuthContext } from "../../context/AuthContext";

const renderScene = SceneMap({
    first: () => <Text>wot</Text>,
    second: Tab2,
});

const Reservation = () => {
    const [state, setState] = useState(false);
    const [reserveId, setReserveId] = useState(null);
    const [reserveAmt, setReserveAmt] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const { spot_reservation_respond } = useAuthContext();

    const { spot_list_reservation_created, spot_list_reservation_raised } =
        useAuthContext();
    const [createdReservations, setCreatedReservations] = useState<[]>([]);
    const [raisedReservations, setRaisedReservations] = useState<[]>([]);
    const [fetched, setFetched] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        fetch_reservation_info().then(() => {
            setRefreshing(false);
            console.log("reservations fetched");
        });
    };
    const fetch_reservation_info = async () => {
        spot_list_reservation_created().then((r) => setCreatedReservations(r));
        spot_list_reservation_raised().then((r) => setRaisedReservations(r));
    };


    useEffect(() => {
        fetch_reservation_info().then(() => setFetched(true));
    }, [state]);
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'First' },
        { key: 'second', title: 'Second' },
    ]);
    if (!fetched)
        return (
            <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                <ActivityIndicator size={80} color="#923ed3" />
            </View>
        );
    else
        return (
            <>
                <TabController items={[{ label: 'Created Reservation' }, { label: 'Raised Reservation' }]}>
                    <TabController.TabBar />
                    <View style={{ display: "flex", flex: 1 }}>
                        <TabController.TabPage index={0}>
                            <Animated.ScrollView entering={FadeIn} exiting={FadeOut} layout={Layout} style={{ paddingHorizontal: 10, paddingTop: 10 }}>
                                {createdReservations.map((x, y) => (
                                    <View
                                        style={[
                                            {
                                                padding: 10,
                                                backgroundColor: "#b19cd966",
                                                borderRadius: 10,
                                                marginVertical: 5,
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                            },
                                            x.status == "CANCELLED" ? { opacity: 0.5 } : null,
                                        ]}
                                        key={y}
                                    >
                                        <View
                                            style={{
                                                // padding: 10,
                                                borderRadius: 10,
                                                marginVertical: 5,
                                            }}
                                        >
                                            <Text style={{ fontSize: 20, marginBottom: 10 }}>
                                                {x.name ? x.name : "Location Name"}
                                            </Text>
                                            <View style={{ flexDirection: "row", marginBottom: 10 }}>
                                                <Icon name="clockcircleo" size={16} />
                                                <Text style={{ fontSize: 18, position: "relative", bottom: 5, marginHorizontal: 5 }}>{x.timeslot.start} - {x.timeslot.end}</Text>
                                            </View>
                                            <Text style={[{ paddingHorizontal: 9, paddingVertical: 5, borderRadius: 4 }, { backgroundColor: x.status == "PENDING" ? "yellow" : x.status == "AWAITING_PAYMENT" ? "#118C4Ff1" : x.status == "CANCELLED" ? "red" : "white" }, { color: x.status == "AWAITING_PAYMENT" || "CANCELLED" ? "white" : "black" }]}>{x.status}</Text>
                                        </View>
                                        <View style={{ padding: 10 }}>
                                            <Pressable
                                                onPress={() => {
                                                    var options = {
                                                        description: "Credits towards consultation",
                                                        image: "https://i.imgur.com/3g7nmJC.png",
                                                        currency: "INR",
                                                        key: "<YOUR_KEY_ID>",
                                                        amount: "5000",
                                                        name: "Acme Corp",
                                                        order_id: "order_DslnoIgkIDL8Zt", //Replace this with an order_id created using Orders API.
                                                        prefill: {
                                                            email: "gaurav.kumar@example.com",
                                                            contact: "9191919191",
                                                            name: "Gaurav Kumar",
                                                        },
                                                        theme: { color: "#53a20e" },
                                                    };
                                                    RazorpayCheckout.open(options)
                                                        .then((data) => {
                                                            // handle success
                                                            alert(`Success: ${data.razorpay_payment_id}`);
                                                        })
                                                        .catch((error) => {
                                                            // handle failure
                                                            alert(`Error: ${error.code} | ${error.description}`);
                                                        });
                                                }}
                                            >
                                                {x.status == "AWAITING_PAYMENT" ? (
                                                    <MaterialIcons name="payment" size={30} />
                                                ) : null}
                                            </Pressable>
                                        </View>
                                    </View>
                                ))}
                            </Animated.ScrollView>
                        </TabController.TabPage>
                        <TabController.TabPage index={1}>
                            <Animated.View
                                entering={FadeInLeft}
                                exiting={FadeOut}
                                layout={Layout}
                            >

                                {/* arr.map((x, y) => (
                                        <RaisedOne />
                                        )) */}
                                {raisedReservations?.map((x, y) =>
                                    x.reservations.length > 0 ? (
                                        <RaisedReservation
                                            raisedReservations={x}
                                            setReserveId={setReserveId}
                                        />
                                    ) : null
                                )}
                            </Animated.View>
                        </TabController.TabPage>
                    </View>
                </TabController>

                {/* <ScrollView
                    style={{
                    flex: 1,
                    backgroundColor: "#fff",
                    paddingHorizontal: 20,
                    }}
                    refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    >
                    {/* <Text style={styles.center}>Reservation</Text> */}
                {/* <Icon name="heart" size={400} color="#fffc" /> */}

                {/*
                  /}

                </ScrollView> */}
                <Modal
                    visible={reserveId ? true : false}
                    transparent={true}
                    animationType="fade"
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(100,149,237, 0.5)",
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: "white",
                                height: 200,
                                width: 300,
                                elevation: 2,
                                padding: 15,
                                borderRadius: 10,
                                justifyContent: "space-evenly",
                            }}
                        >
                            <Text style={{ fontSize: 24, textAlign: "center" }}>
                                Requested Amount
                            </Text>
                            <TextInput
                                keyboardType="number-pad"
                                placeholder="Amount"
                                style={{ fontSize: 24, textAlign: "center" }}
                                onChangeText={setReserveAmt}
                                value={reserveAmt}
                            />
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-around",
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
                                    onPress={() => {
                                        setReserveId(null);
                                        setReserveAmt(null);
                                    }}
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
                                        console.log(reserveId);
                                        console.log(reserveAmt);
                                        spot_reservation_respond({
                                            reservation_id: reserveId,
                                            response: "ACCEPTED",
                                            requested_amount: reserveAmt,
                                        }).then(() => {
                                            setReserveAmt(null);
                                            setReserveId(null);
                                            setState(!state);
                                        });
                                    }}
                                >
                                    <Text style={{ fontSize: 18 }}>APPROVE</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </>
        );
};

const RaisedReservation = ({ raisedReservations, setReserveId }) => {
    return (
        <View
            style={{
                backgroundColor: "#b19cd966",
                paddingHorizontal: 10,
                borderRadius: 10,
                marginTop: 10,
                marginHorizontal: 10,
                padding: 5,
                paddingTop: 10
            }}
        >
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>{raisedReservations.name}</Text>
            {raisedReservations.reservations.map((x, y) => (
                <View
                    style={[
                        {
                            padding: 10,
                            backgroundColor: "#b19cd966",
                            borderRadius: 10,
                            marginVertical: 5,
                            flexDirection: "row",
                            justifyContent: "space-between",
                        },
                        x.status == "CANCELLED" ? { opacity: 0.5 } : null,
                    ]}
                    key={y}
                >
                    <View style={{padding: 10}}>
                        <View style={{ flexDirection: "row", marginBottom: 10 }}>
                            <Icon name="clockcircleo" size={16} />
                            <Text style={{ fontSize: 18, position: "relative", bottom: 5, marginHorizontal: 5 }}>{x.timeslot.start} - {x.timeslot.end}</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginBottom: 10 }}>
                            <FA name="rupee" size={16} />
                            <Text style={{ fontSize: 18, position: "relative", bottom: 5, marginHorizontal: 10 }}>{x.amount ? x.amount : 0}</Text>
                        </View>
                        <Text style={[{ paddingHorizontal: 9, paddingVertical: 5, borderRadius: 4 }, { backgroundColor: x.status == "PENDING" ? "yellow" : x.status == "AWAITING_PAYMENT" ? "#118C4Ff1" : x.status == "CANCELLED" ? "red" : "white" }, { color: x.status == "AWAITING_PAYMENT" || "CANCELLED" ? "white" : "black" }]}>{x.status}</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <Pressable
                            onPress={() => {
                                if (x.status == "PENDING") {
                                    setReserveId(x.reservation_id);
                                }
                            }}
                        >
                            {x.status == "wot" ? (
                                <Icon name="close" size={30} />
                            ) : x.status == "PENDING" ? (
                                <Icon name="check" size={30} />
                            ) : null}
                        </Pressable>
                    </View>
                </View>
            ))}
        </View>
    );
};

const Tab1 = () => {
    return (
        <Text style={{ fontSize: 30 }}>Tab1</Text>
    );
}

export default Reservation;
