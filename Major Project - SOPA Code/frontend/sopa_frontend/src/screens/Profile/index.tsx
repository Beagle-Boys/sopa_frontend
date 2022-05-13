import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, Modal, TextInput, Alert } from "react-native";
import { TextField, Button, Colors } from "react-native-ui-lib";

import styles from "./styles";

import RazorpayCheckout from "react-native-razorpay";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuthContext } from "../../context/AuthContext";

import * as yup from "yup";
import { Formik } from "formik";

import FA5 from "react-native-vector-icons/FontAwesome5";

import DatePicker from "react-native-date-picker";
import { DateTimePicker } from "react-native-ui-lib";
import SvgUri from "react-native-svg-uri";

const updateValidationSchema = yup.object().shape({
    name: yup
        .string()
        .min(3, "Name must be at least 3 characters long")
        .max(20, "Name must be less than 20 characters long")
        .required("Name is Required"),
    email: yup
        .string()
        .email("Please enter valid email")
        .required("Email Address is Required"),
    address: yup.string().required("Address is required"),
});

const Profile = () => {
    const [state, setState] = useState(false);
    const [edit, setEdit] = useState(false);
    const [cal, setCal] = useState(false);

    const {
        user_details_fetch,
        user_details_update,
        logout,
        user_initiate_premium,
        user_complete_premium,
        profile_pic,
        user_detail
    } = useAuthContext();

    const [dob, setDOB] = useState<Date>(new Date(user_detail?.dob));
    const [email, setEmail] = useState(user_detail?.email );
    const [mobile, setMobile] = useState(user_detail?.mobile);
    const [address, setaddress] = useState(user_detail?.address?.data?.address || "");
    const [userName, setUserName] = useState(user_detail.userName);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        user_details_fetch().then((userR) => {
            setUser(userR);
            setDOB(new Date(userR.dob));
            setEmail(userR.email)
            setMobile(userR.mobile)
            setaddress(userR.address.data.address)
            setUserName(userR.userName)
            console.log(profile_pic);
        });
    }, [state]);
    const handleSubmit = () => {
        user_details_update({
            userName,
            address: {
                data: {
                  name: "User Address",
                    address
                },
                location: {
                    latitude: 0,
                    longitude: 0,
                    altitude: 0,
                },
            },
            dob: dob.getTime(),
            email,
          name: ""
        }).then((r)=> {
          user_details_fetch();
          setState(!state)
          Alert.alert("Profile Updated ")
        }).catch(console.log);
    }
    return (
        <>
            <View style={{ position: "absolute", right: 0, flexDirection: "row", margin: 10, padding: 5, backgroundColor: "#fff", borderRadius: 8 }}>
                <Icon name="cash" size={30} color="#118C4F" style={{ marginHorizontal: 5 }} />
                <Text style={{ fontSize: 19 }}>{user ? user?.karma : user_detail?.karma}</Text>
            </View>
            <View style={{ paddingHorizontal: 20 }}>
                <View style={{ height: 150, paddingHorizontal: 10, paddingVertical: 5, display: "flex", flexDirection: "row", alignItems: "center" }} >
                    <View style={{ height: 100, width: 100, backgroundColor: user?.type == "PREMIUM" || user_detail?.type == "PREMIUM" ? "#ffbf00" : "#A2C4E0", paddingTop: 20, paddingHorizontal: 10 }}>
                        <SvgUri svgXmlData={profile_pic} height={80} width={80} />
                    </View>
                    <View style={{ paddingHorizontal: 10, justifyContent: "center" }}>
                        <Text style={{ fontSize: 25, fontWeight: "bold" }}>{user ? user?.userName : user_detail?.userName}</Text>
                        <Text style={{ fontSize: 16 }}>{user ? user?.email : user_detail?.email}</Text>
                    </View>
                </View>


                <TextField title="Email" placeholder="email" value={email} onChangeText={setEmail} />
                <TextField title="Mobile" placeholder="mobile" value={mobile} onChangeText={setMobile} />
                <TextField title="Username" placeholder="username" value={userName} onChangeText={setUserName} />
                <TextField title="Address" placeholder="address" value={address} onChangeText={setaddress} />
                <DateTimePicker title="DOB" placeholder={'Placeholder'} mode={'date'} value={dob} onChange={setDOB} />

                <Button size={Button.sizes.large} backgroundColor={Colors.blue30} style={{ paddingVertical: 15 }} onPress={() => {
                    handleSubmit();
                }}>
                    <Text style={{ color: "white", fontSize: 20 }}>Update Profile</Text>
                </Button>

            </View>
            {/* <Pressable
              style={{
              padding: 10,
              backgroundColor: "#7f00ff",
              }}
              onPress={async () => {
              let receipt;
              var options = {
              description: "A Parking Solution",
              image: "https://i.imgur.com/3g7nmJC.png",
              currency: "INR",
              key: "rzp_test_fsOZ42zZVgdCIZ",
              amount: "5000",
              name: "SOPA",
              order_id: "order_DslnoIgkIDL8Zt", //Replace this with an order_id created using Orders API.
              prefill: {
              email: "",
              contact: "",
              name: "",
              },
              theme: { color: "#53a20e" },
              };
              await user_initiate_premium().then((r) => {
              console.log("Response from initiate premium ->");
              console.log(r);
              options.amount = r.amount;
              options.order_id = r.order_id;
              options.prefill.email = user.email;
              options.prefill.contact = user.mobile;
              options.prefill.name = user.userName;
              receipt = r.receipt;
              });
              console.log(options);
              console.log("Receipt : " + receipt);
              RazorpayCheckout.open(options)
              .then((data) => {
              console.log(":::::::::::::::");
              console.log(data);
              // handle success
              alert(`Success: ${data.razorpay_payment_id}`);
              user_complete_premium({
              razorpay_payment_id: data.razorpay_payment_id,
              razorpay_order_id: data.razorpay_order_id,
              razorpay_signature: data.razorpay_signature,
              receipt,
              })
              .then((d) => {
              setState(!state);
              console.log(d);
              })
              .catch(console.log);
              })
              .catch((error) => {
              // handle failure
              console.log(`Error: ${error.code} | ${error.description}`);
              });
              }}
              >
              <Text style={{ fontSize: 17, color: "#fff", textAlign: "center" }}>
              Get Premium
              </Text>
              </Pressable> */}

            <Modal visible={edit} animationType="fade" transparent={true}>
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
                            width: 300,
                            elevation: 2,
                            padding: 15,
                            borderRadius: 10,
                            justifyContent: "space-evenly",
                        }}
                    >
                        <Text style={{ fontSize: 24, textAlign: "center" }}>
                            Update Profile
                        </Text>
                        <Formik
                            initialValues={{
                                name: user?.name,
                                email: user?.email,
                                address: user?.address?.data,
                            }}
                            onSubmit={(values) => {
                                console.log(values);
                                user_details_update({
                                    name: values.name,
                                    address: {
                                        data: values.address,
                                        location: {
                                            latitude: 0,
                                            longitude: 0,
                                            altitude: 0,
                                        },
                                    },
                                    dob: dob ? dob?.getTime() : user.dob,
                                    email: values.email,
                                })
                                    .then(() => {
                                        setEdit(false);
                                        setState(!state);
                                        setDOB(null);
                                    })
                                    .catch(console.log);
                            }}
                            validationSchema={updateValidationSchema}
                        >
                            {({
                                handleChange,
                                handleSubmit,
                                values,
                                errors,
                                touched,
                                isValid,
                            }) => (
                                <>
                                    <View style={styles.sameLine}>
                                        <Text style={styles.labelNum}>Name : </Text>
                                        <TextInput
                                            placeholder="name"
                                            style={styles.textInp}
                                            onChangeText={handleChange("name")}
                                            value={values.name}
                                            keyboardType="default"
                                        />
                                    </View>
                                    {errors.name && touched.name && (
                                        <Text style={styles.errorBox}>{errors.name}</Text>
                                    )}
                                    <View style={styles.sameLine}>
                                        <Text style={styles.labelNum}>Email : </Text>
                                        <TextInput
                                            placeholder="email"
                                            style={styles.textInp}
                                            onChangeText={handleChange("email")}
                                            value={values.email}
                                            keyboardType="email-address"
                                        />
                                    </View>
                                    {errors.email && touched.email && (
                                        <Text style={styles.errorBox}>{errors.email}</Text>
                                    )}
                                    <View style={styles.sameLine}>
                                        <Text style={styles.labelNum}>Address : </Text>
                                        <TextInput
                                            placeholder="address"
                                            style={styles.textInp}
                                            onChangeText={handleChange("address")}
                                            value={values.address}
                                            keyboardType="default"
                                        />
                                    </View>
                                    {errors.address && touched.address && (
                                        <Text style={styles.errorBox}>{errors.address}</Text>
                                    )}

                                    <View style={styles.sameLine}>
                                        <Text style={styles.labelNum}>DOB : </Text>
                                        <Pressable
                                            style={{
                                                paddingHorizontal: 10,
                                                paddingVertical: 5,
                                                backgroundColor: "#ccc",
                                                borderRadius: 10,
                                                marginHorizontal: 30,
                                            }}
                                            onPress={() => {
                                                setCal(true);
                                            }}
                                        >
                                            {dob ? (
                                                <Text style={{ fontSize: 17 }}>
                                                    {new Date(dob).toDateString()}
                                                </Text>
                                            ) : user?.dob ? (
                                                <Text style={{ fontSize: 17 }}>
                                                    {new Date(user?.dob).toDateString()}
                                                </Text>
                                            ) : (
                                                <Icon name="calendar" size={20} />
                                            )}
                                        </Pressable>
                                    </View>
                                    {/*<BorderButton
                    onPress={handleSubmit}
                    body="Get OTP"
                    disabled={!isValid}
                    spinnerAnimation={isSubmitting}
                    />*/}
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-around",
                                            marginTop: 20,
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
                                                setEdit(false);
                                                setDOB(null);
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
                                                handleSubmit();
                                            }}
                                            disabled={!isValid}
                                        >
                                            <Text style={{ fontSize: 18 }}>UPDATE</Text>
                                        </Pressable>
                                    </View>
                                </>
                            )}
                        </Formik>
                    </View>
                </View>
            </Modal>
            <DatePicker
                modal
                open={cal}
                mode="date"
                date={new Date()}
                onConfirm={(date) => {
                    setDOB(date);
                    setCal(false);
                }}
                onCancel={() => {
                    setCal(false);
                }}
            />
        </>
    );
};

export default Profile;
