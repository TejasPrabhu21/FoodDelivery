import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import InputField from "@/components/inputField";
import { supabase } from "@/lib/supabase";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const { handleSignOut, userInfo } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [savemail, setSavemail] = useState<string | null>(null);
  const [saveImage, setImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const storedEmail = await AsyncStorage.getItem("savemail");
        setSavemail(storedEmail);
        const { data, error } = await supabase
          .from("User")
          .select("*")
          .eq("Email", storedEmail)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
          return;
        }

        const { Name, Email, Image, Phone } = data;
        setImage(Image);
        setFormData({ name: Name, email: Email, phone: Phone });
      } catch (error) {
        console.error("Error retrieving user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userInfo]);

  const handleChange = (field: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      setIsEditing(false);
      const updatedData = {
        Name: formData.name,
        Phone: formData.phone || 'Optional',
      };

      const { error } = await supabase
        .from("User")
        .update(updatedData)
        .eq("Email", formData.email);

      if (error) {
        console.error("Error updating user:", error);
      } else {
        console.log("User updated successfully");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="gray" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="px-5 pb-32">
        {/* Header */}
        <View className="flex-row items-center mt-3">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold">Profile</Text>
        </View>

        {/* Profile Image */}
        <View className="items-center justify-center my-5">
          <Image
            source={{ uri: saveImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' }}
            className="w-28 h-28 rounded-full border-3 border-white bg-gray-200 shadow-md"
          />
        </View>

        {/* Editable Profile Details */}
        <View className="bg-white shadow-lg px-6 py-5 rounded-lg">
          {isEditing ? (
            <>
              <View className="flex-row justify-between items-center">
                <Text>Info</Text>
                <TouchableOpacity onPress={handleSave} className="flex-row items-center justify-end space-x-2 p-1 px-4 bg-red-50 rounded-full">
                  <AntDesign name="check" size={24} color="green" />
                  <Text>Save</Text>
                </TouchableOpacity>
              </View>

              {/* Name Input Field */}
              <InputField
                label="Name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.nativeEvent.text)}
                containerStyle="w-full"
                inputStyle="p-2 border-gray-300 text-lg"
                labelStyle="text-gray-600 text-sm mb-1"
              />

              {/* Email Input Field (Read-Only) */}
              <InputField
                label="Email"
                value={formData.email}
                containerStyle="w-full mt-1"
                inputStyle="p-2 border-gray-300 text-lg"
                labelStyle="text-gray-600 text-sm mb-1 mt-2"
                keyboardType="email-address"
                readOnly
              />

              {/* Phone Input Field */}
              <InputField
                label="Phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.nativeEvent.text)}
                containerStyle="w-full mt-1"
                inputStyle="p-2 border-gray-300 text-lg"
                labelStyle="text-gray-600 text-sm mb-1 mt-2"
                keyboardType="numeric"
              />
            </>
          ) : (
            <>
              <View className="flex-row justify-between items-center">
                <Text>Info</Text>
                <TouchableOpacity onPress={() => setIsEditing(true)} className="flex-row items-center justify-end space-x-2 p-2 px-4 bg-red-50 rounded-full">
                  <AntDesign name="edit" size={20} color="green" />
                  <Text>Edit</Text>
                </TouchableOpacity>
              </View>

              <Text className="mt-3 text-gray-600">Name</Text>
              <Text className="text-lg font-bold">{formData.name}</Text>

              <Text className="mt-5 text-gray-600">Email</Text>
              <Text className="text-lg font-bold">{formData.email}</Text>

              <Text className="mt-5 text-gray-600">Phone</Text>
              <Text className="text-lg font-bold">
                {formData.phone || "Optional"}
              </Text>
            </>
          )}
        </View>

        {/* Orders Section */}
        <View className="flex-row justify-between items-center bg-white shadow-lg px-6 py-5 rounded-lg mt-5">
          <Link href={"/(root)/(tabs)/orders"}>
            <View className="flex-row items-center space-x-3 opacity-50">
              <Ionicons name="bag" size={20} />
              <Text className="text-lg font-bold">Your Orders</Text>
            </View>
          </Link>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleSignOut}
          className="mt-10 bg-red-600 rounded-lg p-4 flex-row items-center justify-center"
        >
          <AntDesign name="logout" size={24} color="white" />
          <Text className="text-white font-bold text-lg ml-2">
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
