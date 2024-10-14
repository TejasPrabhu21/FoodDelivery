import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const CartIcon = () => {
  const navigation = useNavigation();
  return (
    <View className="absolute bottom-5 w-full z-0">
      <TouchableOpacity
        onPress={() => navigation.navigate("cart" as never)}
        className="bg-primary-300 flex-row justify-between items-center mx-5 rounded-full p-4 py-3 shadow-lg"
      >
        <View className="p-2 px-4 rounded-full bg-primary-500">
          <Text className="font-JakartaExtraBold text-white text-lg">3</Text>
        </View>
        <Text className="flex-1 text-center font-JakartaExtraBold text-lg text-white">
          View Cart
        </Text>
        <Text className="p-2 font-JakartaExtraBold text-lg text-white">
          $ 24
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartIcon;
