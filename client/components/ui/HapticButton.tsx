import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps, View } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withTiming,
} from "react-native-reanimated";

interface HapticButtonProps extends TouchableOpacityProps {
    children: React.ReactNode;
    onPress?: () => void;
    className?: string; // For NativeWind
    variant?: "primary" | "secondary" | "outline" | "ghost";
    hapticStyle?: Haptics.ImpactFeedbackStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function HapticButton({
    children,
    onPress,
    className = "",
    variant = "primary",
    hapticStyle = Haptics.ImpactFeedbackStyle.Medium,
    ...props
}: HapticButtonProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = () => {
        scale.value = withSpring(0.95, { damping: 10, stiffness: 300 });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 10, stiffness: 300 });
    };

    const handlePress = () => {
        Haptics.impactAsync(hapticStyle);
        if (onPress) {
            onPress();
        }
    };

    // Base styles for different variants
    const baseStyle = "items-center justify-center rounded-2xl py-4 px-6";
    let variantStyle = "";
    let textStyle = "";

    switch (variant) {
        case "primary":
            variantStyle = "bg-violet-600 shadow-lg shadow-violet-900/40";
            textStyle = "text-white font-semibold text-lg";
            break;
        case "secondary":
            variantStyle = "bg-neutral-800 border border-neutral-700";
            textStyle = "text-neutral-200 font-medium text-lg";
            break;
        case "outline":
            variantStyle = "border-2 border-violet-600 bg-transparent";
            textStyle = "text-violet-50 text-lg font-semibold";
            break;
        case "ghost":
            variantStyle = "bg-transparent";
            textStyle = "text-neutral-400 font-medium text-base";
            break;
    }

    return (
        <AnimatedTouchable
            activeOpacity={0.9} // Slight transparency on press, handled mostly by scale
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            className={`${baseStyle} ${variantStyle} ${className}`}
            {...props}
        >
            {typeof children === "string" ? (
                <Text className={textStyle}>{children}</Text>
            ) : (
                children
            )}
        </AnimatedTouchable>
    );
}
