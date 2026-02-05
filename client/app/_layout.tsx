import "../app/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { OnboardingProvider } from "../context/OnboardingContext";

export default function Layout() {
  return (
    <OnboardingProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#171717" },
          }}
        />
      </GestureHandlerRootView>
    </OnboardingProvider>
  );
}