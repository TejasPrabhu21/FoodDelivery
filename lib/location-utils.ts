import * as Location from "expo-location";
import * as LocationGeocoding from "expo-location";
import { Alert } from "react-native";

export const CheckIfLocationEnabled = async (): Promise<boolean> => {
  let enabled = await Location.hasServicesEnabledAsync();

  if (!enabled) {
    Alert.alert(
      "Location Services not enabled",
      "Please enable your location services to continue",
      [{ text: "OK" }],
      { cancelable: false }
    );
  } else {
    return true;
  }
  return false;
};

export const GetCurrentLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    Alert.alert(
      "Permission not granted",
      "Allow the app to use the location service",
      [{ text: "OK" }],
      { cancelable: false }
    );
    return;
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  if (location.coords) {
    const { latitude, longitude } = location.coords;

    let response = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    const [fullAddress] = await LocationGeocoding.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    for (let item of response) {
      let address = `${fullAddress.formattedAddress}`;

      return address;
    }
  }
};
