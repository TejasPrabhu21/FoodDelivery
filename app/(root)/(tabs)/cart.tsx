import {
  CheckIfLocationEnabled,
  GetCurrentLocation,
} from "@/app/lib/location-utils";
import CartItemCard from "@/components/CartItemCard";
import { icons, images } from "@/constants";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { CartContext, useCart } from "@/providers/CartProvider";
import { Product } from "@/types/type";
import { AntDesign } from "@expo/vector-icons";
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
import { handlePayment } from "../../../lib/Razorpay";

const Cart = () => {
  const { items, totalPrice } = useCart();
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    "Fetching your location ..."
  );
  const [editableAddress, setEditableAddress] = useState(displayCurrentAddress);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState(false);

  const deliveryFee = totalPrice < 2000 ? 100 : 0;
  const finalTotalPrice = totalPrice + deliveryFee;

  useEffect(() => {
    const setLocation = async () => {
      setLocationServicesEnabled(await CheckIfLocationEnabled());
      const location = await GetCurrentLocation();
      setDisplayCurrentAddress(location ?? "Location not detected ...");
      setEditableAddress(location ?? "Location not detected ...");
    };
    setLocation();
  }, []);

  const [savemail, setSavemail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);


  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("savemail");
        if (storedEmail) {
          setSavemail(storedEmail);
          console.log(storedEmail);

          // fetch phone number of the user through email from User table 
          const { data: userData, error: userError } = await supabase
          .from("User")
          .select("Phone")
          .eq("Email", storedEmail)
          .single();

        if (userError) {
          console.error("Error fetching user phone number:", userError.message);
        } else if (userData) {
          setPhone(userData.Phone);
          setPhoneNumber(userData.Phone||''); // Set the phone number in the input field
        }


        } else {
          console.error("No email found");
        }
      } catch (error) {
        console.error("Error retrieving savemail:", error);
      }
    };

    fetchEmail();
  }, []);

  const InsertData = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      setPhoneNumberError(true);
      return;
    }
    console.log(savemail);
    const userEmail = savemail;

    if (!userEmail) {
      Alert.alert("Error", "User email not found.");
      return;
    }

    try {
      const { data: userData, error: userError } = await supabase
        .from("User")
        .select("*")
        .eq("Email", userEmail)
        .single();

      if (userError) {
        throw new Error(`Error fetching user: ${userError.message}`);
      }
      const userId = userData?.User_id;

      if (!userId) {
        throw new Error("User ID not found.");
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

      if (orderError) {
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
        throw new Error(`Error inserting order items: ${orderItemError.message}`);
      }

      console.log("Order placed successfully! Order ID:", orderId);
      handlePayment(orderId, userId, finalTotalPrice);
    } catch (err: any) {
      console.error("Error inserting order:", err);
      Alert.alert("Order Error", err.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <View className="flex-row items-center m-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold">Cart</Text>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          className="flex-1"
        >
          {items.length > 0 ? (
            <View className="p-4">
              <View className="mb-4 border-b-2 border-gray-200 pb-2">
                <Text className="text-lg font-bold">Deliver To</Text>
                <TextInput
                  className={`border p-2 rounded-md mt-2 ${
                    editableAddress !== displayCurrentAddress
                      ? "border-blue-500"
                      : "border-gray-400"
                  }`}
                  placeholder="Enter delivery address"
                  value={editableAddress}
                  onChangeText={(value) => setEditableAddress(value)}
                />
              </View>

              <View className="mb-4 border-b-2 border-gray-200 pb-2">
                <Text className="text-lg font-bold">Phone Number</Text>
                <TextInput
                  className={`border p-2 rounded-md mt-2 ${
                    phoneNumberError ? "border-red-500" : "border-gray-400"
                  }`}
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
                <View
                  key={item.id}
                  className="flex-row justify-between my-1"
                >
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
                source={images.welcome}
                className="w-7 h-7"
                resizeMode="contain"
              />
            </View>
            <TouchableOpacity onPress={InsertData}>
              <View className="flex-row items-center justify-between bg-green-600 p-3 rounded-md">
                <Text className="text-lg text-white">{" ₹ "}{finalTotalPrice}</Text>
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
