import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
    XP: "buck_user_xp",
    STREAK: "buck_user_streak",
    LAST_FOCUS_DATE: "buck_last_focus_date",
    TOTAL_MINUTES: "buck_total_minutes",
};

export interface UserStats {
    xp: number;
    level: number;
    streak: number;
    totalMinutes: number;
    nextLevelXp: number;
    progress: number; // 0 to 1
}

// Level curve: Level N requires 500 * N XP (Linear for now for easier testing, or Quadratic)
// Let's use: Level = floor(sqrt(XP / 100))
// N=1 => 100 XP
// N=2 => 400 XP
// N=10 => 10000 XP
const XP_PER_MINUTE = 10;

export async function getUserStats(): Promise<UserStats> {
    try {
        const xpStr = await AsyncStorage.getItem(STORAGE_KEYS.XP);
        const streakStr = await AsyncStorage.getItem(STORAGE_KEYS.STREAK);
        const totalMinutesStr = await AsyncStorage.getItem(STORAGE_KEYS.TOTAL_MINUTES);

        const xp = parseInt(xpStr || "0", 10);
        const streak = parseInt(streakStr || "0", 10);
        const totalMinutes = parseInt(totalMinutesStr || "0", 10);

        const level = Math.floor(Math.sqrt(xp / 100)) + 1;
        const currentLevelBaseXp = 100 * Math.pow(level - 1, 2);
        const nextLevelBaseXp = 100 * Math.pow(level, 2);
        const neededForLevel = nextLevelBaseXp - currentLevelBaseXp;
        const progressInLevel = xp - currentLevelBaseXp;

        const progress = Math.min(Math.max(progressInLevel / neededForLevel, 0), 1);

        return {
            xp,
            level,
            streak,
            totalMinutes,
            nextLevelXp: nextLevelBaseXp,
            progress,
        };
    } catch (e) {
        console.error("Failed to load stats", e);
        return { xp: 0, level: 1, streak: 0, totalMinutes: 0, nextLevelXp: 100, progress: 0 };
    }
}

export async function recordSession(minutes: number): Promise<UserStats> {
    const currentStats = await getUserStats();
    const gainedXp = minutes * XP_PER_MINUTE;
    const newXp = currentStats.xp + gainedXp;
    const newTotalMinutes = currentStats.totalMinutes + minutes;

    // Stretch logic
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const lastDateStr = await AsyncStorage.getItem(STORAGE_KEYS.LAST_FOCUS_DATE);

    let newStreak = currentStats.streak;

    if (lastDateStr === todayStr) {
        // Already focused today, streak stays same
    } else if (lastDateStr) {
        const lastDate = new Date(lastDateStr);
        const diffTime = Math.abs(now.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Logic needs care: date difference.
        // Ideally use midnight comparisons.
        // If it was yesterday (1 day ago), increment.
        // If >1 day ago, reset to 1.
        // For simplicity: check if lastDate was "yesterday".

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        if (lastDateStr === yesterdayStr) {
            newStreak += 1;
        } else {
            // Stream broken
            newStreak = 1;
        }
    } else {
        // First ever session
        newStreak = 1;
    }

    await AsyncStorage.multiSet([
        [STORAGE_KEYS.XP, newXp.toString()],
        [STORAGE_KEYS.TOTAL_MINUTES, newTotalMinutes.toString()],
        [STORAGE_KEYS.STREAK, newStreak.toString()],
        [STORAGE_KEYS.LAST_FOCUS_DATE, todayStr],
    ]);

    return getUserStats();
}
