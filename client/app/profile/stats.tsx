import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp, withTiming, useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import { BreathingBackground } from "../../components/ui/BreathingBackground";
import { getUserStats, UserStats } from "../../lib/gamification";
import { HapticButton } from "../../components/ui/HapticButton";

export default function StatsScreen() {
    const router = useRouter();
    const [stats, setStats] = useState<UserStats | null>(null);

    useEffect(() => {
        getUserStats().then(setStats);
    }, []);

    if (!stats) return null;

    return (
        <BreathingBackground mode="calm">
            <SafeAreaView className="flex-1 px-6 pt-8 pb-4">
                <Animated.View entering={FadeInUp.delay(200)} className="w-full flex-row justify-between items-center mb-8">
                    <TouchableOpacity onPress={() => router.replace("/")} className="p-2">
                        <MaterialCommunityIcons name="close" size={24} color="#a3a3a3" />
                    </TouchableOpacity>
                    <Text className="text-white font-semibold text-lg">Your Journey</Text>
                    <View style={{ width: 40 }} />
                </Animated.View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                    {/* Level Orb */}
                    <Animated.View entering={FadeInDown.delay(300)} className="items-center mb-12">
                        <View className="w-40 h-40 rounded-full border-4 border-violet-500/30 items-center justify-center bg-violet-500/10 mb-4 shadow-2xl shadow-violet-500/20">
                            <Text className="text-neutral-400 text-sm font-medium uppercase tracking-widest mb-1">Level</Text>
                            <Text className="text-6xl font-bold text-white">{stats.level}</Text>
                        </View>
                        <View className="w-full max-w-[240px]">
                            <View className="h-2 bg-neutral-800 rounded-full overflow-hidden mb-2">
                                <View style={{ width: `${stats.progress * 100}%` }} className="h-full bg-violet-500 rounded-full" />
                            </View>
                            <Text className="text-center text-xs text-neutral-500">
                                {Math.floor(stats.progress * 100)}% to Level {stats.level + 1}
                            </Text>
                        </View>
                    </Animated.View>

                    {/* Stats Grid */}
                    <View className="flex-row gap-4 mb-8">
                        {/* Streak Card */}
                        <Animated.View entering={FadeInDown.delay(400)} className="flex-1 bg-neutral-800/60 p-5 rounded-2xl border border-neutral-700/50 items-center">
                            <MaterialCommunityIcons name="fire" size={32} color="#fb923c" style={{ marginBottom: 8 }} />
                            <Text className="text-3xl font-bold text-white mb-1">{stats.streak}</Text>
                            <Text className="text-neutral-400 text-xs text-center">Day Streak</Text>
                        </Animated.View>

                        {/* Focus Time Card */}
                        <Animated.View entering={FadeInDown.delay(500)} className="flex-1 bg-neutral-800/60 p-5 rounded-2xl border border-neutral-700/50 items-center">
                            <MaterialCommunityIcons name="timer-outline" size={32} color="#38bdf8" style={{ marginBottom: 8 }} />
                            <Text className="text-3xl font-bold text-white mb-1">{stats.totalMinutes}</Text>
                            <Text className="text-neutral-400 text-xs text-center">Total Minutes</Text>
                        </Animated.View>
                    </View>

                    {/* Quote / Reflection */}
                    <Animated.View entering={FadeInDown.delay(600)} className="bg-neutral-800/30 p-6 rounded-2xl mb-8">
                        <Text className="text-neutral-300 italic text-center text-base leading-relaxed">
                            "The difference between successful people and very successful people is that very successful people say 'no' to almost everything."
                        </Text>
                        <Text className="text-neutral-500 text-xs text-center mt-4">— Warren Buffett</Text>
                    </Animated.View>
                </ScrollView>

                <Animated.View entering={FadeInDown.delay(700)}>
                    <HapticButton
                        variant="primary"
                        onPress={() => router.replace("/")}
                        className="w-full"
                    >
                        Continue
                    </HapticButton>
                </Animated.View>
            </SafeAreaView>
        </BreathingBackground>
    );
}
