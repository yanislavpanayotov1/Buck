import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { HapticButton } from "../../components/ui/HapticButton";
import { useOnboarding } from "../../context/OnboardingContext";
import { Shield, Clock, Calendar } from "lucide-react-native";

export default function CommitmentScreen() {
    const router = useRouter();
    const { screenTime, age } = useOnboarding();

    // Calculations (reusing logic from analysis.tsx for consistency)
    const wakingHoursPerDay = 16;
    const yearsLeft = 80 - age;
    const yearsLost = (screenTime / wakingHoursPerDay) * yearsLeft;
    const yearsSaved = Math.max(1, Math.round(yearsLost * 0.33));

    // Calculate reduction stats
    const reducedScreenTime = Math.max(0, screenTime * 0.7); // 30% reduction
    const reducedHours = Math.floor(reducedScreenTime);
    const reducedMinutes = Math.round((reducedScreenTime - reducedHours) * 60);

    const handleCommit = () => {
        router.replace("/paywall");
    };

    return (
        <SafeAreaView className="flex-1 bg-black justify-between" edges={['top', 'bottom']}>
            <View className="flex-1 px-6 pt-8">
                {/* Header */}
                <Text className="text-white text-3xl font-bold text-center leading-tight mb-2">
                    Buck can help you get back
                </Text>

                {/* Gradient Text */}
                <View className="h-16 items-center justify-center mb-12">
                    <MaskedView
                        maskElement={
                            <Text className="text-4xl font-black text-center tracking-tighter">
                                {yearsSaved} years <Text className="text-white">of your life:</Text>
                            </Text>
                        }
                        style={{ height: 50, width: "100%" }}
                    >
                        <LinearGradient
                            colors={["#a855f7", "#3b82f6"]} // Purple to Blue
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0.5, y: 0 }}
                            style={{ flex: 1 }}
                        >
                            <Text className="text-4xl font-black text-center tracking-tighter opacity-0">
                                {yearsSaved} years <Text className="text-white">of your life:</Text>
                            </Text>
                        </LinearGradient>
                    </MaskedView>
                </View>

                {/* Benefits List */}
                <View className="gap-8">
                    {/* Item 1 */}
                    <View className="flex-row gap-4">
                        <View className="pt-1">
                            <Shield size={24} color="white" fill="white" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white text-lg font-bold mb-1">
                                30% less screen time
                            </Text>
                            <Text className="text-neutral-400 text-base leading-relaxed">
                                Reduce your Screen Time by <Text className="text-white font-bold">30%</Text> to <Text className="text-white font-bold">{reducedHours}h {reducedMinutes}m</Text> each day
                            </Text>
                        </View>
                    </View>

                    {/* Item 2 */}
                    <View className="flex-row gap-4">
                        <View className="pt-1">
                            <Clock size={24} color="white" fill="white" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white text-lg font-bold mb-1">
                                20% Productivity boost
                            </Text>
                            <Text className="text-neutral-400 text-base leading-relaxed">
                                Reduce distractions during work hours by over <Text className="text-white font-bold">20%</Text>
                            </Text>
                        </View>
                    </View>

                    {/* Item 3 */}
                    <View className="flex-row gap-4">
                        <View className="pt-1">
                            <Calendar size={24} color="white" fill="white" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white text-lg font-bold mb-1">
                                30 days back this year
                            </Text>
                            <Text className="text-neutral-400 text-base leading-relaxed">
                                Develop your focus plan to save up to <Text className="text-white font-bold">30 days</Text> this year
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View className="w-full px-6 pb-6 items-center gap-4">
                <Text className="text-neutral-500 text-sm font-medium">
                    Let's solidify it with a fist bump
                </Text>

                <HapticButton
                    onPress={handleCommit}
                    className="w-full bg-white rounded-full py-4 shadow-none flex-row justify-center items-center gap-2"
                    style={{ backgroundColor: "white" }}
                >
                    <Text className="text-xl">👊</Text>
                    <Text className="text-black font-bold text-lg">Let's Do It</Text>
                </HapticButton>
            </View>
        </SafeAreaView>
    );
}
