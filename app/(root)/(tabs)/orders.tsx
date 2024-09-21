import React, { useEffect, useState } from "react";
import { View, Text,Image, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Modal } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { icons } from "@/constants";
import { images } from "@/constants";

interface Order {
  Order_id: number;
  Order_date: string;
  Order_Status: string;
  Address: string;
  Total_Amount: number;
  Delivery_Fee: number;
  Payment_Method?: string; // Make optional
  Payment_Status?: string; // Make optional
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

  // Fetch saved email from AsyncStorage
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("savemail");
        if (storedEmail) {
          setSavemail(storedEmail);
        }
      } catch (error) {
        console.error("Error retrieving savemail:", error);
      }
    };

    fetchEmail();
  }, []);

  // Function to fetch user ID based on email
  const fetchUserId = async (savemail: string) => {
    const { data, error } = await supabase
      .from('User')
      .select('User_id')
      .eq('Email', savemail)
      .single(); // Assuming only one user per email

    if (error) {
      console.error("Error fetching user id:", error);
      return null;
    }

    return data?.User_id;
  };

  // Function to fetch orders based on user ID
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

    return data; // List of orders
  };

  // Function to fetch order items based on order ID
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

  // Fetch the orders for the user when savemail is available
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      if (savemail) {
        const userId = await fetchUserId(savemail);

        if (userId) {
          const orders = await fetchOrdersByUserId(userId);
          setOrders(orders); // Save orders to state
        } else {
          setError("User not found.");
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [savemail]);

  // Handle viewing details of an order
  const handleViewDetails = async (order: Order) => {
    setSelectedOrder(order);

    const items = await fetchOrderItems(order.Order_id);
    setOrderItems(items); // Save order items to state

    setShowModal(true);
  };

  // Get border color based on order status
  const getOrderBorderColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "#ff6347"; // Tomato
      case "delivered":
        return "#32cd32"; // LimeGreen
      default:
        return "#d3d3d3"; // LightGray
    }
  };

  // Render each order in the list
  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={[styles.orderItem, { borderColor: getOrderBorderColor(item.Order_Status) }]}>
      <Text style={styles.orderId}>Order ID: {item.Order_id}</Text>
      <Text style={styles.orderDetail}>Date: {new Date(item.Order_date).toLocaleDateString()}</Text>
      <Text style={styles.orderDetail}>Status: {item.Order_Status}</Text>
      <Text style={styles.orderDetail}>Address: {item.Address}</Text>
      <Text style={styles.orderTotal}>Total: ₹{item.Total_Amount + item.Delivery_Fee}</Text>
      <TouchableOpacity style={styles.viewDetailsButton} onPress={() => handleViewDetails(item)}>
        <Text style={styles.viewDetailsButtonText}>View Details</Text>
        <AntDesign name="right" size={16} color="white" />
      </TouchableOpacity>
    </View>
  );

  // Loading or error states
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="black" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
             <Image source={images.noResult} style={{ width: 150, height: 150, marginBottom: 20 }} />
             <Text style={{ fontSize: 24, textAlign: 'center', color: 'gray' }}>
                      No orders have been made yet.
             </Text>
        </View>

      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <AntDesign name="arrowleft" size={24} color="black" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.Order_id.toString()}
        contentContainerStyle={styles.listContainer}
      />

      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Order Details</Text>
            {orderItems.map((item) => (
              <View key={item.id} style={styles.modalItemRow}>
                <Text style={styles.modalItemText}>{item.name} (x{item.quantity})</Text>
                <Text style={styles.modalItemText}>₹{item.price * item.quantity}</Text>
              </View>
            ))}
            <View style={styles.modalSummaryRow}>
              <Text style={styles.modalSummaryText}>Subtotal</Text>
              <Text style={styles.modalSummaryText}>₹{selectedOrder?.Total_Amount ?? 0}</Text>
            </View>
            <View style={styles.modalSummaryRow}>
              <Text style={styles.modalSummaryText}>Delivery Fee</Text>
              <Text style={styles.modalSummaryText}>₹{selectedOrder?.Delivery_Fee ?? 0}</Text>
            </View>
            <View style={styles.modalSummaryRow}>
              <Text style={styles.modalSummaryText}>Total</Text>
              <Text style={styles.modalSummaryText}>₹{(selectedOrder?.Total_Amount ?? 0) + (selectedOrder?.Delivery_Fee ?? 0)}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    margin: 15,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  noOrdersContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noOrdersText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",},
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#555",
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#d9534f", // Bootstrap danger color
    fontSize: 16,
  },
  orderItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d3d3d3",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  orderId: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  orderDetail: {
    fontSize: 14,
    marginBottom: 5,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#ca681c", // Button color
    padding: 12,
    borderRadius: 6,
  },
  viewDetailsButtonText: {
    color: "white",
    marginRight: 8,
    fontWeight: "bold",
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  modalItemText: {
    fontSize: 16,
  },
  modalSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 8,
  },
  modalSummaryText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#ca681c",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Orders;
