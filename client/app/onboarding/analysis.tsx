import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { HapticButton } from "../../components/ui/HapticButton";
import { useOnboarding } from "../../context/OnboardingContext";

const { width } = Dimensions.get("window");

export default function AnalysisScreen() {
    const router = useRouter();
    const { screenTime, age } = useOnboarding();
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    // Calculations
    const daysPerYear = Math.round((screenTime * 365) / 24);
    // Assuming 16 waking hours per day, and life expectancy of 80
    const wakingHoursPerDay = 16;
    const yearsLeft = 80 - age;
    const yearsLost = Math.round((screenTime / wakingHoursPerDay) * yearsLeft);
    // Estimate saving ~1/3 of the time lost, or at least 1 year.
    const yearsSaved = Math.max(1, Math.round(yearsLost * 0.33));

    const slides = [
        {
            id: 1,
            // Custom render function for the slide content
            render: () => (
                <View className="items-center">
                    <Text className="text-white text-3xl font-bold text-center leading-tight">
                        Some not-so-good news,{"\n"}and some great news.
                    </Text>
                </View>
            ),
        },
        {
            id: 2,
            render: () => (
                <View className="items-center w-full px-4">
                    <Text className="text-white text-xl text-center leading-relaxed font-medium mb-2">
                        The bad news is that you'll spend <Text className="text-purple-400 font-bold">{daysPerYear} days</Text> on your phone this year.
                    </Text>
                    <Text className="text-white text-xl text-center leading-relaxed font-medium mb-8">
                        Meaning that you're on track to spend
                    </Text>

                    {/* Gradient Text for Years */}
                    <MaskedView
                        maskElement={
                            <Text className="text-8xl font-black text-center tracking-tighter">
                                {yearsLost} years
                            </Text>
                        }
                    >
                        <LinearGradient
                            colors={["#a855f7", "#3b82f6"]} // Purple to Blue
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text className="text-8xl font-black text-center tracking-tighter opacity-0">
                                {yearsLost} years
                            </Text>
                        </LinearGradient>
                    </MaskedView>

                    <Text className="text-white text-xl text-center leading-relaxed font-medium mt-6">
                        of your life looking down at your phone.{"\n"}
                        Yep, you read this right.
                    </Text>

                    <Text className="text-neutral-500 text-xs text-center mt-12 px-6">
                        Projection of your current Screen Time habits, based on an average {wakingHoursPerDay} waking hours each day.
                    </Text>
                </View>
            ),
        },
        {
            id: 3,
            render: () => (
                <View className="items-center w-full px-4">
                    <Text className="text-white text-xl text-center leading-relaxed font-medium mb-8">
                        The good news is that <Text className="text-purple-400 font-bold">Buck</Text> can help you get back
                    </Text>

                    {/* Gradient Text for Saved Years */}
                    <MaskedView
                        maskElement={
                            <Text className="text-8xl font-black text-center tracking-tighter">
                                {yearsSaved} years+
                            </Text>
                        }
                    >
                        <LinearGradient
                            colors={["#a855f7", "#3b82f6"]} // Purple to Blue
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text className="text-8xl font-black text-center tracking-tighter opacity-0">
                                {yearsSaved} years+
                            </Text>
                        </LinearGradient>
                    </MaskedView>

                    <Text className="text-white text-xl text-center leading-relaxed font-medium mt-6">
                        of your life free from distractions, and help you achieve your dreams.
                    </Text>

                    <Text className="text-neutral-500 text-xs text-center mt-20 px-4">
                        According to your profile combined with <Text className="text-purple-400 font-bold">Buck</Text> program
                    </Text>
                </View>
            ),
        },
        {
            id: 4,
            render: () => (
                <View className="items-center w-full px-4">
                    <Text className="text-white text-3xl font-bold text-center leading-tight">
                        Let's take the first step:
                    </Text>
                    <Text className="text-white text-xl text-center leading-relaxed font-medium mt-6">
                        <Text className="text-purple-400 font-bold">Buck</Text> will connect to your Screen Time to give you a personalized focus report.
                    </Text>
                </View>
            ),
        },
    ];

    const handleContinue = () => {
        if (currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex(currentSlideIndex + 1);
        } else {
            router.replace("/onboarding/permissions");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-black justify-between" edges={['top', 'bottom']}>
            <View className="flex-1 w-full px-6">
                {/* Segmented Progress Bar */}
                <View className="flex-row gap-2 mt-4 mb-12">
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            className={`h-1 flex-1 rounded-full ${index <= currentSlideIndex ? "bg-white" : "bg-neutral-800"
                                }`}
                        />
                    ))}
                </View>

                {/* Content */}
                <View className="flex-1 justify-center items-center">
                    <Animated.View
                        key={currentSlideIndex}
                        entering={FadeIn.duration(500)}
                        exiting={FadeOut.duration(500)}
                        className="items-center w-full"
                    >
                        {slides[currentSlideIndex].render()}
                    </Animated.View>
                </View>
            </View>

            {/* Footer */}
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
