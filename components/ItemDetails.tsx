import { AntDesign } from "@expo/vector-icons";
import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Animated, ScrollView } from "react-native";
import Counter from "./Counter";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Product } from "@/types/type";
import { useCart } from "@/providers/CartProvider";

interface ItemDetailsProps {
  item: Product | undefined;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ item }) => {
  const [count, setCount] = useState(1);
  const [showMessage, setShowMessage] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
    setShowMessage(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start(() => setShowMessage(false));
      }, 900);
    });
  };

  return (
    <>
      {item && (
        <View className="relative bottom-0 left-0 right-0">
          <View className="flex flex-col justify-center items-center">
            <Image
              className="w-56 h-56 m-2 rounded-lg"
              resizeMode="stretch"
              source={{ uri: item.image || "path/to/default/image.jpg" }}
            />
          </View>
          <View className="m-4">
            <View>
              <Text className="font-JakartaBold text-2xl">{item.name}</Text>
              <Text className="font-Jakarta text-gray-600 mt-1">
                {item.type}
              </Text>
              <Text className="font-JakartaExtraBold text-2xl my-2">
                {"₹ "}
                {item.price}
              </Text>
            </View>

            <View className="flex flex-row items-center justify-between mt-3 pt-3 px-3 pb-4 rounded-xl bg-gray-100">
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

            {/* Temporary message */}
            {showMessage && (
              <Animated.View
                style={{
                  opacity: fadeAnim, // Bind opacity to animated value
                  position: "absolute",
                  bottom: 80, // Position above "Add to Cart"
                  left: 20,
                  right: 20,
                  backgroundColor: "rgba(0, 128, 0, 0.8)", // Transparent green
                  padding: 10,
                  borderRadius: 10,
                  zIndex: 1,
                }}
              >
                <Text className="text-white text-center font-JakartaBold">
                  Item added to cart!
                </Text>
              </Animated.View>
            )}
          </View>
        </View>
      )}
    </>
  );
};

export default ItemDetails;
