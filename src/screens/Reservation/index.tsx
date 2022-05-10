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
} from "react-native";
import styles from "./styles";

import Animated, {
  FadeIn,
  FadeInLeft,
  FadeOut,
  Layout,
} from "react-native-reanimated";

import {TabController, Colors, TabControllerItemProps, Assets } from 'react-native-ui-lib';

import RazorpayCheckout from "react-native-razorpay";

import Icon from "react-native-vector-icons/AntDesign";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useAuthContext } from "../../context/AuthContext";

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

const TABS = ['Home', 'Posts', 'Reviews', 'Videos', 'Photos', 'Events', 'About', 'Community', 'Groups', 'Offers'];

  /* const generateTabItems = (fewItems = true): TabControllerItemProps[] => {
   *   const items: TabControllerItemProps[] = _.flow(tabs => _.take(tabs, fewItems ? 3 : TABS.length),
   *     (tabs: TabControllerItemProps[]) =>
   *       _.map<TabControllerItemProps>(tabs, (tab: TabControllerItemProps, index: number) => ({
   *         label: tab,
   *         key: tab,
   *         icon: index === 2 ? Assets.icons.demo.dashboard : undefined,
   *         badge: index === 5 ? {label: '2'} : undefined,
   *         leadingAccessory: index === 3 ? <Text marginR-4>{Assets.emojis.movie_camera}</Text> : undefined,
   *         trailingAccessory: index === 4 ? <Text marginL-4>{Assets.emojis.camera}</Text> : undefined
   *       })))(TABS);
   *       const addItem: TabControllerItemProps = {
   *         icon: Assets.icons.demo.add,
   *         // key: 'add',
   *         ignore: true,
   *         width: 60,
   *         // onPress: this.onAddItem
   *       };
   *
   *       return fewItems ? items : [...items, addItem];
   *     }
   */

  useEffect(() => {
    fetch_reservation_info().then(() => setFetched(true));
  }, [state]);
  if (!fetched)
    return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <ActivityIndicator size={80} color="#923ed3" />
      </View>
    );
  else
    return (
      <>
        <ScrollView
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
<TabController
          // key={key}
          // asCarousel={asCarousel}
          // selectedIndex={selectedIndex}
          // initialIndex={initialIndex}
          // onChangeIndex={this.onChangeIndex}
          items={[]}
        >
          <TabController.TabBar
            // key={key}
            // uppercase
            // indicatorStyle={{backgroundColor: 'green', height: 3}}
            // indicatorInsets={0}
            // spreadItems={!fewItems}
            // backgroundColor={fewItems ? 'transparent' : undefined}
            // labelColor={'green'}
            // selectedLabelColor={'red'}
            //labelStyle={styles.labelStyle}
            //selectedLabelStyle={styles.selectedLabelStyle}
            // iconColor={'green'}
            // selectedIconColor={'blue'}
            enableShadow
            activeBackgroundColor={Colors.$backgroundGeneralLight}
            // centerSelected={centerSelected}
          >
            {/* {this.renderTabItems()} */}
          </TabController.TabBar>
          <View>
        <TabController.TabPage index={0}>
          {/* <Tab1/> */}
        </TabController.TabPage>
        <TabController.TabPage index={1}>
          {/* <Tab2/> */}
        </TabController.TabPage>
          </View>
        </TabController>
          <Animated.View entering={FadeIn} exiting={FadeOut} layout={Layout}>
            {createdReservations.length > 0 ? (
              <Text style={{ fontSize: 28 }}>Created Reservations</Text>
            ) : null}
            {createdReservations.map((x, y) => (
              <View
                style={[
                  {
                    padding: 10,
                    backgroundColor: "#ddd",
                    borderRadius: 10,
                    marginVertical: 5,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  },
                  x.status == "CANCELLED" ? { opacity: 0.5 } : null,
                ]}
              >
                <View
                  style={{
                    // padding: 10,
                    backgroundColor: "#ddd",
                    borderRadius: 10,
                    marginVertical: 5,
                  }}
                >
                  <Text>
                    Location Name - {x.name ? x.name : "Location Name"}
                  </Text>
                  <Text>Time Range - {x.timeslot.start}</Text>
                  <Text>Created At - {x.timeslot.end}</Text>
                  <Text>Status - {x.status}</Text>
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
          </Animated.View>
          <Animated.View
            entering={FadeInLeft}
            exiting={FadeOut}
            layout={Layout}
          >
            {raisedReservations.length > 0 ? (
              <Text style={{ fontSize: 28 }}>Raised Reservations</Text>
            ) : null}
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
        </ScrollView>
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
        backgroundColor: "#eee",
        paddingHorizontal: 10,
        borderRadius: 10,
        marginTop: 10,
      }}
    >
      <Text style={{ fontSize: 22 }}>{raisedReservations.name}</Text>
      {raisedReservations.reservations.map((x, y) => (
        <View
          style={[
            {
              padding: 10,
              backgroundColor: "#ddd",
              borderRadius: 10,
              marginVertical: 5,
              flexDirection: "row",
              justifyContent: "space-between",
            },
            x.status == "CANCELLED" ? { opacity: 0.5 } : null,
          ]}
          key={y}
        >
          <View>
            <Text>Time Range - {x.timeslot.start}</Text>
            <Text>Created At - {x.timeslot.end}</Text>
            <Text>Amount - {x.amount}</Text>
            <Text>Status - {x.status}</Text>
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

export default Reservation;
