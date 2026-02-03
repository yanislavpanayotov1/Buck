import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    withSequence,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

interface BreathingBackgroundProps {
    children?: React.ReactNode;
    mode?: "calm" | "focus" | "break";
}

const { width, height } = Dimensions.get("window");

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export function BreathingBackground({ children, mode = "calm" }: BreathingBackgroundProps) {
    const scale = useSharedValue(1.1);
    const opacity = useSharedValue(0.4);

    // Configuration for different modes
    const config = {
        calm: {
            bg: "#171717", // neutral-900
            colors: ["#7c3aed", "transparent"] as const, // violet-600
        },
        focus: {
            bg: "#020617", // slate-950
            colors: ["#0ea5e9", "transparent"] as const, // sky-500
        },
        break: {
            bg: "#064e3b", // emerald-900 (darker base)
            colors: ["#10b981", "transparent"] as const, // emerald-500
        },
    };

    const currentConfig = config[mode];

    useEffect(() => {
        // Subtle breathing animation
        scale.value = withRepeat(
            withSequence(
                withTiming(1.3, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
                withTiming(1.1, { duration: 6000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );

        opacity.value = withRepeat(
            withSequence(
                withTiming(0.3, { duration: 5000 }),
                withTiming(0.5, { duration: 5000 })
            ),
            -1,
            true
        );
    }, [mode]);

    const animatedOrbStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
            opacity: opacity.value,
        };
    });

    return (
        <View style={[styles.container, { backgroundColor: currentConfig.bg }]}>
            {/* Top Orb */}
            <AnimatedGradient
                colors={currentConfig.colors}
                style={[
                    styles.orb,
                    {
                        top: -width * 0.4,
                        left: -width * 0.2,
                    },
                    animatedOrbStyle,
                ]}
            />

            {/* Bottom Orb */}
            <AnimatedGradient
                colors={currentConfig.colors}
                style={[
                    styles.orb,
                    {
                        bottom: -width * 0.4,
                        right: -width * 0.2,
                    },
                    animatedOrbStyle,
                ]}
            />

            {/* Content Container */}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: "hidden",
    },
    orb: {
        position: "absolute",
        width: width * 1.5,
        height: width * 1.5,
        borderRadius: width * 0.75, // Circular
    },
    content: {
        flex: 1,
        zIndex: 1,
    },
});
