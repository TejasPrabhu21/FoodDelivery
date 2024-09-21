import React from 'react';
import { TouchableHighlight, Text, Alert } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';


const PaymentScreen = () => {
  const handlePayment = () => {
    var options = {
      description: 'PaymentSheet',
      image: 'https://static.vecteezy.com/system/resources/thumbnails/002/387/693/small_2x/user-profile-icon-free-vector.jpg',
      currency: 'INR',
      key: 'rzp_test_f4LdL00XYsuf1v', // Replace with your Razorpay key
      amount: '10000', // Amount in paisa (5000 paisa = 50 INR)
      name: 'PaymentTest',
      order_id: '1', // Replace with an order_id from your backend
      prefill: {
        email: 'codemavericks404@gmail.com',
        contact: '6363347203',
        name: 'Test Mode'
      },
      theme: { color: '#53a20e' }
    };

    RazorpayCheckout.open(options).then((data) => {
      // Handle success
      const paymentData = {
        razorpay_payment_id: data.razorpay_payment_id,
        order_id: options.order_id,
        razorpay_signature: data.razorpay_signature,
      };
      Alert.alert('Payment Success', `Payment ID: ${data.razorpay_payment_id}`);
    }).catch((error) => {
      // Handle failure
      Alert.alert('Payment Failed', `${error.code} | ${error.description}`);
    });
  };

  return (
    <TouchableHighlight onPress={handlePayment} style={{ padding: 10, backgroundColor: '#53a20e' }}>
      <Text style={{ color: '#fff', textAlign: 'center' }}>Pay Now</Text>
    </TouchableHighlight>
  );
};

export default PaymentScreen;
