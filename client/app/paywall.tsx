import React from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { HapticButton } from "../components/ui/HapticButton";
import { Shield, Calendar, Users, Star } from "lucide-react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function PaywallScreen() {
    const router = useRouter();
    // Static data for visual comparison
    const beforeTime = "6h 32m";
    const afterTime = "1h 49m";
    const hoursSaved = "2+";

    return (
        <View className="flex-1 bg-black">
            {/* Background Gradient - Purple/Blue top glow */}
            <LinearGradient
                colors={["#4c1d95", "#000000"]} // Deep purple to black
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.5 }}
                style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '100%' }}
            />

            <SafeAreaView className="flex-1 justify-between" edges={['top', 'bottom']}>
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

                    {/* Header Charts Section */}
                    <View className="pt-8 px-4">
                        <View className="flex-row w-full justify-center items-stretch h-64">

                            {/* Before Panel */}
                            <View className="flex-1 items-center justify-end pb-4 pr-2 border-r border-white/10">
                                <Text className="text-white text-2xl font-light mb-2">Before</Text>
                                <Text className="text-white text-3xl font-bold mb-8">Buck</Text>

                                <View className="w-full bg-[#1c1c1e] rounded-2xl p-3 items-start h-40 justify-between">
                                    <View>
                                        <Text className="text-neutral-500 text-[10px] font-medium uppercase">Daily Average</Text>
                                        <Text className="text-white text-xl font-bold">{beforeTime}</Text>
                                    </View>

                                    {/* Bar Chart - High */}
                                    <View className="flex-row gap-[2px] w-full h-20 items-end justify-between px-1">
                                        <View className="w-[12%] h-[40%] bg-blue-500 rounded-sm opacity-60" />
                                        <View className="w-[12%] h-[60%] bg-blue-500 rounded-sm relative opacity-80"><View className="absolute bottom-0 w-full h-[30%] bg-orange-400 rounded-sm" /></View>
                                        <View className="w-[12%] h-[80%] bg-blue-500 rounded-sm relative"><View className="absolute bottom-0 w-full h-[40%] bg-orange-400 rounded-sm" /></View>
                                        <View className="w-[12%] h-[50%] bg-blue-500 rounded-sm opacity-70" />
                                        <View className="w-[12%] h-[30%] bg-gray-500 rounded-sm opacity-50" />
                                    </View>
                                </View>
                            </View>

                            {/* After Panel */}
                            <View className="flex-1 items-center justify-end pb-4 pl-2">
                                <Text className="text-white text-2xl font-light mb-2">After</Text>
                                <Text className="text-white text-3xl font-bold mb-8">Buck</Text>

                                <View className="w-full bg-[#1c1c1e] rounded-2xl p-3 items-start h-40 justify-between border border-blue-500/20">
                                    <View>
                                        <Text className="text-neutral-500 text-[10px] font-medium uppercase">Daily Average</Text>
                                        <Text className="text-white text-xl font-bold">{afterTime}</Text>
                                    </View>

                                    {/* Bar Chart - Low */}
                                    <View className="flex-row gap-[2px] w-full h-20 items-end justify-between px-1">
                                        {/* Using dashed line for average reference */}
                                        <View className="absolute w-full h-[1px] bg-green-500/50 top-[60%]" style={{ borderStyle: 'dashed', borderWidth: 1, borderColor: '#22c55e' }} />

                                        <View className="w-[12%] h-[15%] bg-blue-500 rounded-sm" />
                                        <View className="w-[12%] h-[20%] bg-blue-500 rounded-sm" />
                                        <View className="w-[12%] h-[18%] bg-blue-500 rounded-sm" />
                                        <View className="w-[12%] h-[15%] bg-blue-500 rounded-sm" />
                                        <View className="w-[12%] h-[10%] bg-blue-500 rounded-sm" />
                                    </View>
                                </View>
                            </View>

                        </View>
                    </View>

                    {/* Headline */}
                    <Text className="text-white text-2xl font-bold text-center mt-8 px-8 leading-relaxed">
                        Start your free week and gain{"\n"}
                        <Text className="text-purple-400">{hoursSaved}+ Hours</Text> back
                    </Text>

                    {/* Features List */}
                    <View className="mt-10 px-8 gap-8">
                        <View className="flex-row gap-4 items-start">
                            <View className="bg-white/10 p-2 rounded-full">
                                <Shield size={20} color="#a855f7" fill="#a855f7" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white text-lg font-bold">Focus, uninterrupted.</Text>
                                <Text className="text-neutral-400">Finally do your best work yet.</Text>
                            </View>
                        </View>

                        <View className="flex-row gap-4 items-start">
                            <View className="bg-white/10 p-2 rounded-full">
                                <Calendar size={20} color="#a855f7" fill="#a855f7" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white text-lg font-bold">Own your time.</Text>
                                <Text className="text-neutral-400">And fill your days with more intention.</Text>
                            </View>
                        </View>

                        <View className="flex-row gap-4 items-start">
                            <View className="bg-white/10 p-2 rounded-full">
                                <Users size={20} color="#a855f7" fill="#a855f7" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white text-lg font-bold">Be fully present.</Text>
                                <Text className="text-neutral-400">Because life isn't happening on your screen.</Text>
                            </View>
                        </View>
                    </View>

                    {/* Social Proof */}

                </ScrollView>

                {/* Sticky Footer CTA */}
                <View className="absolute bottom-0 w-full px-6 pb-8 bg-black/80 pt-4">
                    <HapticButton
                        onPress={() => router.replace("/onboarding/reminder")}
                        className="w-full bg-blue-500 rounded-full py-4 shadow-lg shadow-blue-500/50"
                        style={{ backgroundColor: "#3b82f6" }}
                    >
                        <Text className="text-white font-bold text-lg text-center">Try for 0,00 €</Text>
                    </HapticButton>
                </View>

            </SafeAreaView>
        </View>
    );
}
