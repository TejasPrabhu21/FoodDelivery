import {
  Text,
  View,
  ScrollView,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Octicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ItemCards from "@/components/ItemCards";
import {
  CheckIfLocationEnabled,
  GetCurrentLocation,
} from "@/app/lib/location-utils";
import { ItemData } from "@/types/type";
import ItemDetails from "@/components/ItemDetails";

const Home = () => {
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    "fetching your location ..."
  );

  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState<ItemData>();

  useEffect(() => {
    const setLocation = async () => {
      setLocationServicesEnabled(await CheckIfLocationEnabled());
      const location = await GetCurrentLocation();
      setDisplayCurrentAddress(location ?? "Location not detected ...");
    };
    setLocation();
  }, []);

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

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["25%", "62%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleClosePress = () => bottomSheetModalRef.current?.close();

  // Function to open the sheet with the selected item
  const handleItemPress = (item: ItemData) => {
    setSelectedItem(item);
    handlePresentModalPress();
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="flex-1">
        <View className="flex-1">
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

          <View className="flex flex-row items-center justify-between border border-primary-400 rounded-lg px-2 my-1 mx-3">
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

            <ItemCards items={items} onItemPress={handleItemPress} />
          </ScrollView>
        </View>

        <BottomSheetModalProvider>
          <View className="shadow-xl">
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
              enableDismissOnClose={true}
              stackBehavior="push"
            >
              <BottomSheetView>
                <TouchableOpacity
                  onPress={handleClosePress}
                  className="w-full flex items-end justify-end px-5 pb-1"
                >
                  <Octicons name="x" size={28} color={"#6c757d"} />
                </TouchableOpacity>
                <ItemDetails item={selectedItem} />
              </BottomSheetView>
            </BottomSheetModal>
          </View>
        </BottomSheetModalProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Home;
