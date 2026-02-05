import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { GestureStart } from "../../components/FocusTimer/GestureStart";
import { BreathingBackground } from "../../components/ui/BreathingBackground";

export default function FocusSetupScreen() {
    const router = useRouter();
    const [duration, setDuration] = useState(25); // Default 25 mins

    const handleStart = () => {
        // Navigate to active focus session with the selected duration
        router.push({ pathname: "/focus/active", params: { duration } });
    };

    return (
        <BreathingBackground mode="calm">
            <SafeAreaView className="flex-1 px-6 justify-between">
                {/* Header */}
                <Animated.View entering={FadeInUp.delay(200)} className="w-full flex-row justify-between items-center py-4">
                    <TouchableOpacity onPress={() => router.back()} className="p-2 bg-neutral-800/50 rounded-full">
                        <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white font-semibold text-lg">New Session</Text>
                    <View style={{ width: 40 }} />
                </Animated.View>

                {/* Duration Selector (Simplified for now) */}
                <Animated.View entering={FadeInDown.delay(300)} className="flex-1 items-center justify-center">
                    <Text className="text-neutral-400 text-lg mb-2">I want to focus for</Text>
                    <View className="flex-row items-end">
                        <Text className="text-8xl font-bold text-white tracking-tighter">{duration}</Text>
                        <Text className="text-2xl text-violet-400 font-medium mb-4 ml-2">min</Text>
                    </View>

                    {/* Quick Presets */}
                    <View className="flex-row space-x-4 mt-8">
                        {[15, 25, 45, 60].map((mins) => (
                            <TouchableOpacity
                                key={mins}
                                onPress={() => setDuration(mins)}
                                className={`px-4 py-2 rounded-xl border ${duration === mins ? 'bg-violet-600 border-violet-600' : 'bg-transparent border-neutral-700'}`}
                            >
                                <Text className={duration === mins ? "text-white font-medium" : "text-neutral-400"}>{mins}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>

                {/* Footer / Gesture Start */}
                <Animated.View entering={FadeInDown.delay(500)} className="mb-12 items-center w-full">
                    <GestureStart onStart={handleStart} label="Swipe to Focus" />
                    <Text className="text-neutral-500 text-xs mt-6 text-center max-w-[200px]">
                        Blocking apps & notifications until the timer ends.
                    </Text>
                </Animated.View>
            </SafeAreaView>
        </BreathingBackground>
    );
}
