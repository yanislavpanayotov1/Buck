import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../../components/ui/HapticButton";

const { width } = Dimensions.get("window");

export default function PermissionsScreen() {
    const router = useRouter();

    const handleContinue = () => {
        // In a real app, this would trigger the actual permission request.
        // For now, we simulate success and move to focus.
        router.replace("/focus");
    };

    return (
        <SafeAreaView className="flex-1 bg-black justify-between items-center" edges={['top', 'bottom']}>

            {/* Main Content Area - Centered */}
            <View className="flex-1 justify-center items-center px-6 w-full">

                {/* Visual Cue / Header (Optional, based on flow, but user asked for cutout mostly) */}
                {/* We can leave the top empty or add a small header if needed, but for now focusing on the cutout */}

                {/* iOS Permission Alert Cutout */}
                {/* 
                   Mimicking the iOS alert:
                   - Rounded corners (xl or 2xl)
                   - Dark gray background (approx #1E1E1E or neutral-900)
                   - Blur effect is hard to do exactly without native views, but solid color works for "cutout" look.
                   - Width: usually strictly defined or % of screen.
                */}
                <View
                    style={{
                        backgroundColor: "#252525", // Approximate iOS dark mode alert color
                        width: 270, // Standard iOS alert width
                        borderRadius: 14,
                        overflow: 'hidden',
                        borderWidth: 1.5,
                        borderColor: "rgba(84, 84, 88, 0.65)"
                    }}
                    className="items-center"
                >
                    {/* Alert Content */}
                    <View className="px-4 pt-5 pb-4 items-center">
                        <Text className="text-white text-base font-bold text-center mb-1">
                            "Buck" Would Like to Access Screen Time
                        </Text>
                        <Text className="text-white font-normal text-xs text-center leading-4">
                            Providing "Buck" access to Screen Time may allow it to see your activity data, restrict content, and limit the usage of apps and websites.
                        </Text>
                    </View>

                    {/* Divider Horizontal */}
                    <View style={{ height: 0.5, backgroundColor: "#3F3F3F", width: "100%" }} />

                    {/* Buttons Row */}
                    <View className="flex-row w-full h-11">
                        {/* Don't Allow */}
                        <View className="flex-1 justify-center items-center">
                            <Text className="text-[#0A84FF] text-[17px] font-normal">
                                Don't Allow
                            </Text>
                        </View>

                        {/* Divider Vertical */}
                        <View style={{ width: 0.5, backgroundColor: "#3F3F3F", height: "100%" }} />

                        {/* Allow (Simulated as bold usually, or just blue) */}
                        <View className="flex-1 justify-center items-center">
                            <Text className="text-[#0A84FF] text-[17px] font-bold">
                                Continue
                            </Text>
                        </View>
                    </View>
                </View>

            </View>

            {/* Footer Action Button */}
            <View className="w-full px-6 pb-6">
                <HapticButton
                    onPress={handleContinue}
                    className="w-full bg-white rounded-full py-5 shadow-none"
                    style={{ backgroundColor: "white" }}
                >
                    <Text className="text-black font-bold text-lg">Continue</Text>
                </HapticButton>
            </View>
        </SafeAreaView>
    );
}
