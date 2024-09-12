import { ItemData } from "@/types/type";
import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Pressable, Image, Text } from "react-native";

const ItemDetails = ({ item }: { item: ItemData | undefined }) => {
  const [count, setCount] = useState(1);

  const incrementCount = () => {
    setCount((count) => count + 1);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount((count) => count - 1);
    }
  };

  function addToCart(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      {item && (
        <View>
          <View className="flex flex-col justify-center items-center">
            <Image
              className=" w-11/12 h-56 m-2 rounded-lg"
              resizeMode="cover"
              source={{ uri: item?.image }}
            />
          </View>
          <View className="m-4">
            <View>
              <Text className="font-JakartaBold text-2xl">{item?.name}</Text>
              <Text className="font-Jakarta text-gray-600 mt-1">
                {item?.type}
              </Text>
              <Text className="font-JakartaExtraBold text-2xl my-2">
                {"₹ "}
                {item.price}
              </Text>
              <Text>
                <AntDesign name="clockcircleo" size={14} color="black" />
                {item?.time} mins
              </Text>
            </View>

            <View className="flex flex-row items-center justify-between mt-3 pt-2 px-3 pb-10 rounded-xl bg-gray-100">
              {/* Counter */}
              <View className="flex flex-row items-center justify-center gap-2 px-2">
                <Pressable
                  className="bg-red-200 p-1 rounded"
                  onPress={() => decrementCount()}
                >
                  <AntDesign name="minus" size={24} color="gray" />
                </Pressable>
                <Text className="text-2xl px-2">{count}</Text>
                <Pressable
                  className="bg-green-200 p-1 rounded"
                  onPress={() => incrementCount()}
                >
                  <AntDesign name="plus" size={24} color="gray" />
                </Pressable>
              </View>

              {/* Add to Cart Button */}
              <Pressable
                className="bg-primary-500 p-2 rounded-lg flex flex-row items-center justify-center space-x-4"
                onPress={() => addToCart()}
              >
                <AntDesign name="shoppingcart" size={24} color="white" />
                <Text className="text-white font-JakartaBold text-2xl">
                  Add to Cart
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default ItemDetails;
