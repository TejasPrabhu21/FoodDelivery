import {
    CheckIfLocationEnabled,
    GetCurrentLocation,
  } from "@/app/lib/location-utils";
  import CartItemCard from "@/components/CartItemCard";
  import { icons, images } from "@/constants";
import { supabase } from "@/lib/supabase";
  import { CartContext, useCart } from "@/providers/CartProvider";
  import { Product } from "@/types/type";
  import { AntDesign, Octicons } from "@expo/vector-icons";
  import { router } from "expo-router";
  import React, { useContext, useEffect, useState } from "react";
  import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
  } from "react-native";
  import { SafeAreaView } from "react-native-safe-area-context";
  
  const Cart = () => {
    const { items, totalPrice } = useCart();
  
    const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);
    const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
      "fetching your location ..."
    );
  
    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState<Product>();
    const [count, setCount] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState(""); // New state for phone number
    const [phoneNumberError, setPhoneNumberError] = useState(false); // State for error handling


  
    useEffect(() => {
      const setLocation = async () => {
        setLocationServicesEnabled(await CheckIfLocationEnabled());
        const location = await GetCurrentLocation();
        setDisplayCurrentAddress(location ?? "Location not detected ...");
      };
      setLocation();
    }, []);

    const InsertData = async () => {
      if (!phoneNumber) {
        setPhoneNumberError(true); // Show error message if phone number is not provided
        return;
      }
  
      const userId = 1; // Replace this with the actual User ID of the logged-in user
      const orderStatus = "Pending"; // Example status
      const paymentMethod = "Cash on Delivery"; // Example payment method
      const paymentStatus = "Pending"; // Example payment status
      const deliveryFee = 0; // Example delivery fee
  
      try {
        // Insert the new order and return the generated Order_id
        const { data, error } = await supabase
          .from('Order')
          .insert({
            Order_date: new Date().toISOString(), // Current timestamp
            User_id: userId,
            Order_Status: orderStatus,
            Address: displayCurrentAddress,
            Phone_Number: phoneNumber, // Include phone number in order details
            Total_Amount: totalPrice,
            Delivery_Fee: deliveryFee,
            Payment_Method: paymentMethod,
            Payment_Status: paymentStatus,
          })
          .select('Order_id'); // Return the newly inserted Order_id
  
        if (error) {
          console.error("Error inserting order: ", error.message);
        } else {
          const orderId = data[0].Order_id; // Extract the Order_id from the returned data
          console.log("Order placed successfully! Order ID:", orderId);
        }
      } catch (err) {
        console.error("Error inserting order:", err);
      }
    };
    
    
  
    return (
      <SafeAreaView>
         <View className="bg-slate-100 min-h-screen ">
        <View className="flex-row items-center m-5">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>

          <Text className="text-2xl font-JakartaBold">Cart</Text>
        </View>
  
          {items.length > 0 ? (
            <ScrollView className="px-5">
              <View className="gap-1 mb-3 border-b-2 p-4 border-slate-200 rounded-xl">
                <Text className="font-JakartaBold text-lg">Deliver To</Text>
                <View className="flex flex-row items-center space-x-3 flex-1">
                  <Octicons name="location" size={24} color="#E52850" />
                  <Text ellipsizeMode="tail" className="text-gray-500 mt-1">
                    {displayCurrentAddress}
                  </Text>
                </View>
              </View>
                {/* Phone Number Input Field */}
                <View className="gap-1 mb-3 border-b-2 p-2 border-slate-200 rounded-xl">
              <Text className="font-JakartaBold text-lg">Phone Number</Text>
              <TextInput
                className={`border p-3 rounded-md ${
                  phoneNumberError ? "border-red-500" : "border-gray-300"
                }`} // Red border if there's an error
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={(value) => {
                  setPhoneNumber(value);
                  setPhoneNumberError(false); // Clear error when input changes
                }}
              />
              {phoneNumberError && (
                <Text className="text-red-500 text-sm">
                  Phone number is required
                </Text>
              )}
            </View>
  
              {items.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </ScrollView>
          ) : (
            <View className="w-full flex justify-center items-center gap-2 mt-5">
              <Image
                source={icons.arrowDown}
                className="w-24 h-24 opacity-10"
                resizeMode="contain"
              />
              <Text className="text-2xl text-center font-JakartaExtraBold text-gray-300">
                Your cart is empty !
              </Text>
            </View>
          )}
  
          {totalPrice > 0 && (
            <View className="absolute bottom-0 w-full p-3 mb-3 bg-white rounded-xl flex flex-row justify-between items-center ">
              <View className="flex flex-row gap-2 items-center">
                <Text className="text-xl font-JakartaBold">Pay With</Text>
                <Image
                  source={images.welcome}
                  className=" w-[30px] h-[30px]"
                  resizeMode="contain"
                />
              </View>
  <TouchableOpacity onPress={InsertData}>
              <View className="flex-row items-center space-x-5 bg-green-700 px-3 py-2 rounded-lg">
                <View className="flex justify-start">
                  <Text className="text-xl text-white">
                    {" ₹ "}
                    {totalPrice}
                  </Text>
                  <Text className="text-xs text-white">Total</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-xl text-white">Place Order</Text>
                  <AntDesign name="caretright" size={20} color="white" />
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