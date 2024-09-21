import { Stack } from "expo-router";
import "react-native-reanimated";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="orders" options={{ headerShown: false }} />
      <Stack.Screen name="cart" options={{ headerShown: false }} />
      <Stack.Screen name="contact" options={{ headerShown: false }} />
    </Stack>
  );
}
