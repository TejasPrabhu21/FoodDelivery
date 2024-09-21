import { Alert } from "react-native";
import RazorpayCheckout from "react-native-razorpay";

// export const handlePayment = () => {
//   var options = {
//     description: "PaymentSheet",
//     image: "https://your-company-logo.png",
//     currency: "INR",
//     key: "rzp_test_f4LdL00XYsuf1v", // Replace with your Razorpay key
//     amount: 10000, // Amount in paisa (5000 paisa = 50 INR)
//     name: "PaymentTest",
//     order_id: "1", // Replace with an order_id from your backend
//     prefill: {
//       email: "codemavericks404@gmail.com",
//       contact: "6363347203",
//       name: "Test Mode",
//     },
//     theme: { color: "#53a20e" },
//   };

//   RazorpayCheckout.open(options)
//     .then((data) => {
//       const paymentData = {
//         razorpay_payment_id: data.razorpay_payment_id,
//         order_id: options.order_id,
//         razorpay_signature: data.razorpay_signature,
//       };
//       Alert.alert("Payment Success", `Payment ID: ${data.razorpay_payment_id}`);
//     })
//     .catch((error) => {
//       // Handle failure
//       Alert.alert("Payment Failed", `${error.code} | ${error.description}`);
//     });
// };

export const handlePayment = (userInfo) => {
  var options = {
    description: 'Sample Payment',
    image: 'https://your-company-logo.png',
    currency: 'INR',
    key: 'rzp_test_f4LdL00XYsuf1v', // Replace with your actual key ID
    amount: 1000, // Amount is in paise (i.e., 5000 paise = INR 50)
    name: 'Acme Corp',
    prefill: {
      email: userInfo.email,
      contact: '9191919191',
      name: userInfo.name,
    },
    theme: { color: '#53a20e' },
  };

  RazorpayCheckout.open(options)
    .then((data) => {
      // handle success
      alert(`Success: ${data.razorpay_payment_id}`);
    })
    .catch((error) => {
      // handle failure
      alert(`Error: ${error.code} | ${error.description}`);
    });
};
