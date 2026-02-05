import { Stack } from "expo-router";

export default function OnboardingLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#171717" } }}>
            <Stack.Screen name="screen-time" />
        </Stack>
    );
}
