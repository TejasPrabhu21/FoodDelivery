import {
  Button,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "@/components/inputField";
import { images, icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { useCallback, useMemo, useRef } from "react";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";

import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Profile = () => {
  const onSignOutPress = useCallback(async () => {}, []);
  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="px-5"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="flex-row items-center my-5">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>

          <Text className="text-2xl font-JakartaBold">My Profile</Text>
        </View>
        <View className="flex items-center justify-center my-5">
          <Image
            source={images.check}
            style={{ width: 110, height: 110, borderRadius: 110 / 2 }}
            className=" rounded-full h-[110px] w-[110px] border-[3px] border-white shadow-sm shadow-neutral-300"
          />
        </View>

        <View className="flex flex-col items-start justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 px-5 py-3">
          <View className="flex flex-col items-start justify-start w-full">
            <InputField
              label="First name"
              placeholder="Tejas"
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <InputField
              label="Last Name"
              placeholder="Prabhu"
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <InputField
              label="Email"
              placeholder="tejas.dev@email.com"
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <InputField
              label="Phone"
              placeholder="+91 4357689899"
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />
          </View>
          <CustomButton
            title="Sign Out"
            onPress={onSignOutPress}
            className="mt-6"
            IconLeft={() => <AntDesign name="logout" size={24} color="white" />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
