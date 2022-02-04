import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import styles from "./styles";
import SvgUri from "react-native-svg-uri";
import BorderButton from "../../components/BorderButton";
import Logo from "../../../assets/images/logo";

const Landing = (props: any) => {
  return (
    <View style={styles.container}>
      <SvgUri
        height={80}
        width={80}
        svgXmlData='<svg width="834" height="805" viewBox="0 0 834 805" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Icon_raw">
<g id="bub3" style="mix-blend-mode:darken">
<circle cx="258.5" cy="546.5" r="258.5" fill="#8433EC"/>
</g>
<g id="bub2" style="mix-blend-mode:darken">
<circle cx="575.5" cy="546.5" r="258.5" fill="#6177EF"/>
</g>
<g id="bub1" style="mix-blend-mode:darken">
<path d="M686 258.5C686 401.266 570.266 517 427.5 517C284.734 517 169 401.266 169 258.5C169 115.734 284.734 0 427.5 0C570.266 0 686 115.734 686 258.5Z" fill="#946FC4"/>
</g>
</g>
</svg>'
      />
      {/*  <View style={{ backgroundColor: "#070", height: 70, width: 70 }}>
      //   <Text>LOGO</Text>
      // </View> */}
      <View
        style={{
          marginBottom: 50,
          marginTop: 20,
        }}
      >
        <Text style={styles.signUpTitle}>SOPA</Text>
        <Text style={{ textAlign: "center", fontSize: 20 }}>
          A parking solution
        </Text>
      </View>
      <View
        style={{
          // backgroundColor: "#0b0",
          marginVertical: 45,
        }}
      >
        <BorderButton
          onPress={() => props.navigation.navigate("SignUp")}
          body="SignUp"
        />
        <BorderButton
          onPress={() => props.navigation.navigate("SignIn")}
          body="SignIn"
        />
      </View>
    </View>
  );
};

export default Landing;
