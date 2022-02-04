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
          <Image
            source={{ uri, width: 150, height: 150 * 2.07 }}
            key={index}
            style={{ margin: 5, borderRadius: 10 }}
          />
        ))}
      </ScrollView>
    </>
  );
};

export default ShowImages;
