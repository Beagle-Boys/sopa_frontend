import React from "react";
import { ScrollView, Image, Text } from "react-native";

const ShowImages = ({ images }) => {
  return (
    <>
      <Text style={{ textAlign: "center", fontSize: 16 }}>
        {images.length} photos clicked
      </Text>
      <ScrollView horizontal={true}>
        {images.map(({ uri }, index) => (
          <Image source={{ uri, width: 300, height: 200 }} key={index} />
        ))}
      </ScrollView>
    </>
  );
};

export default ShowImages;
