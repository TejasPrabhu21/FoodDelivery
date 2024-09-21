import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Pressable, Image, Text } from "react-native";
import Counter from "./Counter";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Product } from "@/types/type";
import { useCart } from "@/providers/CartProvider";

interface ItemDetailsProps {
  item: Product | undefined;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ item }) => {
  const [count, setCount] = useState(1);

  const incrementCount = () => {
    setCount((prev) => prev + 1);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount((prev) => prev - 1);
    }
  };

  const { addItem } = useCart();

  const addToCart = (item: Product, count: number) => {
    addItem(item, count);
  };

  return (
    <>
      {item && (
        <View>
          <View className="flex flex-col justify-center items-center">
            <Image
              className="w-56 h-56 m-2 rounded-lg"
              resizeMode="stretch"
              source={{ uri: item.image || 'path/to/default/image.jpg' }}
            />
          </View>
          <View className="m-4">
            <View>
              <Text className="font-JakartaBold text-2xl">{item.name}</Text>
              <Text className="font-Jakarta text-gray-600 mt-1">
                {item.type}
              </Text>
              <Text className="font-JakartaExtraBold text-2xl my-2">
                {"₹ "}{item.price}
              </Text>
              <Text>
              </Text>
            </View>

            <View className="flex flex-row items-center justify-between mt-3 pt-2 px-3 pb-8 rounded-xl bg-gray-100">
              {/* Counter */}
              <Counter
                count={count}
                increment={incrementCount}
                decrement={decrementCount}
              />

              {/* Add to Cart Button */}
              <TouchableOpacity
                className="bg-primary-500 p-2 rounded-lg flex flex-row items-center justify-center space-x-4"
                onPress={() => addToCart(item, count)}
                accessibilityLabel="Add item to cart"
              >
                <AntDesign name="shoppingcart" size={24} color="white" />
                <Text className="text-white font-JakartaBold text-2xl">
                  Add to Cart
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default ItemDetails;
