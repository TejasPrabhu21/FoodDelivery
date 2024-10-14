import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Modal, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Order {
  Order_id: number;
  Order_date: string;
  Order_Status: string;
  Address: string;
  Total_Amount: number;
  Delivery_Fee: number;
}

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [savemail, setSavemail] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("savemail");
        setSavemail(storedEmail);
      } catch (error) {
        console.error("Error retrieving savemail:", error);
      }
    };
    fetchEmail();
  }, []);

  const fetchUserId = async (savemail: string) => {
    const { data, error } = await supabase
      .from('User')
      .select('User_id')
      .eq('Email', savemail)
      .single();

    if (error) {
      console.error("Error fetching user id:", error);
      return null;
    }

    return data?.User_id;
  };

  const fetchOrdersByUserId = async (userId: number) => {
    const { data, error } = await supabase
      .from('Order')
      .select('Order_id, Order_date, Order_Status, Address, Total_Amount, Delivery_Fee')
      .eq('User_id', userId)
      .order('Order_date', { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return [];
    }

    return data;
  };

  const fetchOrderItems = async (orderId: number) => {
    const { data, error } = await supabase
      .from('Order_Item')
      .select('Product_id, Quantity, Product(Product_name, Product_price)')
      .eq('Order_id', orderId);

    if (error) {
      console.error("Error fetching order items:", error);
      return [];
    }

    return data.map((item: any) => ({
      id: item.Product_id,
      name: item.Product.Product_name,
      quantity: item.Quantity,
      price: item.Product.Product_price,
    }));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      if (savemail) {
        const userId = await fetchUserId(savemail);
        if (userId) {
          const orders = await fetchOrdersByUserId(userId);
          setOrders(orders);
        } else {
          setError("User not found.");
        }
      }
      setLoading(false);
    };
    fetchUserData();
  }, [savemail]);

  const handleViewDetails = async (order: Order) => {
    setSelectedOrder(order);
    const items = await fetchOrderItems(order.Order_id);
    setOrderItems(items);
    setShowModal(true);
  };

  const getOrderBorderColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "border-red-500"; 
      case "delivered":
        return "border-green-500"; 
      default:
        return "border-gray-300"; 
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View className={`shadow-md rounded-lg ${getOrderBorderColor(item.Order_Status)} border-2 p-4 ml-5 mr-5 mb-2 bg-white`}>
      <Text className="font-bold text-lg mb-1">Order ID: {item.Order_id}</Text>
      <Text className="text-sm mb-1">Date: {new Date(item.Order_date).toLocaleDateString()}</Text>
      <Text className="text-sm mb-1">Status: {item.Order_Status}</Text>
      <Text className="text-sm mb-1">Address: {item.Address}</Text>
      <Text className="font-bold text-lg mt-2">Total: ₹{item.Total_Amount + item.Delivery_Fee}</Text>
      <TouchableOpacity className="mt-2 bg-[#ca681c] p-3 rounded flex-row items-center" onPress={() => handleViewDetails(item)}>
        <Text className="text-white font-bold mr-2">View Details</Text>
        <AntDesign name="right" size={16} color="white" />
      </TouchableOpacity>
    </View>
  );

  if (loading || error || orders.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center m-4">
          <AntDesign name="arrowleft" size={24} color="black" />
          <Text className="font-bold text-lg ml-2">Back</Text>
        </TouchableOpacity>
        <View className="flex-1 bg-gray-50 items-center justify-center"> 
          {loading && <ActivityIndicator size="large" color="gray" />}
          {error && <Text className="text-red-500">{error}</Text>}
          {!loading && !error && orders.length === 0 && (
            <Text className="text-2xl text-gray-500 text-center">No orders have been made yet.</Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <TouchableOpacity onPress={() => router.back()} className="flex-row items-center m-4">
        <AntDesign name="arrowleft" size={24} color="black" />
        <Text className="font-bold text-lg ml-2">Back</Text>
      </TouchableOpacity>
      <View className="mb-20">
      <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.Order_id.toString()
            
          }
      />
      </View>

      <Modal visible={showModal} transparent={true} animationType="slide">
      <View className="flex-1 bg-black/50 justify-center">
      <View className="bg-white mx-5 rounded-lg p-5">
            <Text className="text-lg font-bold mb-4">Order Details</Text>
            {orderItems.map((item) => (
              <View key={item.id} className="flex-row justify-between my-2">
                <Text className="text-base">{item.name} (x{item.quantity})</Text>
                <Text className="text-base">₹{item.price * item.quantity}</Text>
              </View>
            ))}
            <View className="flex-row justify-between border-t border-gray-300 pt-4">
              <Text className="font-bold">Subtotal</Text>
              <Text className="font-bold">₹{selectedOrder?.Total_Amount ?? 0}</Text>
            </View>
            <View className="flex-row justify-between my-2">
              <Text className="font-bold">Delivery Fee</Text>
              <Text className="font-bold">₹{selectedOrder?.Delivery_Fee ?? 0}</Text>
            </View>
            <View className="flex-row justify-between border-t border-gray-300 pt-4">
              <Text className="font-bold">Total</Text>
              <Text className="font-bold">₹{(selectedOrder?.Total_Amount ?? 0) + (selectedOrder?.Delivery_Fee ?? 0)}</Text>
            </View>
            <TouchableOpacity className="mt-4 bg-[#ca681c] p-3 rounded items-center" onPress={() => setShowModal(false)}>
              <Text className="text-white font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Orders;
