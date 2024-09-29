// CustomDrawer.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Octicons, FontAwesome, AntDesign, MaterialIcons, Entypo } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { DrawerContentScrollView } from '@react-navigation/drawer';

const CustomDrawerContent: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { handleSignOut } = useAuth();

  return (
    <DrawerContentScrollView {...{ navigation }}>
      <View className="flex-1 p-4 bg-white">
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} className="pl-2">
          <Octicons name="x" size={28} color="#ca681c" />
        </TouchableOpacity>

        {/* Navigation Links */}
        <Link href="/profile" asChild>
          <TouchableOpacity className="flex-row items-center py-4 pl-4">
            <FontAwesome name="user" size={24} color="#ca681c" />
            <Text className="text-lg ml-2">Profile</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/cart" asChild>
          <TouchableOpacity className="flex-row items-center py-4 pl-4">
            <AntDesign name="shoppingcart" size={24} color="#ca681c" />
            <Text className="text-lg ml-2">Cart</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/orders" asChild>
          <TouchableOpacity className="flex-row items-center py-4 pl-4">
            <MaterialIcons name="receipt" size={24} color="#ca681c" />
            <Text className="text-lg ml-2">Orders</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/contact" asChild>
          <TouchableOpacity className="flex-row items-center py-4 pl-4">
            <Entypo name="phone" size={24} color="#ca681c" />
            <Text className="text-lg ml-2">Contact</Text>
          </TouchableOpacity>
        </Link>

        {/* Sign Out Button at the Bottom */}
        <TouchableOpacity className="flex-row items-center py-4 pl-4" onPress={handleSignOut}>
          <AntDesign name="logout" size={24} color="#ca681c" />
          <Text className="text-lg ml-2">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
