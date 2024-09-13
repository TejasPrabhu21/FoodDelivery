import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { CartItem } from "@/types/type";
import Counter from "./Counter";
import { useCart } from "@/providers/CartProvider";

const CartItemCard = ({ item }: { item: CartItem }) => {
  const { updateQuantity } = useCart();
  const [count, setCount] = useState(item.quantity);

  const incrementCount = () => {
    setCount((count) => count + 1);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount((count) => count - 1);
    }
  };

  return (
    <View
      key={item.id}
      className="flex flex-row bg-white rounded-xl p-3 w-full my-2"
    >
      <Image
        className=" w-20 h-20 rounded-lg"
        resizeMode="cover"
        source={{ uri: item?.product.image }}
      />

      <View className=" flex flex-col justify-between px-3">
        <Text className="text-2xl">{item.product.name}</Text>
        <View className="flex flex-row justify-between items-center">
          <Text className="text-lg text-slate-500 pr-20">
            {"₹ "}
            {item.price}
          </Text>
          <Counter
            count={item.quantity}
            increment={() => updateQuantity(item, 1)}
            decrement={() => updateQuantity(item, -1)}
          />
        </View>
      </View>
    </View>
  );
};

export default CartItemCard;
