import { Product } from "@/types/type";
import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Pressable, Image, Text } from "react-native";
import Counter from "./Counter";

interface ItemCardProps {
  item: Product;
  onItemPress: (item: Product) => void;
}

const ItemCards = ({ item, onItemPress }: ItemCardProps) => {
  return (
    <>
      <Pressable
        key={item.id}
        onPress={() => onItemPress(item)}
        className="flex flex-row bg-white m-2 rounded-lg"
      >
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
              <AntDesign name="clockcircleo" size={14} color="black" />
              {item?.time} mins
            </Text>
          </View>
        </View>
      </Pressable>
    </>
  );
};

export default ItemCards;
