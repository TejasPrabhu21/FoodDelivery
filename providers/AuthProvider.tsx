import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleSignin,
  statusCodes,
  User,
} from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";
import { router } from "expo-router";

interface AuthContextType {
  userInfo: User | null;
  isSignedIn: boolean;
  handleGoogleSignIn: () => Promise<void>;
  handleSignOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    checkIfSignedIn();
  }, []);

  const checkIfSignedIn = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userInfo");
      if (storedUser) {
        setUserInfo(JSON.parse(storedUser) as User);
        setIsSignedIn(true);
      }
    } catch (error) {
      console.error("Error checking sign-in status:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      await AsyncStorage.setItem(
        "userInfo",
        JSON.stringify(userInfo.data?.user)
      );
      setUserInfo(userInfo as unknown as User);
      setIsSignedIn(true);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Sign-in was cancelled by the user");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("Sign-in is in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Play services are not available or outdated");
      } else {
        Alert.alert("An unknown error occurred", error.message);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      await AsyncStorage.removeItem("userInfo");
      setUserInfo(null);
      setIsSignedIn(false);
      router.replace("/(auth)/welcome");
      Alert.alert("You have signed out successfully");
    } catch (error) {
      Alert.alert("Failed to sign out", (error as Error).message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        isSignedIn,
        handleGoogleSignIn,
        handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};