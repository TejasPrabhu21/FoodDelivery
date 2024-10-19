import {
  CheckIfLocationEnabled,
  GetCurrentLocation,
} from "@/lib/location-utils";
import CartItemCard from "@/components/CartItemCard";
import { icons, images } from "@/constants";
import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { handlePayment } from "../../../lib/Razorpay";
import { useCart } from "@/providers/CartProvider";

const Cart = () => {
  const { items, totalPrice } = useCart();
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);
  const [editableAddress, setEditableAddress] = useState(
    "Fetching your location ..."
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [savemail, setSavemail] = useState<string | null>(null);
  const [isLocationFetched, setIsLocationFetched] = useState(false); // New state variable
  const [EditableAddressError, setEditableAddressError] = useState(false);

  const { clearCart } = useCart();

  const deliveryFee = totalPrice < 2000 ? 100 : 0;
  const finalTotalPrice = totalPrice + deliveryFee;

  useEffect(() => {
    const setLocation = async () => {
      const isLocationEnabled = await CheckIfLocationEnabled();
      const location =
        (await GetCurrentLocation()) || "Location not detected ...";
      setLocationServicesEnabled(isLocationEnabled);
      setEditableAddress(location);
      setIsLocationFetched(true); // Set location fetched to true after fetching
    };
    setLocation();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("savemail");
        if (!storedEmail) {
          console.error("No email found");
          return;
        }
        setSavemail(storedEmail);

        const { data: userData, error: userError } = await supabase
          .from("User")
          .select("Phone")
          .eq("Email", storedEmail)
          .single();

        if (userError) {
          console.error("Error fetching user phone number:", userError.message);
        } else if (userData) {
          setPhoneNumber(userData.Phone || "");
        }
      } catch (error) {
        router.push("/error");
        console.error("Error retrieving savemail:", error);
      }
    };

    fetchUserData();
  }, []);

  const InsertData = async () => {
    if (!editableAddress || editableAddress === "Fetching your location ...") {
      setEditableAddressError(true);
      return;
    }
    if (!phoneNumber || phoneNumber.length !== 10) {
      setPhoneNumberError(true);
      return;
    }

    try {
      const { data: userData, error: userError } = await supabase
        .from("User")
        .select("*")
        .eq("Email", savemail)
        .single();

      if (userError || !userData?.User_id) {
        throw new Error(
          userError
            ? `Error fetching user: ${userError.message}`
            : "User ID not found."
        );
      }

      const userId = userData.User_id;

      // Update the user's phone number where User_id matches
      const { error: phoneUpdateError } = await supabase
        .from("User")
        .update({ Phone: phoneNumber })
        .eq("User_id", userId);

      if (phoneUpdateError) {
        throw new Error(
          `Error updating phone number: ${phoneUpdateError.message}`
        );
      }
      const { data: orderData, error: orderError } = await supabase
        .from("Order")
        .insert({
          Order_date: new Date().toISOString(),
          User_id: userId,
          Order_Status: "Pending",
          Address: editableAddress,
          Total_Amount: totalPrice,
          Delivery_Fee: deliveryFee,
          Payment_Method: "online",
          Payment_Status: "Pending",
        })
        .select("Order_id");

      if (orderError || !orderData) {
        throw new Error(`Error inserting order: ${orderError.message}`);
      }

      const orderId = orderData[0].Order_id;

      const orderItems = items.map((item) => ({
        Order_id: orderId,
        Product_id: item.id,
        Quantity: item.quantity,
      }));

      const { error: orderItemError } = await supabase
        .from("Order_Item")
        .insert(orderItems);

      if (orderItemError) {
        throw new Error(
          `Error inserting order items: ${orderItemError.message}`
        );
      }

      console.log("Order placed successfully! Order ID:", orderId);
      const userDetails = {
        Name: userData.Name,
        Phone: phoneNumber,
        Email: userData.Email,
      };

      handlePayment(orderId, userId, finalTotalPrice, userDetails, clearCart);
    } catch (err: any) {
      console.error("Error inserting order:", err);
      Alert.alert("Order Error", err.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center m-4"
        >
          <AntDesign name="arrowleft" size={24} color="black" />
          <Text className="font-bold text-2xl ml-4">Cart</Text>
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          className="flex-1"
        >
          {items.length > 0 ? (
            <View className="p-4">
              <View className="mb-4 border-b-2 border-gray-200 pb-2">
                <Text className="text-lg font-bold">Deliver To</Text>
                <TextInput
                  className={`border p-2 rounded-md mt-2 ${EditableAddressError ? "border-red-500" : "border-gray-400"}`}
                  placeholder="Enter delivery address"
                  value={editableAddress}
                  onChangeText={(value) => setEditableAddress(value)}
                />
              </View>

              <View className="mb-4 border-b-2 border-gray-200 pb-2">
                <Text className="text-lg font-bold">Phone Number</Text>
                <TextInput
                  className={`border p-2 rounded-md mt-2 ${phoneNumberError ? "border-red-500" : "border-gray-400"}`}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={(value) => {
                    setPhoneNumber(value);
                    setPhoneNumberError(false);
                  }}
                />
                {phoneNumberError && (
                  <Text className="text-red-500 text-xs mt-1">
                    Phone number is required
                  </Text>
                )}
              </View>

              {items.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </View>
          ) : (
            <View className="flex-1 justify-center items-center mt-5">
              <Image
                source={icons.arrowDown}
                className="w-24 h-24 opacity-10"
                resizeMode="contain"
              />
              <Text className="text-xl text-center text-gray-500">
                Your cart is empty!
              </Text>
            </View>
          )}

          {items.length > 0 && (
            <View className="mb-5 mx-5">
              <Text className="text-lg font-bold">Billing Details</Text>
              {items.map((item) => (
                <View key={item.id} className="flex-row justify-between my-1">
                  <Text className="text-base">
                    {item.name} (x{item.quantity})
                  </Text>
                  <Text className="text-base">₹{item.price}</Text>
                </View>
              ))}
              <View className="flex-row justify-between my-1 border-t border-gray-200 pt-2">
                <Text className="text-base font-bold">Subtotal</Text>
                <Text className="text-base">₹{totalPrice}</Text>
              </View>
              <View className="flex-row justify-between my-1">
                <Text className="text-base font-bold">Delivery Fee</Text>
                <Text className="text-base">₹{deliveryFee}</Text>
              </View>
              <View className="flex-row justify-between my-1 border-t border-gray-200 pt-2">
                <Text className="text-base font-bold">Total</Text>
                <Text className="text-base">₹{finalTotalPrice}</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {totalPrice > 0 && (
          <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 rounded-t-lg">
            <View className="flex-row items-center mb-3">
              <Text className="text-lg font-bold mr-2">Pay With</Text>
              <Image
                source={{
                  uri: "https://qjvdrhwtxyceipxhqtdd.supabase.co/storage/v1/object/public/Product_image/Logo/Razorpay_logo.png",
                }}
                className="w-14 h-14"
                resizeMode="center"
              />
            </View>
            <TouchableOpacity
              onPress={InsertData}
              disabled={!isLocationFetched} // Disable button if location isn't fetched
              className={` rounded-md ${isLocationFetched ? "bg-green-600" : "bg-gray-300"}`}
            >
              <View className="flex-row items-center justify-between  p-3 rounded-md">
                <Text className="text-lg text-white">
                  {" ₹ "}
                  {finalTotalPrice}
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-lg text-white">Place Order</Text>
                  <AntDesign name="right" size={24} color="white" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Cart;
