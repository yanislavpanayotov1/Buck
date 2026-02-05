import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../../components/ui/HapticButton";
import { Check, Lock, Bell, Star, Award, Circle } from "lucide-react-native";

export default function CheckoutScreen() {
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState<'free' | 'paid'>('free');

    const handleRedeem = () => {
        // Final purchase/subscription logic would go here
        // For now, navigate to the main app flow
        router.replace("/focus");
    };

    return (
        <SafeAreaView className="flex-1 bg-black justify-between" edges={['top', 'bottom']}>
            <View className="flex-1 px-6 pt-6">
                {/* Close Button / Header */}
                <View className="flex-row justify-end mb-4">
                    {/* Using a placeholder close button or similar if needed, usually paywalls have one. 
                         The design shows a "Restore" text maybe? Or X. Let's assume standard X or Restore.
                         Design image shows "Restore" top left and X top right. */}
                    <TouchableOpacity className="bg-neutral-800 p-2 rounded-full">
                        <Text className="text-white font-bold opacity-60">✕</Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-white text-2xl font-bold text-center mb-8">
                    Design Your Trial Experience
                </Text>

                {/* Timeline */}
                <View className="ml-4 mb-8">
                    {/* Item 1 */}
                    <View className="flex-row gap-4 pb-8 border-l-2 border-white/20 pl-6 relative">
                        <View className="absolute -left-[11px] top-0 bg-white rounded-full p-1">
                            <Check size={14} color="black" strokeWidth={4} />
                        </View>
                        <View>
                            <Text className="text-white text-lg font-bold">Get your Focus Diagnosis</Text>
                            <Text className="text-neutral-400 text-sm">You successfully started your journey</Text>
                        </View>
                    </View>

                    {/* Item 2 */}
                    <View className="flex-row gap-4 pb-8 border-l-2 border-white/20 pl-6 relative">
                        <View className="absolute -left-[11px] top-0 bg-white rounded-full p-1 border-4 border-black">
                            <Lock size={14} color="black" fill="black" />
                        </View>
                        <View>
                            <Text className="text-white text-lg font-bold">Today: Improve Your Focus</Text>
                            <Text className="text-neutral-400 text-sm">Block Apps automatically, get your detailed stats and stay on track</Text>
                        </View>
                    </View>

                    {/* Item 3 */}
                    <View className="flex-row gap-4 pb-8 border-l-2 border-white/20 pl-6 relative">
                        <View className="absolute -left-[11px] top-0 bg-neutral-800 rounded-full p-1 border-4 border-black">
                            <Bell size={14} color="white" />
                        </View>
                        <View>
                            <Text className="text-white text-lg font-bold">Day 6: See first results</Text>
                            <Text className="text-neutral-400 text-sm leading-tight">We'll send you a notification with a report to see how you improved this week.</Text>
                        </View>
                    </View>

                    {/* Item 4 */}
                    <View className="flex-row gap-4 pl-6 relative">
                        <View className="absolute -left-[11px] top-0 bg-neutral-800 rounded-full p-1 border-4 border-black">
                            <Star size={14} color="white" fill="white" />
                        </View>
                        <View>
                            <Text className="text-white text-lg font-bold">Day 7: Take your next steps</Text>
                            <Text className="text-neutral-400 text-sm leading-tight">Continue improving your screentime by setting up more of Buck's features</Text>
                        </View>
                    </View>
                </View>

                {/* Social Proof Middle */}
                <View className="items-center mb-8">
                    <View className="flex-row items-center gap-4">
                        <Award size={40} color="white" />
                        <View className="items-center">
                            <Text className="text-white font-bold text-sm">Apple Design Awards</Text>
                            <Text className="text-neutral-400 text-xs">Social Impact</Text>
                            <Text className="text-neutral-500 text-[10px]">2025</Text>
                        </View>
                        <Award size={40} color="white" style={{ transform: [{ scaleX: -1 }] }} />
                    </View>
                </View>
            </View>

            {/* Footer / Pricing Params */}
            <View className="w-full bg-neutral-900 rounded-t-3xl border-t border-white/10 p-6 pb-8">
                {/* Plan Selector */}
                <View className="gap-3 mb-6">
                    {/* Free Plan */}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => setSelectedPlan('free')}
                        className={`w-full p-4 rounded-xl border flex-row items-center justify-between ${selectedPlan === 'free' ? 'bg-neutral-800 border-white' : 'bg-neutral-800/50 border-neutral-700'}`}
                    >
                        <View>
                            <Text className="text-white font-bold text-base">Free</Text>
                            <Text className="text-neutral-400 text-sm">7 days free</Text>
                        </View>
                        <View>
                            {selectedPlan === 'free' ? (
                                <View className="bg-white rounded-full p-1">
                                    <Check size={12} color="black" strokeWidth={4} />
                                </View>
                            ) : (
                                <Circle size={20} color="#525252" />
                            )}
                        </View>
                    </TouchableOpacity>

                    {/* Paid Plan */}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => setSelectedPlan('paid')}
                        className={`w-full p-4 rounded-xl border flex-row items-center justify-between ${selectedPlan === 'paid' ? 'bg-neutral-800 border-white' : 'bg-neutral-800/50 border-neutral-700'}`}
                    >
                        <View>
                            <Text className="text-white font-bold text-base">30-Day Trial</Text>
                            <Text className="text-neutral-400 text-sm">4,99 €</Text>
                        </View>
                        <View>
                            {selectedPlan === 'paid' ? (
                                <View className="bg-white rounded-full p-1">
                                    <Check size={12} color="black" strokeWidth={4} />
                                </View>
                            ) : (
                                <Circle size={20} color="#525252" />
                            )}
                        </View>
                    </TouchableOpacity>
                </View>

                {/* No Payment Due Label */}
                <View className="items-center flex-row justify-center gap-2 mb-4">
                    <Check size={14} color="#9ca3af" />
                    <Text className="text-neutral-400 text-xs font-bold">No payment due now!</Text>
                </View>

                <HapticButton
                    onPress={handleRedeem}
                    className="w-full bg-blue-500 rounded-full py-4 shadow-lg shadow-blue-500/50 mb-3"
                    style={{ backgroundColor: "#3b82f6" }}
                >
                    <Text className="text-white font-bold text-lg text-center">Redeem 7 days for 0,00 €</Text>
                </HapticButton>

                <Text className="text-neutral-500 text-[10px] text-center px-4 leading-tight">
                    7 days free, then 99,99 € per year (8,33 €/mo). Cancel anytime.
                </Text>
            </View>

        </SafeAreaView>
    );
}
