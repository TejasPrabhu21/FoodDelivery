import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { Octicons, AntDesign, MaterialIcons, Entypo, FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ItemCards from "@/components/ItemCards";
import { CheckIfLocationEnabled, GetCurrentLocation } from "@/app/lib/location-utils";
import { ItemData } from "@/types/type";
import ItemDetails from "@/components/ItemDetails";
import { supabase } from "@/lib/supabase";
import { Link } from "expo-router";

const { width } = Dimensions.get("window");

const Home = () => {
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState("fetching your location ...");
  const [data, setData] = useState<any[] | null>(null);
  const [selectedItem, setSelectedItem] = useState<ItemData | undefined>();
  const [counts, setCounts] = useState<number[]>([]);
  const [fetchError, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuAnimation = useRef(new Animated.Value(-width * 0.75)).current;

  useEffect(() => {
    const setLocation = async () => {
      setLocationServicesEnabled(await CheckIfLocationEnabled());
      const location = await GetCurrentLocation();
      setDisplayCurrentAddress(location ?? "Location not detected ...");
    };
    setLocation();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error, status } = await supabase.from("Product").select("*");
        if (error) throw error;
        setData(data ?? []);
        setStatus(status);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      setCounts(data.map(() => 1)); // Initialize counts with 1 for each item
    }
  }, [data]);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(menuAnimation, {
      toValue: menuVisible ? -width * 0.75 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["25%", "62%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleClosePress = () => bottomSheetModalRef.current?.close();

  const handleItemPress = (item: ItemData) => {
    setSelectedItem(item);
    handlePresentModalPress();
  };

  const filteredData = data?.filter(item =>
    item.Product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return  (
    <GestureHandlerRootView>
      <SafeAreaView className="flex-1">
        {/* Side Menu */}
        <Animated.View
          style={{
            transform: [{ translateX: menuAnimation }],
            width: width * 0.75,
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "#fff",
            zIndex: 1000,
            paddingTop: 50,
          }}
        >
          <TouchableOpacity onPress={toggleMenu} style={{ paddingLeft: 15, paddingTop: 0 }}>
            <Octicons name="x" size={28} color="#9F5216"  />
          </TouchableOpacity>

          {/* Profile */}
          <Link href="/profile" asChild>
            <TouchableOpacity onPress={toggleMenu} style={{ flexDirection: "row", alignItems: "center", padding: 20 }}>
              <FontAwesome name="user" size={24} color="#9F5216"  />
              <Text style={{ fontSize: 18, marginLeft: 10 }}>Profile</Text>
            </TouchableOpacity>
          </Link>

          {/* Cart */}
          <Link href="/profile" asChild>
            <TouchableOpacity onPress={toggleMenu} style={{ flexDirection: "row", alignItems: "center", padding: 20 }}>
              <AntDesign name="shoppingcart" size={24} color="#9F5216"  />
              <Text style={{ fontSize: 18, marginLeft: 10 }}>Cart</Text>
            </TouchableOpacity>
          </Link>

          {/* Orders */}
          <Link href="/profile" asChild>
            <TouchableOpacity onPress={toggleMenu} style={{ flexDirection: "row", alignItems: "center", padding: 20 }}>
              <MaterialIcons name="receipt" size={24} color="#9F5216"  />
              <Text style={{ fontSize: 18, marginLeft: 10 }}>Orders</Text>
            </TouchableOpacity>
          </Link>

          {/* Contact */}
          <Link href="/contact" asChild>
            <TouchableOpacity onPress={toggleMenu} style={{ flexDirection: "row", alignItems: "center", padding: 20 }}>
              <Entypo name="phone" size={24} color="#9F5216"  />
              <Text style={{ fontSize: 18, marginLeft: 10 }}>Contact</Text>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity
    style={{
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      position: "absolute",
      bottom: 30,  // Adjust as needed
      left: 20,    // Ensure it's aligned with other buttons
    }}
  ><AntDesign name="logout" size={24} color="#9F5216" />
  <Text style={{ fontSize: 18, marginLeft: 10 }}>Sign Out</Text>
</TouchableOpacity>


          
        </Animated.View>

        {/* Main Content */}
        <View className="flex-1">
          <View className="flex flex-row items-center justify-between gap-3 p-3">
            <TouchableOpacity onPress={toggleMenu}>
              <Octicons name="three-bars" size={24} color="#9F5216"  />
            </TouchableOpacity>
            <View className="flex-1 pl-5">
              <Text className="font-JakartaBold">Deliver To</Text>
                <Text ellipsizeMode="tail" className="text-gray-500 mt-1">
                {displayCurrentAddress}
              </Text>
            </View>

          </View>

          <View className="flex flex-row items-center justify-between border border-primary-400 rounded-lg px-2 my-1 mx-3">
            <TextInput
              className="flex-1 p-2"
              placeholder="Search for food, hotels"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <AntDesign name="search1" size={24} color="#E52B50" />
          </View>

          <ScrollView className="bg-gray-100">
            <Text className="text-left mx-3 font-Jakarta my-2 text-lg text-gray-600 tracking-widest">
              Explore
            </Text>

            {/* Use filtered data to display products */}
            {filteredData && (
              <ItemCards
                items={filteredData.map((item) => ({
                  id: item.id,
                  name: item.Product_name,
                  image: `https://qjvdrhwtxyceipxhqtdd.supabase.co/storage/v1/object/public/Product_image/Image/${item.id}.jpg`,
                  time: "20 - 30",
                  type: "Seafood",
                  price: item.Product_price,
                }))}
                onItemPress={handleItemPress}
              />
            )}
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
                <TouchableOpacity onPress={handleClosePress} className="w-full flex items-end justify-end px-5 pb-1">
                  <Octicons name="x" size={28} color={"#6c757d"} />
                </TouchableOpacity>
                {selectedItem && <ItemDetails item={selectedItem} />}
              </BottomSheetView>
            </BottomSheetModal>
          </View>
        </BottomSheetModalProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Home;
