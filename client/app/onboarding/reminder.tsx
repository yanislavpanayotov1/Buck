import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../../components/ui/HapticButton";
import { Bell, Check, Circle } from "lucide-react-native";

export default function ReminderScreen() {
    const router = useRouter();
    const [selectedOption, setSelectedOption] = useState<2 | 3>(2);

    // Date Logic
    const today = new Date();
    const trialLengthDays = 7;
    const trialEndDate = new Date(today);
    trialEndDate.setDate(today.getDate() + trialLengthDays);

    const getReminderDate = (daysBefore: number) => {
        const reminderDate = new Date(trialEndDate);
        reminderDate.setDate(trialEndDate.getDate() - daysBefore);
        return reminderDate.toLocaleDateString("en-US", { month: "long", day: "numeric" });
    };

    const dateTwoDays = getReminderDate(2);
    const dateThreeDays = getReminderDate(3);

    const handleContinue = () => {
        // Here we would request notification permissions
        router.replace("/onboarding/checkout");
    };

    return (
        <SafeAreaView className="flex-1 bg-black justify-between" edges={['top', 'bottom']}>
            <View className="flex-1 px-6 pt-8 items-center">
                {/* Header */}
                <Text className="text-white text-3xl font-bold text-center leading-tight mb-12">
                    When should we remind you before your trial ends?
                </Text>

                {/* Visual Bell */}
                <View className="items-center justify-center mb-16 relative">
                    <Bell size={120} color="#d4d4d8" fill="#525252" strokeWidth={1} style={{ opacity: 0.9 }} />

                    {/* Notification Dot */}
                    <View className="absolute top-0 right-2 w-8 h-8 rounded-full bg-red-500 shadow-lg shadow-red-500/50 border-2 border-black" />
                </View>

                {/* Options */}
                <View className="w-full gap-4">
                    {/* Option 1: 2 Days Before */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setSelectedOption(2)}
                        className={`w-full p-5 rounded-2xl flex-row items-center justify-between border ${selectedOption === 2 ? "bg-neutral-800 border-neutral-600" : "bg-neutral-900 border-neutral-800"}`}
                    >
                        <View>
                            <Text className="text-white text-lg font-bold mb-1">2 days before</Text>
                            <Text className="text-neutral-400 text-sm">{dateTwoDays}</Text>
                        </View>
                        <View>
                            {selectedOption === 2 ? (
                                <View className="bg-white rounded-full p-1">
                                    <Check size={16} color="black" strokeWidth={4} />
                                </View>
                            ) : (
                                <Circle size={24} color="#525252" />
                            )}
                        </View>
                    </TouchableOpacity>

                    {/* Option 2: 3 Days Before */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setSelectedOption(3)}
                        className={`w-full p-5 rounded-2xl flex-row items-center justify-between border ${selectedOption === 3 ? "bg-neutral-800 border-neutral-600" : "bg-neutral-900 border-neutral-800"}`}
                    >
                        <View>
                            <Text className="text-white text-lg font-bold mb-1">3 days before</Text>
                            <Text className="text-neutral-400 text-sm">{dateThreeDays}</Text>
                        </View>
                        <View>
                            {selectedOption === 3 ? (
                                <View className="bg-white rounded-full p-1">
                                    <Check size={16} color="black" strokeWidth={4} />
                                </View>
                            ) : (
                                <Circle size={24} color="#525252" />
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Footer */}
            <View className="w-full px-6 pb-6 items-center gap-4">
                <Text className="text-neutral-500 text-sm font-medium">
                    Enable notifications to receive this reminder
                </Text>

                <HapticButton
                    onPress={handleContinue}
                    className="w-full bg-blue-500 rounded-full py-4 shadow-lg shadow-blue-500/50"
                    style={{ backgroundColor: "#3b82f6" }}
                >
                    <Text className="text-white font-bold text-lg text-center">Continue</Text>
                </HapticButton>
            </View>
        </SafeAreaView>
    );
}
