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
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import InputField from "@/components/inputField";
import { images, icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";

const Profile = () => {
  const { handleSignOut, userInfo } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userInfo?.name,
    email: userInfo?.email,
    phone: "",
  });

  const handleChange = (field: any, value: any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsEditing(false);
      const updatedData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };
      console.log(updatedData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
            source={{ uri: userInfo?.photo } || images.check}
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
          {isEditing ? (
            <>
              {/* <Button onPress={handleSave} title="Save" /> */}
              <View className="flex flex-row justify-between items-center">
                <Text>Info</Text>
                <TouchableOpacity
                  onPress={handleSave}
                  className="flex flex-row items-center justify-end space-x-2 p-1 px-4 bg-red-50 rounded-full "
                >
                  <AntDesign name="check" size={24} color="green" />
                  <Text>Save</Text>
                </TouchableOpacity>
              </View>

              <InputField
                label="Name"
                value={formData.name}
                defaultValue={userInfo?.name}
                onChange={(value) => handleChange("name", value)}
                containerStyle="w-full"
                inputStyle="p-2 border-gray-300 text-lg"
                labelStyle="text-gray-600 text-sm mb-1"
              />
              <InputField
                label="Email"
                value={formData.email}
                defaultValue={userInfo?.email}
                containerStyle="w-full mt-1"
                inputStyle="p-2 border-gray-300 text-lg"
                labelStyle="text-gray-600 text-sm mb-1 mt-2"
                keyboardType="email-address"
                readOnly
              />
              <InputField
                label="Phone"
                value={formData.phone}
                defaultValue="Optional"
                onChange={(value) => handleChange("phone", value)}
                containerStyle="w-full mt-1"
                inputStyle="p-2 border-gray-300 text-lg"
                labelStyle="text-gray-600 text-sm mb-1 mt-2"
                keyboardType="numeric"
              />
            </>
          ) : (
            <>
              {!isEditing && (
                //  <Button on  Press={() => setIsEditing(true)} title="Edit" />
                <View className="flex flex-row justify-between items-center">
                  <Text>Info</Text>
                  <TouchableOpacity
                    onPress={() => setIsEditing(true)}
                    className="flex flex-row items-center justify-end space-x-2 p-2 px-4 bg-red-50 rounded-full "
                  >
                    <AntDesign name="edit" size={20} color="green" />
                    <Text>Edit</Text>
                  </TouchableOpacity>
                </View>
              )}
              <Text className="mt-3 text-gray-600">Name</Text>
              <Text className="text-lg font-JakartaBold ">
                {userInfo?.name || "Tejas Prabhu"}
              </Text>

              <Text className="mt-5 text-gray-600">Email</Text>
              <Text className="text-lg font-JakartaBold ">
                {userInfo?.email || "tejas.dev@email.com"}
              </Text>

              <Text className="mt-5 text-gray-600">Phone</Text>
              <Text className="text-lg font-JakartaBold ">Optional</Text>
            </>
          )}
        </View>

        <View className="flex flex-row justify-between items-center bg-white shadow-lg px-6 py-5 rounded-lg mt-5">
          <Link href={"/(root)/(tabs)/orders"}>
            <View className="flex justify-start items-center flex-row space-x-3 opacity-50">
              <Ionicons name="bag" size={20} className="opacity-25" />
              <Text className="text-lg font-JakartaBold"> Your Orders</Text>
            </View>
          </Link>
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
