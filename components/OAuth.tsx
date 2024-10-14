import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
  User,
} from "@react-native-google-signin/google-signin";
import { Alert, Image, Text, View } from "react-native";
import CustomButton from "./CustomButton";
import { router } from "expo-router";
import { icons } from "@/constants";
import { supabase } from "@/lib/supabase";

const OAuth = () => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    webClientId:
      "510373110008-glgrr5b0mp6qaod1kn38rviqe4f9f7p8.apps.googleusercontent.com",
  });

  useEffect(() => {
    checkIfSignedIn();
  }, []);

  const checkIfSignedIn = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userInfo");
      if (storedUser) {
        setUserInfo(JSON.parse(storedUser) as User);
        setIsSignedIn(true);
        router.replace("/(root)/(tabs)/home");
      }
    } catch (error) {
      console.error("Error checking sign-in status:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();
      const userData = result.data?.user;

      if (!userData) {
        // If the user dismissed the sign-in modal, do nothing
        return;
      }

      // Check if the user already exists in the database based on email
      const { data: existingUser, error: fetchError } = await supabase
        .from("User")
        .select("*")
        .eq("Email", result.data?.user.email)
        .single(); // Ensure we only get one result

      if (fetchError && fetchError.code !== "PGRST116") {
        // Handle error in the fetch
        console.error("Error checking existing user:", fetchError);
        Alert.alert("Error", "Failed to check user in the database.");
        return;
      }

      if (existingUser) {
        // User already exists
        console.log("Signed in");
      } else {
        // Insert the new user data into Supabase
        const userToInsert = {
          Token: result.data?.user.id, // token_id from Google
          Name: result.data?.user.name,
          Email: result.data?.user.email,
          Image: result.data?.user.photo,
        };

        const { data, error } = await supabase
          .from("User")
          .insert([userToInsert]);

        if (error) {
          console.error("Error inserting user data:", error);
          Alert.alert("Error", "Failed to insert user data into the database.");
          return;
        } else {
          console.log("User inserted:", userToInsert);
        }
      }

      const savemail = result.data?.user.email || ""; // Default to an empty string if undefined
      console.log("OAuth", savemail);
      await AsyncStorage.setItem("savemail", savemail);
      await AsyncStorage.setItem("userInfo", JSON.stringify(userData)); // Save user data

      setUserInfo(userData as unknown as User);
      setIsSignedIn(true);
      router.replace("/(root)/(tabs)/home");
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User pressed outside the Google sign-in screen or cancelled
        console.log("Sign-in was cancelled");
        Alert.alert("Sign-in was cancelled by the user.");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("Sign-in is in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Play services are not available or outdated");
      } else {
        Alert.alert("An unknown error occurred", error.message);
      }
    }
  };

  return (
    <View>
      {!isSignedIn && (
        <CustomButton
          title="Continue with Google"
          className="mt-5 w-full shadow-none"
          IconLeft={() => (
            <Image
              source={icons.google}
              resizeMode="contain"
              className="w-5 h-5 mx-2"
            />
          )}
          bgVariant="outline"
          textVariant="primary"
          onPress={handleGoogleSignIn}
        />
      )}
    </View>
  );
};

export default OAuth;
