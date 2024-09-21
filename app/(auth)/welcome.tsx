import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "@/constants";
import OAuth from "@/components/OAuth";

const Onboarding = () => {
  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white">
      <View className="h-full flex items-center justify-center p-5">
        <View className=" flex items-center justify-center w-full mt-10">
          <Image
            source={images.welcome}
            className=" w-[300px] h-[300px]"
            resizeMode="contain"
          />
          <Text className="text-md font-JakartaSemiBold text-center text-[#858585] mx-10 my-3">
            Welcome to
          </Text>
          <Text className=" text-black text-4xl font-bold mx-10 text-center">
            Kinara Tasty
          </Text>
          <Text className="text-md font-JakartaSemiBold text-center text-[#858585] mx-10 mt-3">
            Discover the freshest seafood and fish delicacies. Order now !!!
          </Text>
        </View>
        <View className="mb-12 w-10/12">
          <OAuth />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
