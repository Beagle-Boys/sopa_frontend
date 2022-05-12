import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Pressable, } from "react-native";
import styles from "./styles";
import { Card } from "react-native-ui-lib"

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuthContext } from "../../context/AuthContext";

const IMAGE_URI =
    "https://public-spot-image-bucket.s3.ap-south-1.amazonaws.com";

const StarredLocation = (props) => {
    const { bookmarks_fetch, bookmark_list, is_bookmark } = useAuthContext();
    useEffect(() => {
        bookmarks_fetch();
    }, []);
    return (
        <View style={{ flex: 1, }}>
            <Text style={styles.center}>Starred Locations List</Text>
            <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
                {
                    bookmark_list.map((x, y) => <StarCard data={x} navigation={props.navigation} key={y} />)
                }
            </ScrollView>
            {/* <Icon name="heart" size={400} color="#fffc" /> */}
        </View>
    );
};

const StarCard = ({ data, navigation }) => {
    const { is_bookmark } = useAuthContext();
  const [bookmark, setBookmark] = useState(false);
  const [fetched, setFetched] = useState(false);
  useEffect(()=> {
                    is_bookmark(data?.spotId).then((s) => {
                        if (s == "true")
                            setBookmark(true)
                        else
                            setBookmark(false)
                      setFetched(true);
                    })

  }, []);
    const [show, setShow] = useState(false);
    return (
        <Card onPress={() => { setShow(!show) }} style={{ marginBottom: 10, padding: 10 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ marginBottom: 10, flex: 15 }}>
                    <Text style={{ fontSize: 20 }}>{data.address.data.name}</Text>
                    <Text style={{ fontSize: 18, }}>{data.address.data.address}</Text>
                </View>
                <Pressable style={{ padding: 5, flex: 1 }} onPress={() => {
                    navigation.navigate("Spot", {
                        data, bookmark
                    })
                }}>{ fetched &&
                    <Icon name="information-outline" size={20} />
                }
                </Pressable>
            </View>
            {show ?
                <View style={{ height: 120 }}>
                    <ScrollView horizontal={true}>
                        {
                            data.images.map((x, y) => <Image style={{ marginHorizontal: 5, borderRadius: 10 }} source={{ uri: IMAGE_URI + `/${x}.jpeg`, width: 100, height: 100 }} />)
                        }
                    </ScrollView>
                </View>
                :
                <Card.Section content={[{ text: 'Click for Pictures', text80: true, grey30: true }]} contentStyle={{ alignItems: 'center' }} />
            }
        </Card>
    );
}

export default StarredLocation;
