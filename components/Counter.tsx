import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

const Counter = ({
  count,
  increment,
  decrement,
}: {
  count: number;
  increment: () => void;
  decrement: () => void;
}) => {
  return (
    <View className="flex flex-row items-center justify-center gap-2 px-2">
      <Pressable
        className="bg-green-200 p-1 rounded-xl"
        onPress={() => decrement()}
      >
        <AntDesign name="minus" size={24} color="gray" />
      </Pressable>
      <Text className="text-2xl px-1">{count}</Text>
      <Pressable
        className="bg-green-200 p-1 rounded-xl"
        onPress={() => increment()}
      >
        <AntDesign name="plus" size={24} color="gray" />
      </Pressable>
    </View>
  );
};

export default Counter;
