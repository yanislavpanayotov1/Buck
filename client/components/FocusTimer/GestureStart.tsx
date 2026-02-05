import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
    withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface GestureStartProps {
    onStart: () => void;
    label?: string;
}

const BUTTON_HEIGHT = 60;
const BUTTON_WIDTH = Dimensions.get("window").width - 48; // Padding
const SWIPEABLE_DIMENSIONS = BUTTON_HEIGHT - 8;
const H_SWIPE_RANGE = BUTTON_WIDTH - BUTTON_HEIGHT;

export function GestureStart({ onStart, label = "Slide to Focus" }: GestureStartProps) {
    const translateX = useSharedValue(0);
    const isComplete = useSharedValue(false);

    const context = useSharedValue(0);

    const pan = Gesture.Pan()
        .onStart(() => {
            context.value = translateX.value;
        })
        .onUpdate((event) => {
            if (isComplete.value) return;
            const newValue = event.translationX + context.value;
            translateX.value = Math.min(Math.max(newValue, 0), H_SWIPE_RANGE);
        })
        .onEnd(() => {
            if (isComplete.value) return;

            if (translateX.value >= H_SWIPE_RANGE - 20) {
                // Successful swipe
                translateX.value = withTiming(H_SWIPE_RANGE);
                isComplete.value = true;

                // Haptic feedback
                runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Success);
                runOnJS(onStart)();
            } else {
                // Reset
                translateX.value = withSpring(0, { damping: 15 });
                runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
            }
        });

    const animatedKnobStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(translateX.value > 20 ? 0 : 1),
        };
    });

    const animatedFillStyle = useAnimatedStyle(() => {
        return {
            width: translateX.value + SWIPEABLE_DIMENSIONS,
        };
    });

    return (
        <View style={styles.container}>
            <View style={styles.track}>
                {/* Fill Background */}
                <Animated.View style={[styles.fill, animatedFillStyle]}>
                    <LinearGradient
                        colors={["#8b5cf6", "#7c3aed"]} // violet-500 to violet-600
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={{ flex: 1, borderRadius: BUTTON_HEIGHT / 2 }}
                    />
                </Animated.View>

                {/* Text Label */}
                <Animated.View style={[styles.textContainer, animatedTextStyle]}>
                    <Text style={styles.text}>{label}</Text>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#a3a3a3" />
                </Animated.View>

                {/* Knob */}
                <GestureDetector gesture={pan}>
                    <Animated.View style={[styles.knob, animatedKnobStyle]}>
                        <MaterialCommunityIcons name="arrow-right" size={24} color="#8b5cf6" />
                    </Animated.View>
                </GestureDetector>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: BUTTON_HEIGHT,
        width: BUTTON_WIDTH,
        marginTop: 20,
    },
    track: {
        flex: 1,
        backgroundColor: "#262626", // neutral-800
        borderRadius: BUTTON_HEIGHT / 2,
        justifyContent: "center",
        position: "relative",
    },
    knob: {
        width: SWIPEABLE_DIMENSIONS,
        height: SWIPEABLE_DIMENSIONS,
        borderRadius: SWIPEABLE_DIMENSIONS / 2,
        backgroundColor: "white",
        position: "absolute",
        left: 4,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    textContainer: {
        position: "absolute",
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
    text: {
        color: "#a3a3a3", // neutral-400
        fontSize: 16,
        fontWeight: "600",
        marginRight: 4,
    },
    fill: {
        height: "100%",
        position: "absolute",
        left: 0,
        borderRadius: BUTTON_HEIGHT / 2,
    },
});
