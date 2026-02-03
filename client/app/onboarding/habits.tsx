import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { HapticButton } from "../../components/ui/HapticButton";
import { CheckboxRow } from "../../components/ui/CheckboxRow";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HABITS = [
    "Mindless scrolling",
    "Scrolling first thing in morning",
    "Ignoring people around you",
    "Feeling bad after using my phone",
    "Using the phone while driving",
    "Using phone during meals",
    "Interrupting my work",
    "Constantly checking on my phone",
    "I have attention differences that affect me"
];

export default function HabitsScreen() {
    const router = useRouter();
    const [selectedHabits, setSelectedHabits] = useState<string[]>([
        "Mindless scrolling",
        "Scrolling first thing in morning"
    ]);

    const toggleHabit = (habit: string) => {
        setSelectedHabits((prev) =>
            prev.includes(habit)
                ? prev.filter((h) => h !== habit)
                : [...prev, habit]
        );
    };

    const handleContinue = () => {
        // Save habits logic here
        console.log("Selected habits:", selectedHabits);
        router.push("/onboarding/age");
    };

    return (
        <SafeAreaView className="flex-1 bg-black" edges={['top']}>
            <View className="flex-1 px-6">
                {/* Header */}
                <Animated.View entering={FadeInUp.delay(200)} className="items-center mt-6 mb-8">
                    <Text className="text-white text-3xl font-bold text-center leading-tight mb-3">
                        What habit would you like to change?
                    </Text>
                </Animated.View>

                {/* List */}
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                >
                    <Animated.View entering={FadeInDown.delay(400)}>
                        {HABITS.map((habit) => (
                            <CheckboxRow
                                key={habit}
                                label={habit}
                                selected={selectedHabits.includes(habit)}
                                onToggle={() => toggleHabit(habit)}
                            />
                        ))}
                    </Animated.View>
                </ScrollView>

                {/* Footer */}
                <Animated.View
                    entering={FadeInDown.delay(600)}
                    className="absolute bottom-10 left-6 right-6"
                >
                    <HapticButton
                        onPress={handleContinue}
                        className="w-full bg-white rounded-full py-5 shadow-none"
                        style={{ backgroundColor: "white" }}
                    >
                        <Text className="text-black font-bold text-lg">Continue</Text>
                    </HapticButton>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}
