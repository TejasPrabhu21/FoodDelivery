import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Octicons, AntDesign } from "@expo/vector-icons";
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
import { createDrawerNavigator } from '@react-navigation/drawer';
import Profile from "./profile";
import Cart from "./cart";
import Orders from "./orders";
import Contact from "./contact";
import CustomDrawerContent from "@/components/CustomDrawer";
import { DrawerNavigationProp } from '@react-navigation/drawer';

const { width } = Dimensions.get("window");

type HomeScreenNavigationProp = DrawerNavigationProp<any>;

const Home = () => {
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState("fetching your location ...");
  const [data, setData] = useState<any[] | null>(null);
  const [selectedItem, setSelectedItem] = useState<Product | undefined>();
  const [counts, setCounts] = useState<number[]>([]);
  const [fetchError, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["25%", "60%"], []);
  const navigation = useNavigation<HomeScreenNavigationProp>();
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

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
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

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 ">
          <View className="p-4">
            <View className="flex-row justify-between items-center">
              <TouchableOpacity onPress={() => navigation.toggleDrawer()} className="pr-4">
                <Octicons name="three-bars" size={28} color="#ca681c" />
              </TouchableOpacity>
              <View className="flex-1 mt-2">
                <Text className="font-bold">Deliver To</Text>
                <Text className="text-gray-500 flex-wrap">
                  {displayCurrentAddress}
                </Text>
              </View>
              <Link href="/cart" asChild>
                <TouchableOpacity className="ml-2 mt-3 bg-[#E52B50] rounded-[12px] p-2">
                  <Text className="text-white font-bold">Go to Cart</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          <View className="flex-row border border-red-600 rounded-[18px] m-4 items-center  pr-2">
  <TextInput
    className="flex-1 p-2" 
    placeholder="Search...."
    value={searchQuery}
    onChangeText={setSearchQuery}
  />
  <AntDesign name="search1" size={28} color="#E52B50" className="ml-4" />
</View>




          <Text className="ml-4 text-lg text-gray-500">Explore</Text>

          {filteredData && filteredData.map((item) => (
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
          ))}
        </ScrollView>

        {visibleSheet && (
          <BottomSheetModalProvider>
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
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

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Cart" component={Cart} />
      <Drawer.Screen name="Orders" component={Orders} />
      <Drawer.Screen name="Contact" component={Contact} />
    </Drawer.Navigator>
  );
};

export default App;
