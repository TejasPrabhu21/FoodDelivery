import React, { useEffect } from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const GoogleSignInComponent = () => {
  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId: '510373110008-glgrr5b0mp6qaod1kn38rviqe4f9f7p8.apps.googleusercontent.com',
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

   //   const { givenName, familyName } = userInfo.User; 

   //   console.log(`Given Name: ${givenName}, Family Name: ${familyName}`);
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
