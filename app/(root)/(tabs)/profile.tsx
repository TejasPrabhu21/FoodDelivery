import {
  Button,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import InputField from "@/components/inputField";
import { images, icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";

const Profile = () => {
  const { handleSignOut, userInfo } = useAuth();
  const [isEditing, setIsEditing] = useState(false); // Edit state

  const handleEdit = () => setIsEditing(!isEditing); // Toggle edit mode

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="px-5 content-containerStyle={{ paddingBottom: 120 }}">
        {/* Header */}
        <View className="flex flex-row items-center mt-3">
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginRight: 10 }}
          >
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Profile</Text>
        </View>

        {/* Profile Image */}
        <View className="flex items-center justify-center my-5">
          <Image
            source={userInfo?.user?.photo || images.check}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              borderColor: "#fff",
              borderWidth: 3,
              backgroundColor: "#EAEAEA",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
            }}
          />
        </View>

        {/* Editable Profile Details */}
        <View className="bg-white shadow-lg px-6 py-5 rounded-lg">
          <View className="absolute right-4 top-4">
            {isEditing ? (
              <TouchableOpacity
                onPress={handleEdit}
                className="p-3 bg-red-100 rounded-full"
              >
                <AntDesign name="check" size={24} color="green" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleEdit}
                className="p-3 bg-red-100 rounded-full"
              >
                <AntDesign name="edit" size={24} color="green" />
              </TouchableOpacity>
            )}
          </View>

          {isEditing ? (
            <>
              <InputField
                label="Full Name"
                placeholder={userInfo?.user?.name || ""}
                containerStyle="w-full mt-3"
                inputStyle="p-3.5 border-b border-gray-300"
              />
              <InputField
                label="Email"
                placeholder={userInfo?.user?.email || ""}
                containerStyle="w-full mt-3"
                inputStyle="p-3.5 border-b border-gray-300"
                keyboardType="email-address"
              />
              <InputField
                label="Phone"
                placeholder="Optional"
                containerStyle="w-full mt-3"
                inputStyle="p-3.5 border-b border-gray-300"
                keyboardType="numeric"
              />
            </>
          ) : (
            <>
              <Text className="text-lg font-JakartaBold mt-3">Full Name</Text>
              <Text className="text-gray-600 mt-1">
                {userInfo?.user?.name || "Tejas Prabhu"}
              </Text>

              <Text className="text-lg font-JakartaBold mt-5">Email</Text>
              <Text className="text-gray-600 mt-1">
                {userInfo?.user?.email || "tejas.dev@email.com"}
              </Text>

              <Text className="text-lg font-JakartaBold mt-5">Phone</Text>
              <Text className="text-gray-600 mt-1">Optional</Text>
            </>
          )}

          {/* Edit/Save Button */}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleSignOut}
          className="mt-10 bg-red-600 rounded-lg p-4 flex-row items-center justify-center"
        >
          <AntDesign name="logout" size={24} color="white" />
          <Text className="text-white font-JakartaBold text-lg ml-2">
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
