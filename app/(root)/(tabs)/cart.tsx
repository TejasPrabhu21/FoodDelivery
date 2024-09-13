import {
  CheckIfLocationEnabled,
  GetCurrentLocation,
} from "@/app/lib/location-utils";
import CartItemCard from "@/components/CartItemCard";
import { icons, images } from "@/constants";
import { CartContext, useCart } from "@/providers/CartProvider";
import { Product } from "@/types/type";
import { AntDesign, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Cart = () => {
  const { items, totalPrice } = useCart();

  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    "fetching your location ..."
  );

  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState<Product>();
  const [count, setCount] = useState(1);

  useEffect(() => {
    const setLocation = async () => {
      setLocationServicesEnabled(await CheckIfLocationEnabled());
      const location = await GetCurrentLocation();
      setDisplayCurrentAddress(location ?? "Location not detected ...");
    };
    setLocation();
  }, []);

  return (
    <SafeAreaView>
      <View className="bg-slate-100 min-h-screen ">
        <View className="flex-row items-center m-5">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>

          <Text className="text-2xl font-JakartaBold">Cart</Text>
        </View>

        {items.length > 0 ? (
          <ScrollView className="px-5">
            <View className="gap-1 mb-3 border-b-2 p-2 border-slate-200 rounded-xl">
              <Text className="font-JakartaBold text-lg">Deliver To</Text>
              <View className="flex flex-row items-center space-x-3 flex-1">
                <Octicons name="location" size={24} color="#E52850" />
                <Text ellipsizeMode="tail" className="text-gray-500 mt-1">
                  {displayCurrentAddress}
                </Text>
              </View>
            </View>

            {items.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </ScrollView>
        ) : (
          <View className="w-full flex justify-center items-center gap-2 mt-5">
            <Image
              source={icons.emptyCart}
              className="w-24 h-24 opacity-10"
              resizeMode="contain"
            />
            <Text className="text-2xl text-center font-JakartaExtraBold text-gray-300">
              Your cart is empty !
            </Text>
          </View>
        )}

        {totalPrice > 0 && (
          <View className="absolute bottom-0 w-full p-3 mb-3 bg-white rounded-xl flex flex-row justify-between items-center ">
            <View className="flex flex-row gap-2 items-center">
              <Text className="text-xl font-JakartaBold">Pay With</Text>
              <Image
                source={images.googlePay}
                className=" w-[30px] h-[30px]"
                resizeMode="contain"
              />
            </View>

            <View className="flex-row items-center space-x-5 bg-green-700 px-3 py-2 rounded-lg">
              <View className="flex justify-start">
                <Text className="text-xl text-white">
                  {" ₹ "}
                  {totalPrice}
                </Text>
                <Text className="text-xs text-white">Total</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-xl text-white">Place Order</Text>
                <AntDesign name="caretright" size={20} color="white" />
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Cart;
