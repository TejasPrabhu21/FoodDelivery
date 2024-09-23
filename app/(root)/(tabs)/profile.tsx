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
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import InputField from "@/components/inputField";
import { images } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase";
import { Link, router } from "expo-router";

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

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("savemail");
        setSavemail(storedEmail);
        const { data, error } = await supabase
          .from("User")
          .select("*")
          .eq("Email", storedEmail)
          .single(); // Assuming only one user per email

        if (error) {
          console.error("Error fetching user data:", error);
          return null;
        }

        const { Name, Email, Image, Phone } = data;
        setImage(Image);
        setFormData({ name: Name, email: Email, phone: Phone });
      } catch (error) {
        console.error("Error retrieving saved email:", error);
      }
    };
    fetchEmail();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsEditing(false);
      const updatedData = {
        Name: formData.name,
        Email: formData.email,
        Phone: formData.phone || 'Optional',
      };
      console.log(updatedData,savemail);

      const { data, error } = await supabase
        .from("User")
        .update(updatedData)
        .eq("Email", savemail);

      if (error) {
        console.error("Error updating user:", error);
        return null;
      }

      console.log("User updated successfully:", data);
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
            source={{ uri: saveImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' }}
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

              {/* Name Input Field */}
              <InputField
  label="Name"
  value={formData.name}
  onChange={(e) => handleChange("name", e.nativeEvent.text)} // Extract text here
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
  onChange={(e) => handleChange("phone", e.nativeEvent.text)} // Extract text here
  containerStyle="w-full mt-1"
  inputStyle="p-2 border-gray-300 text-lg"
  labelStyle="text-gray-600 text-sm mb-1 mt-2"
  keyboardType="numeric"
/>
            </>
          ) : (
            <>
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
              
              {/* Display Name */}
              <Text className="mt-3 text-gray-600">Name</Text>
              <Text className="text-lg font-JakartaBold">{formData.name}</Text>

              {/* Display Email */}
              <Text className="mt-5 text-gray-600">Email</Text>
              <Text className="text-lg font-JakartaBold">{formData.email}</Text>

              {/* Display Phone */}
              <Text className="mt-5 text-gray-600">Phone</Text>
              <Text className="text-lg font-JakartaBold">
                {formData.phone || "Optional"}
              </Text>
            </>
          )}
        </View>

        {/* Orders Section */}
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
