import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    runOnJS,
    withSpring,
    useDerivedValue,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { HapticButton } from "./HapticButton";

interface CustomSliderProps {
    min: number;
    max: number;
    step?: number;
    initialValue?: number;
    onChange: (value: number) => void;
}

const { width } = Dimensions.get("window");
const PADDING = 24;
const SLIDER_WIDTH = width - PADDING * 2 - 120; // Minus buttons width roughly
const KNOB_SIZE = 28;

export function CustomSlider({
    min = 1,
    max = 10,
    step = 1,
    initialValue = 4,
    onChange,
}: CustomSliderProps) {
    const progress = useSharedValue(0); // 0 to 1
    const context = useSharedValue(0);
    const activeValue = useSharedValue(initialValue);

    // Initialize
    useEffect(() => {
        const initialProgress = (initialValue - min) / (max - min);
        progress.value = initialProgress;
    }, []);

    const updateValueFromProgress = (p: number) => {
        const rawValue = min + p * (max - min);
        const steppedValue = Math.round(rawValue / step) * step;

        // Only trigger update if value changed
        if (steppedValue !== activeValue.value) {
            activeValue.value = steppedValue;
            runOnJS(onChange)(steppedValue);
            runOnJS(Haptics.selectionAsync)();
        }
    };

    const pan = Gesture.Pan()
        .onStart(() => {
            context.value = progress.value;
        })
        .onUpdate((event) => {
            const newProgress = Math.min(
                Math.max(context.value + event.translationX / SLIDER_WIDTH, 0),
                1
            );
            progress.value = newProgress;
            runOnJS(updateValueFromProgress)(newProgress);
        });

    const animatedKnobStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: progress.value * SLIDER_WIDTH }],
        };
    });

    const animatedFillStyle = useAnimatedStyle(() => {
        return {
            width: progress.value * SLIDER_WIDTH,
        };
    });

    const handleDecrement = () => {
        const newValue = Math.max(activeValue.value - step, min);
        const newProgress = (newValue - min) / (max - min);
        progress.value = withSpring(newProgress);
        activeValue.value = newValue; // Update immediately for logic
        onChange(newValue);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleIncrement = () => {
        const newValue = Math.min(activeValue.value + step, max);
        const newProgress = (newValue - min) / (max - min);
        progress.value = withSpring(newProgress);
        activeValue.value = newValue; // Update immediately for logic
        onChange(newValue);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
        <View className="flex-row items-center justify-between w-full px-4">
            {/* Minus Button */}
            <HapticButton
                onPress={handleDecrement}
                className="w-12 h-12 rounded-full bg-neutral-800 items-center justify-center"
                variant="secondary"
                style={{ paddingHorizontal: 0, paddingVertical: 0 }} // Override default padding
            >
                <MaterialCommunityIcons name="minus" size={24} color="#a3a3a3" />
            </HapticButton>

            {/* Slider Track */}
            <View style={{ width: SLIDER_WIDTH, height: 40, justifyContent: "center" }}>
                {/* Track Background */}
                <View className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                    {/* Filled Track */}
                    <Animated.View className="h-full bg-blue-500 rounded-full" style={animatedFillStyle} />
                </View>

                {/* Floating Knob */}
                <GestureDetector gesture={pan}>
                    <Animated.View
                        style={[
                            {
                                position: "absolute",
                                left: -KNOB_SIZE / 2,
                                width: KNOB_SIZE,
                                height: KNOB_SIZE,
                                borderRadius: KNOB_SIZE / 2,
                                backgroundColor: "white",
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.3,
                                shadowRadius: 3,
                                elevation: 5,
                            },
                            animatedKnobStyle,
                        ]}
                    />
                </GestureDetector>
            </View>

            {/* Plus Button */}
            <HapticButton
                onPress={handleIncrement}
                className="w-12 h-12 rounded-full bg-neutral-800 items-center justify-center"
                variant="secondary"
                style={{ paddingHorizontal: 0, paddingVertical: 0 }}
            >
                <MaterialCommunityIcons name="plus" size={24} color="#a3a3a3" />
            </HapticButton>
        </View>
    );
}
