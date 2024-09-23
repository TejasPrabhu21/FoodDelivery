import { Alert } from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { supabase } from "./supabase";
import { icons, images } from "@/constants";

export const handlePayment = async (orderId, userId, totalPrice) => {
    var options = {
        description: 'Payment',
        image: 'https://qjvdrhwtxyceipxhqtdd.supabase.co/storage/v1/object/public/Product_image/Logo/welcome.png',
        currency: 'INR',
        key: 'rzp_test_f4LdL00XYsuf1v', // Replace with your Razorpay key
        amount: totalPrice*100, // Amount in paisa (10000 paisa = 100 INR)
        name: 'Kinara Tasty',
        prefill: {
            email: 'codemavericks404@gmail.com',
            contact: '6363347203',
            name: 'Test Mode'
        },
        theme: { color: '#ca681c' }
    };

    try {
        const data = await RazorpayCheckout.open(options);
        const razorpay_payment_id = data.razorpay_payment_id;
        
        console.log(razorpay_payment_id);

        // Prepare payment data for Supabase
        const paymentData = {
            User_id: userId,
            Transaction_id: razorpay_payment_id,
            Order_id: orderId,
            Payment_method: 'online',
            Total_Amount: totalPrice
        };

        // Insert payment data into Supabase
        const { data: paymentResponse, error } = await supabase
            .from('Payment') // Replace with your table name
            .insert([paymentData]);

        if (error) {
            Alert.alert('Payment Error', 'Failed to save payment details.');
            console.error(error);
        } else {
            // Update Order table on success
            const { error: updateError } = await supabase
                .from('Order') // Replace with your Order table name
                .update({ Payment_Status: 'success' }) // Set Payment_status to success
                .eq('Order_id', orderId); // Specify the order to update

            if (updateError) {
                Alert.alert('Update Error', 'Failed to update the order status.');
                console.error(updateError);
            } else {
                Alert.alert('Payment Success', `Payment ID: ${razorpay_payment_id}`);
            }
        }

    } catch (error) {
        // Handle failure
        Alert.alert('Payment Failed', `${error.code} | ${error.description}`);
        

        // Delete the order if the payment failed
        const { error: deleteError } = await supabase
            .from('Order') // Replace with your Order table name
            .delete()
            .eq('Order_id', orderId); // Specify the order to delete

        if (deleteError) {
            Alert.alert('Delete Error', 'Failed to delete the order.');
            console.error(deleteError);
        } else {
            Alert.alert('Order Deleted', 'The order has been deleted due to payment failure.');
        }
    }
};
