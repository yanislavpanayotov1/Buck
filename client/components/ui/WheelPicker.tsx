import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    Extrapolate,
    useAnimatedScrollHandler,
    runOnJS,
    SharedValue,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface WheelPickerProps {
    items: string[];
    initialIndex?: number;
    onIndexChange: (index: number) => void;
    itemHeight?: number;
}

const VISIBLE_ITEMS = 5;

export function WheelPicker({
    items,
    initialIndex = 0,
    onIndexChange,
    itemHeight = 50,
}: WheelPickerProps) {
    const scrollY = useSharedValue(0);
    const activeIndex = useRef(initialIndex);

    // Extend list with padding items so the first/last items can reach the center
    const paddingCount = Math.floor(VISIBLE_ITEMS / 2);
    const paddedItems = [
        ...Array(paddingCount).fill(""),
        ...items,
        ...Array(paddingCount).fill(""),
    ];

    const onScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(event.nativeEvent.contentOffset.y / itemHeight);
        if (index !== activeIndex.current && index >= 0 && index < items.length) {
            activeIndex.current = index;
            onIndexChange(index);
            Haptics.selectionAsync();
        }
    };

    return (
        <View style={{ height: itemHeight * VISIBLE_ITEMS, overflow: "hidden" }}>
            {/* Central Highlight Overlay */}
            <View
                style={{
                    position: "absolute",
                    top: itemHeight * paddingCount,
                    left: 0,
                    right: 0,
                    height: itemHeight,
                    backgroundColor: "#262626", // neutral-800
                    borderRadius: 12,
                    zIndex: -1,
                }}
            />

            <Animated.FlatList
                data={paddedItems}
                keyExtractor={(_, index) => index.toString()}
                bounces={false}
                showsVerticalScrollIndicator={false}
                snapToInterval={itemHeight}
                decelerationRate="fast"
                onScroll={onScroll}
                scrollEventThrottle={16}
                onMomentumScrollEnd={onMomentumScrollEnd}
                getItemLayout={(_, index) => ({
                    length: itemHeight,
                    offset: itemHeight * index,
                    index,
                })}
                initialScrollIndex={initialIndex}
                renderItem={({ item, index }) => {
                    // Skip rendering padding items if you want, or just render empty Text
                    if (item === "") {
                        return <View style={{ height: itemHeight }} />;
                    }

                    // Real index in the original items array
                    const realIndex = index - paddingCount;

                    return (
                        <PickerItem
                            item={item}
                            index={realIndex} // Use strictly relative index for logic involving original array position
                            flatListIndex={index} // ScrollY relies on actual list index
                            itemHeight={itemHeight}
                            scrollY={scrollY}
                        />
                    );
                }}
            />
        </View>
    );
}

function PickerItem({
    item,
    index,
    flatListIndex,
    itemHeight,
    scrollY,
}: {
    item: string;
    index: number;
    flatListIndex: number;
    itemHeight: number;
    scrollY: SharedValue<number>;
}) {
    const animatedStyle = useAnimatedStyle(() => {
        // Calculate distance from center based on SCROLL POSITION
        // The item is at center when scrollY == (flatListIndex - padding) * itemHeight ??
        // Actually simpler:
        // The center of the view is at scrollY + (height/2).
        // The item's center is at flatListIndex * itemHeight + itemHeight/2.

        // We want the item to be highlighted when it is in the center of the view.
        // The view center (overlay) is at offset `2 * itemHeight` (if visible=5).
        // Item is at `flatListIndex * itemHeight`.
        // So peak scale should be when `scrollY == (flatListIndex - 2) * itemHeight`.
        const centerOffset = 2;

        const inputRange = [
            (flatListIndex - centerOffset - 2) * itemHeight,
            (flatListIndex - centerOffset - 1) * itemHeight,
            (flatListIndex - centerOffset) * itemHeight,
            (flatListIndex - centerOffset + 1) * itemHeight,
            (flatListIndex - centerOffset + 2) * itemHeight,
        ];

        const scale = interpolate(
            scrollY.value,
            inputRange,
            [0.8, 0.9, 1.2, 0.9, 0.8], // Increased scale slightly for emphasis
            Extrapolate.CLAMP
        );

        const opacity = interpolate(
            scrollY.value,
            inputRange,
            [0.3, 0.5, 1, 0.5, 0.3],
            Extrapolate.CLAMP
        );

        const translateY = interpolate(
            scrollY.value,
            inputRange,
            [0, 0, 0, 0, 0] // Could add 3D rotate effect here if desired
        );

        return {
            transform: [{ scale }, { translateY }],
            opacity,
        };
    });

    return (
        <Animated.View
            style={[
                {
                    height: itemHeight,
                    justifyContent: "center",
                    alignItems: "center",
                },
                animatedStyle,
            ]}
        >
            <Text style={{ color: "white", fontSize: 24, fontWeight: "600" }}>{item}</Text>
        </Animated.View>
    );
}
