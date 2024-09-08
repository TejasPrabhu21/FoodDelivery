import {
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import * as LocationGeocoding from "expo-location";
import { Octicons, Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

const Home = () => {
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    "fetching your location ..."
  );

  const [data, setData] = useState([]);

  useEffect(() => {
    CheckIfLocationEnabled();
    GetCurrentLocation();
  }, []);

  const CheckIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();

    if (!enabled) {
      Alert.alert(
        "Location Services not enabled",
        "Please enable your location services to continue",
        [{ text: "OK" }],
        { cancelable: false }
      );
    } else {
      setLocationServicesEnabled(true);
    }
  };

  const GetCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission not granted",
        "Allow the app to use the location service",
        [{ text: "OK" }],
        { cancelable: false }
      );
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    if (location.coords) {
      const { latitude, longitude } = location.coords;

      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const [fullAddress] = await LocationGeocoding.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      for (let item of response) {
        let address = `${fullAddress.formattedAddress}`;

        setDisplayCurrentAddress(address);
      }
    }
  };
  const items = [
    {
      id: 0,
      name: "Nandhana Palace",
      image:
        "https://b.zmtcdn.com/data/pictures/chains/3/50713/81d0735ce259a6bf800e16bb54cb9e5e.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A",
      time: "35 - 45",
      type: "Andhra",
      price: 100,
    },
    {
      id: 0,
      name: "GFC Biriyani",
      image:
        "https://b.zmtcdn.com/data/pictures/0/20844770/f9582144619b80d30566f497a02e2c8d.jpg?output-format=webp&fit=around|771.75:416.25&crop=771.75:416.25;*,*",
      time: "10 - 35",
      type: "North Indian",
      price: 150,
    },
    {
      id: 0,
      name: "Happiness Dhaba",
      image:
        "https://b.zmtcdn.com/data/reviews_photos/2f1/c66cf9c2c68f652db16f2c0a6188a2f1_1659295848.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A",
      time: "20 - 25",
      type: "North Indian",
      price: 300,
    },

    {
      id: 0,
      name: "Happiness Dhaba",
      image:
        "https://b.zmtcdn.com/data/reviews_photos/2f1/c66cf9c2c68f652db16f2c0a6188a2f1_1659295848.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A",
      time: "20 - 25",
      type: "North Indian",
      price: 250,
    },
    {
      id: 0,
      name: "Happiness Dhaba",
      image:
        "https://b.zmtcdn.com/data/reviews_photos/2f1/c66cf9c2c68f652db16f2c0a6188a2f1_1659295848.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A",
      time: "20 - 25",
      type: "North Indian",
      price: 200,
    },
  ];

  useEffect(() => {
    async function fetchData() {
      fetchData();
    }
  }, []);

  const [counts, setCounts] = useState(items.map(() => 1));
  const incrementCount = (index: number) => {
    const newCounts = [...counts];
    newCounts[index]++;
    setCounts(newCounts);
  };

  const decrementCount = (index: number) => {
    const newCounts = [...counts];
    if (newCounts[index] > 1) {
      newCounts[index]--;
    }
    setCounts(newCounts);
  };

  return (
    <SafeAreaView className="flex-1">
      <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
        <View className="flex flex-row items-center justify-between gap-3 p-3">
          <Octicons name="location" size={24} color="#E52850" />
          <View className="flex-1">
            <Text className="font-JakartaBold">Deliver To</Text>
            <Text ellipsizeMode="tail" className="text-gray-500 mt-1">
              {displayCurrentAddress}
            </Text>
          </View>
          <Link href={"/(root)/profile"}>
            <View className="flex items-center justify-center bg-primary-300  rounded-full h-10 w-10">
              <Text>T</Text>
            </View>
          </Link>
        </View>

        <View className="flex flex-row items-center justify-between border border-primary-400 rounded-lg px-2 my-2 mx-3">
          <TextInput
            className=" flex-1 p-2"
            placeholder="Search for food, hotels"
          />
          <AntDesign name="search1" size={24} color="#E52B50" />
        </View>

        <ScrollView className="bg-gray-100">
          <Text className=" text-left mx-3 font-Jakarta my-2 text-lg text-gray-600 tracking-widest">
            Explore
          </Text>

          {items?.map((item, index) => (
            <View className=" flex flex-row justify-between mx-3 mt-3 rounded-lg bg-white ">
              <View>
                <Image
                  className=" w-32 h-32 m-2 rounded-lg"
                  resizeMode="cover"
                  source={{ uri: item?.image }}
                />
              </View>
              <View className="flex-1 flex-col p-3 justify-between">
                <View>
                  <Text className="font-JakartaBold">{item?.name}</Text>
                  <Text className="font-Jakarta text-gray-600 mt-1">
                    {item?.type}
                  </Text>
                  <Text className="font-JakartaExtraBold text-xl my-2">
                    {"₹ "}
                    {item.price}
                  </Text>
                </View>

                <View className="flex flex-row gap-2 items-center justify-between">
                  <Text>
                    <AntDesign name="clockcircleo" size={14} color="black" />{" "}
                    {item?.time} mins
                  </Text>
                  <View className="flex flex-row items-center gap-2">
                    <Pressable
                      className="bg-red-200 p-1 rounded"
                      onPress={() => decrementCount(index)}
                    >
                      <AntDesign name="minus" size={16} color="black" />
                    </Pressable>
                    <Text>{counts[index]}</Text>
                    <Pressable
                      className="bg-green-200 p-1 rounded"
                      onPress={() => incrementCount(index)}
                    >
                      <AntDesign name="plus" size={16} color="black" />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Home;
