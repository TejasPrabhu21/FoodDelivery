import React, { useEffect } from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { router, useNavigation } from 'expo-router';

const GoogleSignInComponent = () => {
  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId: '510373110008-glgrr5b0mp6qaod1kn38rviqe4f9f7p8.apps.googleusercontent.com',
    });
  }, []);
  const navigation = useNavigation();

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      // Check if userInfo.data is defined and userInfo.data.user is non-null
      if (userInfo?.data?.user) {
        const { name, photo, id } = userInfo.data.user;

        // Use nullish coalescing to handle potentially undefined values
        const displayName = name ?? 'Unknown Given Name';
        const displayPhoto = photo ?? 'No Photo Available'; // Or use a placeholder URL
        const displayId = id ?? 'Unknown ID';



        console.log(`Given Name: ${displayName}`);
        console.log(`Photo URL: ${displayPhoto}`);
        console.log(`ID: ${displayId}`);
        router.navigate('/(root)/(tabs)/home');
      } else {
        console.log('No user data found.');
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Sign-in was cancelled by the user.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign-in is already in progress.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Google Play Services are not available.');
      } else {
        console.log('Some other error happened:', error);
      }
    }
  };

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={handleGoogleSignIn}
    />
  );
};



export default GoogleSignInComponent;
