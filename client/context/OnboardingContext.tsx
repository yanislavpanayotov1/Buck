import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingContextType {
    screenTime: number;
    setScreenTime: (hours: number) => void;
    age: number;
    setAge: (age: number) => void;
    habits: string[];
    setHabits: (habits: string[]) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
    const [screenTime, setScreenTime] = useState(4);
    const [age, setAge] = useState(24);
    const [habits, setHabits] = useState<string[]>([]);

    return (
        <OnboardingContext.Provider
            value={{
                screenTime,
                setScreenTime,
                age,
                setAge,
                habits,
                setHabits,
            }}
        >
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (context === undefined) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
}
