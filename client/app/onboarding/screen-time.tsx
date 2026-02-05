import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { CustomSlider } from "../../components/ui/CustomSlider";
import { HapticButton } from "../../components/ui/HapticButton";

import { useOnboarding } from "../../context/OnboardingContext";

export default function ScreenTimeScreen() {
    const router = useRouter();
    const { screenTime, setScreenTime } = useOnboarding();
    const [localHours, setLocalHours] = useState(screenTime);

    const handleContinue = () => {
        setScreenTime(localHours);
        console.log("User spends", localHours, "hours on phone");
        router.push("/onboarding/habits"); // Temporary destination
    };

    return (
        <SafeAreaView className="flex-1 bg-black justify-between py-8">
            {/* Header Question */}
            <Animated.View entering={FadeInUp.delay(200)} className="items-center px-6 mt-12">
                <Text className="text-white text-3xl font-bold text-center leading-tight mb-4">
                    How much time do you spend on your phone?
                </Text>
                <Text className="text-neutral-500 text-lg">On your phone only</Text>
            </Animated.View>

            {/* Main Interaction Area */}
            <Animated.View entering={FadeInDown.delay(400)} className="w-full items-center">
                {/* Dynamic Value Display */}
                <View className="mb-12 items-center">
                    <Text className="text-white text-8xl font-bold tracking-tighter">{localHours}</Text>
                    <Text className="text-neutral-400 text-xl font-medium">Hours</Text>
                </View>

                {/* Slider Component */}
                <CustomSlider
                    min={1}
                    max={12}
                    initialValue={localHours}
                    onChange={setLocalHours}
                />
            </Animated.View>

            {/* Footer Actions */}
            <Animated.View entering={FadeInDown.delay(600)} className="w-full px-6 items-center space-y-6">
                <TouchableOpacity>
                    <Text className="text-neutral-400 text-base font-medium">I don't know</Text>
                </TouchableOpacity>

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
