import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Octicons, AntDesign, MaterialIcons, Entypo, FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ItemCards from "@/components/ItemCards";
import { CheckIfLocationEnabled, GetCurrentLocation } from "@/app/lib/location-utils";
import { Product } from "@/types/type";
import ItemDetails from "@/components/ItemDetails";
import { supabase } from "@/lib/supabase";
import { Link, useNavigation } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";

const { width } = Dimensions.get("window");

const Home = () => {
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState("fetching your location ...");
  const [data, setData] = useState<any[] | null>(null);
  const [selectedItem, setSelectedItem] = useState<Product | undefined>();
  const [counts, setCounts] = useState<number[]>([]);
  const [fetchError, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuAnimation = useRef(new Animated.Value(-width * 0.75)).current;
  const navigation = useNavigation();
  const [visibleSheet, setVisibleSheet] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setCounts(data.map(() => 1));
    }
  }, [data]);

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

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(menuAnimation, {
      toValue: menuVisible ? -width * 0.75 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["25%", "60%"], []); 

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleCloseSheet = () => {
    setVisibleSheet(false);
    bottomSheetModalRef.current?.dismiss();
  };

  const handleItemPress = (item: Product) => {
    setSelectedItem(item);
    setVisibleSheet(true);
  };

  useEffect(() => {
    if (visibleSheet) {
      handlePresentModalPress();
    }
  }, [visibleSheet]);

  const filteredData = data?.filter(item =>
    item.Product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { handleSignOut } = useAuth();

  const handleTouchOutsideMenu = () => {
    if (menuVisible) {
      toggleMenu();
    }
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="flex-1">
        {/* Side Menu */}
        <Animated.View
          className="absolute left-0 top-0 bottom-0 bg-white z-50 pt-12 px-4"
          style={{ transform: [{ translateX: menuAnimation }], width: width * 0.65 }}
        >
          <TouchableOpacity onPress={toggleMenu} className="pl-4">
            <Octicons name="x" size={28} color="#ca681c" />
          </TouchableOpacity>

          {/* Profile */}
          <Link href="/profile" asChild>
            <TouchableOpacity className="flex-row items-center py-4">
              <FontAwesome name="user" size={24} color="#ca681c" />
              <Text className="text-lg ml-4">Profile</Text>
            </TouchableOpacity>
          </Link>

          {/* Cart */}
          <Link href="/cart" asChild>
            <TouchableOpacity className="flex-row items-center py-4">
              <AntDesign name="shoppingcart" size={24} color="#ca681c" />
              <Text className="text-lg ml-4">Cart</Text>
            </TouchableOpacity>
          </Link>

          {/* Orders */}
          <Link href="/(root)/(tabs)/orders" asChild>
            <TouchableOpacity className="flex-row items-center py-4">
              <MaterialIcons name="receipt" size={24} color="#ca681c" />
              <Text className="text-lg ml-4">Orders</Text>
            </TouchableOpacity>
          </Link>

          {/* Contact */}
          <Link href="/contact" asChild>
            <TouchableOpacity className="flex-row items-center py-4">
              <Entypo name="phone" size={24} color="#ca681c" />
              <Text className="text-lg ml-4">Contact</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            className="flex-row items-center absolute bottom-8 left-4"
            onPress={handleSignOut}
          >
            <AntDesign name="logout" size={24} color="#ca681c" />
            <Text className="text-lg ml-4">Sign Out</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Main Content */}
        <TouchableWithoutFeedback onPress={handleTouchOutsideMenu}>
          <View className="flex-1">
            <View className="flex-row items-center justify-between gap-3 p-4">
              <TouchableOpacity onPress={toggleMenu}>
                <Octicons name="three-bars" size={24} color="#ca681c" />
              </TouchableOpacity>
              <View className="flex-1 pl-5">
                <Text className="font-bold">Deliver To</Text>
                <Text className="text-gray-500 mt-1">{displayCurrentAddress}</Text>
              </View>
              <Link href="/cart" asChild>
                <TouchableOpacity className="px-3 py-2 rounded-md bg-red-500 mt-5">
                  <Text className="text-white font-bold">Go to Cart</Text>
                </TouchableOpacity>
              </Link>
            </View>

            <View className="flex-row items-center justify-between border border-primary-400 rounded-lg px-2 mx-3 my-2">
              <TextInput
                className="flex-1 p-2"
                placeholder="Search for food, hotels"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <AntDesign name="search1" size={24} color="#E52B50" />
            </View>

            <ScrollView className="bg-gray-100">
              <Text className="mx-3 text-lg text-gray-600 tracking-wide my-2">
                Explore
              </Text>

              {/* Use filtered data to display products */}
              {filteredData && 
                filteredData.map((item) => (
                  <ItemCards
                    key={item.id}
                    item={{
                      id: item.id,
                      name: item.Product_name,
                      image: `https://qjvdrhwtxyceipxhqtdd.supabase.co/storage/v1/object/public/Product_image/Image/${item.id}.jpg`,
                      time: "",
                      type: item.Product_weight + "g",
                      price: item.Product_price,
                    }}
                    onItemPress={handleItemPress}
                  />
                ))
              }
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>

        {visibleSheet && (
          <BottomSheetModalProvider>
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
              onDismiss={handleCloseSheet}
              enableDismissOnClose={true}
              enablePanDownToClose={true}
            >
              <BottomSheetView className="shadow-xl">
                <TouchableOpacity onPress={handleCloseSheet} className="w-full flex items-end px-5 pb-1">
                  <Octicons name="x" size={28} color="#6c757d" />
                </TouchableOpacity>
                {selectedItem && <ItemDetails item={selectedItem} />}
              </BottomSheetView>
            </BottomSheetModal>
          </BottomSheetModalProvider>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Home;
