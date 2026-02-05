import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withSequence,
    useAnimatedReaction,
    interpolateColor,
    withRepeat,
    Easing,
    runOnJS,
} from "react-native-reanimated";

export default function ProcessingScreen() {
    const router = useRouter();
    const progress = useSharedValue(0);
    const shimmerProgress = useSharedValue(0);
    const [loadingText, setLoadingText] = useState("Calculating...");

    useEffect(() => {
        // Start shimmer animation
        shimmerProgress.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1000 }),
                withTiming(0, { duration: 1000 })
            ),
            -1, // Infinite repeat
            true // Reverse
        );

        // Animate with pauses at 30%, 65%, 85%
        progress.value = withSequence(
            // Go to 30%
            withTiming(30, { duration: 800, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
            // Pause 500ms, then go to 65%
            withDelay(500, withTiming(65, { duration: 1000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })),
            // Pause 500ms, then go to 85%
            withDelay(500, withTiming(85, { duration: 800, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })),
            // Pause 500ms, then go to 100% and finish
            withDelay(500, withTiming(100, { duration: 500, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }, (finished) => {
                if (finished) {
                    runOnJS(router.replace)("/onboarding/analysis");
                }
            }))
        );
    }, []);

    useAnimatedReaction(
        () => progress.value,
        (currentValue, previousValue) => {
            const prev = previousValue ?? 0;
            // Trigger text changes based on thresholds
            // Using slightly offset values to ensure we catch the transition
            if (currentValue >= 30 && prev < 30) {
                runOnJS(setLoadingText)("Analyzing habits...");
            } else if (currentValue >= 65 && prev < 65) {
                runOnJS(setLoadingText)("Personalizing...");
            } else if (currentValue >= 85 && prev < 85) {
                runOnJS(setLoadingText)("Finalizing setup...");
            }
        },
        []
    );

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: `${progress.value}%`,
        };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        const color = interpolateColor(
            shimmerProgress.value,
            [0, 1],
            ["#ffffff", "#3b82f6"] // White to Blue-500
        );
        return {
            color,
        };
    });

    return (
        <SafeAreaView className="flex-1 bg-black justify-center items-center px-8">
            <View className="w-full">
                <Animated.Text
                    className="text-xl font-medium mb-4"
                    style={animatedTextStyle}
                >
                    {loadingText}
                </Animated.Text>

                {/* Progress Bar Container */}
                <View className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                    {/* Animated Progress Fill */}
                    <Animated.View
                        className="h-full bg-blue-500 rounded-full"
                        style={animatedStyle}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
