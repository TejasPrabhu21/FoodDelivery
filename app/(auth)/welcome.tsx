import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "@/constants";

const Onboarding = () => {
  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white">
      <TouchableOpacity
        onPress={() => {
          router.replace("/(tabs)/home");
        }}
        className="w-full flex justify-end items-end p-5"
      >
        <Text className="text-black text-md font-JakartaBold">Skip</Text>
      </TouchableOpacity>

      <View className=" flex items-center justify-center p-5">
        <Image
          source={images.welcome}
          className=" w-[300px] h-[300px]"
          resizeMode="contain"
        />
        <View className=" flex items-center justify-center w-full mt-10">
          <Text className=" text-black text-3xl font-bold mx-10 text-center">
            Food delivery app
          </Text>
        </View>
        {/* <Text className="text-md font-JakartaSemiBold text-center text-[#858585] mx-10 mt-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur,
          tenetur.
        </Text> */}
      </View>

      <CustomButton
        onPress={() => router.replace("/(auth)/sign-up")}
        className="w-11/12 mt-10 mb-5 bg-danger-500"
        title={"Get started "}
      />
    </SafeAreaView>
  );
};

export default Onboarding;
