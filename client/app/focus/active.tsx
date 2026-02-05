import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { BreathingBackground } from "../../components/ui/BreathingBackground";
import * as Haptics from "expo-haptics";

import { recordSession } from "../../lib/gamification";

export default function ActiveFocusScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const initialDuration = params.duration ? parseInt(params.duration as string) : 25;

    const [timeLeft, setTimeLeft] = useState(initialDuration * 60);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        let interval: any;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            // Timer finished
            setIsActive(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Record session and navigate
            recordSession(initialDuration).then(() => {
                router.replace("/profile/stats");
            });
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);


    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const handleGiveUp = () => {
        // In a real app, this should confirm "Are you sure?"
        // For now, simple back
        router.dismissAll();
        router.replace("/");
    };

    return (
        <BreathingBackground mode="focus">
            <SafeAreaView className="flex-1 items-center justify-between p-6">
                {/* Top Indicator */}
                <Animated.View entering={FadeIn.delay(500)} className="pt-8">
                    <View className="flex-row items-center space-x-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50">
                        <View className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                        <Text className="text-slate-300 font-medium text-sm">Focus Mode Active</Text>
                    </View>
                </Animated.View>

                {/* Timer */}
                <View className="items-center">
                    <Text className="text-8xl font-bold text-white tracking-widest font-monospaced">
                        {formatTime(timeLeft)}
                    </Text>
                    <Text className="text-slate-400 text-lg mt-2">Stay in the zone.</Text>
                </View>

                {/* Give Up Button */}
                <Animated.View entering={FadeIn.delay(1000)} className="mb-8">
                    <TouchableOpacity
                        onPress={handleGiveUp}
                        className="opacity-50"
                    >
                        <Text className="text-slate-500 text-sm">Give Up</Text>
                    </TouchableOpacity>
                </Animated.View>
            </SafeAreaView>
        </BreathingBackground>
    );
}
