import React from 'react';
import { View, Text, TouchableOpacity, Linking, ScrollView, SafeAreaView } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

const Contact = () => {
  const navigation = useNavigation();

  const handleCall = () => {
    Linking.openURL('tel:+919538505031');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:udupikinaraffpcltd@gmail.com');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-3 mt-4">
        <View>
          <TouchableOpacity className="mt-2" onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          
          <Text className="text-2xl font-bold text-center text-[#ca681c] mb-5">Contact Us</Text>
        </View>

        <View className="flex-row items-center mb-5 ml-5">
          <MaterialIcons name="call" size={28} color="#ca681c" />
          <View className="ml-4">
            <Text className="text-lg font-bold text-gray-800 mb-1">Call us</Text>
            <TouchableOpacity onPress={handleCall}>
              <Text className="text-base text-gray-600">+91 9538505031</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-center mb-5 ml-5">
          <FontAwesome name="envelope" size={28} color="#ca681c" />
          <View className="ml-4">
            <Text className="text-lg font-bold text-gray-800 mb-1">Send us a message</Text>
            <TouchableOpacity onPress={handleEmail}>
              <Text className="text-base text-gray-600">udupikinaraffpcltd@gmail.com</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-center mb-5 ml-5">
          <MaterialIcons name="location-on" size={28} color="#ca681c" />
          <View className="ml-4">
            <Text className="text-lg font-bold text-gray-800 mb-1">Address</Text>
            <Text className="text-base text-gray-600">Canara, Barebail,</Text>
            <Text className="text-base text-gray-600">Mangalore 575004</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Contact;
