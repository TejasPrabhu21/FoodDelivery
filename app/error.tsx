import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const ErrorPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold mb-4">
        Oops! Something went wrong.
      </Text>
      <Text className="text-lg mb-8 text-center px-4">
        We're sorry, but an unexpected error occurred. Please try again later.
      </Text>
      <TouchableOpacity
        onPress={() => router.replace("/")}
        className="bg-[#ca681c] py-3 px-6 rounded-full"
      >
        <Text className="text-white font-bold text-lg">Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorPage;
