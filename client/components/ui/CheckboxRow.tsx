import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, interpolateColor } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface CheckboxRowProps {
    label: string;
    selected: boolean;
    onToggle: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CheckboxRow({ label, selected, onToggle }: CheckboxRowProps) {
    const progress = useSharedValue(selected ? 1 : 0);

    useEffect(() => {
        progress.value = withTiming(selected ? 1 : 0, { duration: 200 });
    }, [selected]);

    const animatedContainerStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            progress.value,
            [0, 1],
            ["rgba(23, 23, 23, 0.6)", "rgb(255, 255, 255)"] // neutral-900/60 to white
        );

        return { backgroundColor };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        const color = interpolateColor(
            progress.value,
            [0, 1],
            ["rgb(255, 255, 255)", "rgb(0, 0, 0)"]
        );
        return { color };
    });

    const animatedCheckboxStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            progress.value,
            [0, 1],
            ["transparent", "rgb(37, 99, 235)"] // transparent to blue-600
        );
        const borderColor = interpolateColor(
            progress.value,
            [0, 1],
            ["rgb(64, 64, 64)", "rgb(37, 99, 235)"] // neutral-700 to blue-600
        );
        return {
            backgroundColor,
            borderColor
        };
    });

    const handlePress = () => {
        Haptics.selectionAsync();
        onToggle();
    };

    return (
        <AnimatedPressable
            onPress={handlePress}
            style={[
                {
                    width: "100%",
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderRadius: 16,
                    marginBottom: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: 'flex-start'
                },
                animatedContainerStyle,
            ]}
        >
            {/* Checkbox */}
            <Animated.View
                style={[
                    {
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        borderWidth: 2,
                        marginRight: 16,
                        alignItems: "center",
                        justifyContent: "center",
                    },
                    animatedCheckboxStyle
                ]}
            >
                {selected && (
                    <MaterialCommunityIcons name="check" size={16} color="white" />
                )}
            </Animated.View>

            <Animated.Text style={[{ fontSize: 16, fontWeight: "500" }, animatedTextStyle]}>
                {label}
            </Animated.Text>
        </AnimatedPressable>
    );
}
