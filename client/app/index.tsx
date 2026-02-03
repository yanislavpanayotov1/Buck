import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { HapticButton } from "../components/ui/HapticButton";
import { BreathingBackground } from "../components/ui/BreathingBackground";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <BreathingBackground mode="calm">
      <SafeAreaView className="flex-1 items-center justify-between p-6">
        <View className="flex-1 items-center justify-center w-full">
          {/* Logo / Icon Area */}
          <Animated.View
            entering={FadeInUp.delay(200).springify()}
            className="bg-violet-600/20 p-8 rounded-full mb-8"
          >
            <MaterialCommunityIcons name="clock-check-outline" size={80} color="#8b5cf6" />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).springify()} className="items-center">
            <Text className="text-4xl font-bold text-white mb-2 tracking-tighter">
              Buck
            </Text>
            <Text className="text-neutral-400 text-center text-lg px-4 leading-relaxed">
              Reclaim your focus. <Text className="text-violet-400 font-semibold">Master your time.</Text>
            </Text>
          </Animated.View>
        </View>

        {/* Footer / Actions */}
        <Animated.View entering={FadeInDown.delay(600).springify()} className="w-full space-y-4 mb-4">
          <HapticButton
            variant="primary"
            onPress={() => {
              console.log("Get Started pressed");
              router.push("/onboarding/screen-time");
            }}
            className="w-full"
          >
            Get Started
          </HapticButton>

          <HapticButton
            variant="ghost"
            onPress={() => {
              console.log("Login pressed");
            }}
            className="w-full"
          >
            <Text className="text-neutral-400 font-medium text-base">
              Already have an account? <Text className="text-white">Log in</Text>
            </Text>
          </HapticButton>
        </Animated.View>
      </SafeAreaView>
    </BreathingBackground>
  );
}
