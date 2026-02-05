import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { HapticButton } from "../../components/ui/HapticButton";
import { WheelPicker } from "../../components/ui/WheelPicker";

// Generate ages 10 to 100
const AGES = Array.from({ length: 91 }, (_, i) => (i + 10).toString());

export default function AgeScreen() {
    const router = useRouter();
    const [selectedAge, setSelectedAge] = useState("24"); // Default around 24

    const handleContinue = () => {
        console.log("User age:", selectedAge);
        router.push("/onboarding/processing"); // Go to processing screen first
    };

    return (
        <SafeAreaView className="flex-1 bg-black justify-between py-8">
            {/* Header */}
            <Animated.View entering={FadeInUp.delay(200)} className="items-center px-6 mt-12">
                <View className="flex-row justify-end w-full mb-4">
                    <TouchableOpacity onPress={() => router.push("/focus")}>
                        <Text className="text-neutral-500 font-medium">Skip</Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-white text-3xl font-bold text-center leading-tight mb-4">
                    How old are you?
                </Text>
                <Text className="text-neutral-500 text-lg text-center">
                    So we can suggest the best setup for you.
                </Text>
            </Animated.View>

            {/* Wheel Picker */}
            <Animated.View entering={FadeInDown.delay(400)} className="w-full items-center">
                <WheelPicker
                    items={AGES}
                    initialIndex={AGES.indexOf("24")}
                    itemHeight={60}
                    onIndexChange={(index) => setSelectedAge(AGES[index])}
                />
            </Animated.View>

            {/* Footer */}
            <Animated.View entering={FadeInDown.delay(600)} className="w-full px-6">
                <HapticButton
                    onPress={handleContinue}
                    className="w-full bg-white rounded-full py-5 shadow-none"
                    style={{ backgroundColor: "white" }}
                >
                    <Text className="text-black font-bold text-lg">Continue</Text>
                </HapticButton>
            </Animated.View>
        </SafeAreaView>
    );
}
