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
import {handlePayment} from "../../../lib/Razorpay"

const Cart = () => {
  const { items, totalPrice } = useCart();
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState("Fetching your location ...");
  const [editableAddress, setEditableAddress] = useState(displayCurrentAddress);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState(false);

  // Calculate delivery fee based on total price
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

  const userInfo = useAuth();
  console.log(userInfo)
  // const InsertData = async () => {
  //   if (!phoneNumber) {
  //     setPhoneNumberError(true);
  //     return;
  //   }
  // const {userInfo}= useAuth();
  
  //   const userId = userInfo?.user.email; // Replace this with the actual User ID of the logged-in user
  //   const orderStatus = "Pending";
  //   const paymentMethod = "Cash on Delivery";
  //   const paymentStatus = "Pending";
  //   console.log(userId);
  
  //   try {
  //     // Insert the order into the Order table
  //     const { data: orderData, error: orderError } = await supabase
  //       .from('Order')
  //       .insert({
  //         Order_date: new Date().toISOString(),
  //         User_id: userId,
  //         Order_Status: orderStatus,
  //         Address: editableAddress,
  //         Total_Amount: finalTotalPrice, // Total price including delivery fee
  //         Delivery_Fee: deliveryFee,
  //         Payment_Method: paymentMethod,
  //         Payment_Status: paymentStatus,
  //       })
  //       .select('Order_id'); // Retrieve the Order_id of the new order
  
  //     if (orderError) {
  //       console.error("Error inserting order: ", orderError.message);
  //       return;
  //     }
  
  //     const orderId = orderData[0].Order_id;
  //     console.log("Order placed successfully! Order ID:", orderId);
  
  //     // Now insert each cart item into the Order_Item table
  //     const orderItems = items.map((item) => ({
  //       Order_id: orderId,
  //       Product_id: item.id, // Ensure this is the correct bigint `id` from the Product table
  //       Quantity: item.quantity, // The quantity of the item ordered
  //     }));
  
  //     const { error: orderItemError } = await supabase
  //       .from('Order_Item')
  //       .insert(orderItems); // Insert multiple items at once
  
  //     if (orderItemError) {
  //       console.error("Error inserting order items: ", orderItemError.message);
  //     } else {
  //       console.log("Order items inserted successfully!");
  //       // Navigate to confirmation or another relevant screen
  //     }
  //   } catch (err) {
  //     console.error("Error inserting order:", err);
  //   }
  // };
  const [savemail, setSavemail] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("savemail");
        if (storedEmail) {
          setSavemail(storedEmail); // Set the email from AsyncStorage
        } else {
          console.error('No email found');
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
    const userEmail = savemail; // This is the email used to fetch the User_id
    console.log(userEmail);
    
  
    if (!userEmail) {
      Alert.alert("Error", "User email not found.");
      return;
    }
  
    try {
      // Step 1: Fetch User_id from User table using email
      const { data: userData, error: userError } = await supabase
        .from('User')
        .select('*')
        .eq('Email', userEmail)
        .single(); // Assumes email is unique
  
      if (userError) {
        throw new Error(`Error fetching user: ${userError.message}`);
      }
      console.log(userData?.User_id,' ',userData?.Name);
      const userName=userData?.Name
      const userId = userData?.User_id;
      if (!userId) {
        throw new Error("User ID not found.");
      }
  
      // Step 2: Insert the order into the Order table
      const { data: orderData, error: orderError } = await supabase
        .from('Order')
        .insert({
          Order_date: new Date().toISOString(),
          User_id: userId,
          Order_Status: "Pending",
          Address: editableAddress,
          Total_Amount: finalTotalPrice,
          Delivery_Fee: deliveryFee,
          Payment_Method: "online",
          Payment_Status: "Pending",
        })
        .select('Order_id');
  
      if (orderError) {
        throw new Error(`Error inserting order: ${orderError.message}`);
      }
  
      const orderId = orderData[0].Order_id;
  
      // Step 3: Insert each cart item into the Order_Item table
      const orderItems = items.map((item) => ({
        Order_id: orderId,
        Product_id: item.id,
        Quantity: item.quantity,
      }));
  
      const { error: orderItemError } = await supabase
        .from('Order_Item')
        .insert(orderItems);
  
      if (orderItemError) {
        throw new Error(`Error inserting order items: ${orderItemError.message}`);
      }
  
      console.log("Order placed successfully! Order ID:", orderId);
      handlePayment(orderId,userId);
  
    } catch (err:any) {
      console.error("Error inserting order:", err);
      Alert.alert("Order Error", err.message);
    } 
  };
  




  
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', margin: 15 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 10 }}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Cart</Text>
        </View>

        <ScrollView 
          contentContainerStyle={{ paddingBottom: 100 }} // Add padding to make room for the fixed summary view
          style={{ flex: 1 }}
        >
          {items.length > 0 ? (
            <View style={{ padding: 15 }}>
              <View style={{ marginBottom: 15, borderBottomWidth: 2, borderBottomColor: 'lightgray', paddingBottom: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Deliver To</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    borderColor: editableAddress !== displayCurrentAddress ? 'blue' : 'gray',
                    marginTop: 5
                  }}
                  placeholder="Enter delivery address"
                  value={editableAddress}
                  onChangeText={(value) => setEditableAddress(value)}
                />
              </View>

              <View style={{ marginBottom: 15, borderBottomWidth: 2, borderBottomColor: 'lightgray', paddingBottom: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Phone Number</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    borderColor: phoneNumberError ? 'red' : 'gray',
                    marginTop: 5
                  }}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={(value) => {
                    setPhoneNumber(value);
                    setPhoneNumberError(false);
                  }}
                />
                {phoneNumberError && (
                  <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
                    Phone number is required
                  </Text>
                )}
              </View>

              

              {items.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
              <Image
                source={icons.arrowDown}
                style={{ width: 96, height: 96, opacity: 0.1 }}
                resizeMode="contain"
              />
              <Text style={{ fontSize: 24, textAlign: 'center', color: 'gray' }}>
                Your cart is empty!
              </Text>
            </View>
          )}
          {/* Billing Details Section */}
          {items.length > 0 && (
          <View style={{ marginBottom: 20, marginHorizontal:20 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Billing Details</Text>
                {items.map((item) => (
                  <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
                    <Text style={{ fontSize: 16 }}>{item.name} (x{item.quantity})</Text>
                    <Text style={{ fontSize: 16 }}>₹{item.price * item.quantity}</Text>
                  </View>
                ))}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5, borderTopWidth: 1, borderTopColor: 'lightgray', paddingTop: 5 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Subtotal</Text>
                  <Text style={{ fontSize: 16 }}>₹{totalPrice}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Delivery Fee</Text>
                  <Text style={{ fontSize: 16 }}>₹{deliveryFee}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5, borderTopWidth: 1, borderTopColor: 'lightgray', paddingTop: 5 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Total</Text>
                  <Text style={{ fontSize: 16 }}>₹{finalTotalPrice}</Text>
                </View>
              </View>
          )}
        </ScrollView>

        {totalPrice > 0 && (
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: 'lightgray', borderRadius: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginRight: 10 }}>Pay With</Text>
              <Image
                source={images.welcome}
                style={{ width: 30, height: 30 }}
                resizeMode="contain"
              />
            </View>
            <TouchableOpacity onPress={InsertData}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'green', padding: 10, borderRadius: 5 }}>
                <Text style={{ fontSize: 18, color: 'white' }}>{" ₹ "}{finalTotalPrice}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, color: 'white' }}>Place Order</Text>
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
