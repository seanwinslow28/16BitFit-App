# **Frontend Architecture**

## **Component Architecture**

### **Component Organization**

Components will be organized by feature or screen, with shared/reusable components separated within the apps/mobile-shell package.

Plaintext  
apps/mobile-shell/  
└── src/  
    ├── components/         \# Shared, reusable UI components (e.g., PixelButton, PixelPanel)  
    │   ├── atoms/  
    │   ├── molecules/  
    │   └── organisms/      \# e.g., CustomTabBar, AvatarCard  
    ├── features/           \# Feature-specific components and logic  
    │   ├── onboarding/  
    │   ├── home/           \# e.g., HomeAvatarDisplay (using Skia), ProgressRings (Skia)  
    │   ├── profile/  
    │   └── settings/  
    ├── screens/            \# Top-level screen components  
    │   ├── HomeScreen.tsx    \# Contains Skia Canvas for DMG screen content  
    │   ├── ...  
    ├── navigation/         \# Navigation configuration  
    ├── services/           \# API interaction layer  
    ├── stores/             \# Zustand state management  
    ├── styles/             \# Global styles, NativeWind config, Fonts  
    ├── hooks/              \# Reusable custom hooks  
    ├── bridge/             \# Logic for interacting with WebSocket Bridge client  
    └── utils/              \# Utility functions

### **Component Template**

Standard functional component template using TypeScript, React Native core components, NativeWind for styling, and Skia components for screen content.

TypeScript  
import React from 'react';  
import { View, Text } from 'react-native';  
import { styled } from 'nativewind'; // For Shell components  
import { Canvas, Text as SkiaText, useFont } from '@shopify/react-native-skia'; // For Screen content  
// Import pixel font  
// const pixelFont \= useFont(require('./path/to/PressStart2P-Regular.ttf'), 10); // Example

const StyledView \= styled(View); // NativeWind example

interface ExampleScreenContentProps {  
  message: string;  
}

// Example Component rendering \*within\* the virtual DMG screen area using Skia  
const ExampleScreenContent: React.FC\<ExampleScreenContentProps\> \= ({ message }) \=\> {  
    // Load pixel font (handle potential loading state)  
    // if (\!pixelFont) { return null; }

    return (  
        \<\>  
            {/\* Use Skia elements for rendering \*/}  
            {/\* Coordinates based on 160x144 logical DMG screen \*/}  
            {/\* Colors will be quantized by shader \*/}  
            {/\* \<SkiaText x={10} y={20} text={message} font={pixelFont} color="black" /\> \*/}  
             \<SkiaText x={10} y={20} text={message} color="\#0F380F" /\> {/\* Use darkest DMG color \*/}  
             {/\* Add other Skia drawings: Rect, ImageSVG, etc. \*/}  
        \</\>  
    );  
};

// Example Screen component combining Shell (NativeWind) and Screen (Skia)  
const ExampleScreen: React.FC \= () \=\> {  
  return (  
    // Outer shell element styled with NativeWind using Hardware Palette  
    \<StyledView className="flex-1 bg-body p-4"\> {/\* bg-body refers to \#D7D5CA \*/}  
        {/\* Virtual Screen Area \*/}  
        \<StyledView className="aspect-\[10/9\] w-full border-4 border-recess bg-lightest"\> {/\* bg-lightest is \#9BBC0F \*/}  
            {/\* Skia Canvas takes up the screen area \*/}  
            \<Canvas style={{ flex: 1 }} /\* antiAlias={false} \- Apply shader instead \*/ \>  
                \<ExampleScreenContent message="Hello Skia\!" /\>  
                {/\* Apply Quantization Shader Here \*/}  
            \</Canvas\>  
        \</StyledView\>  
        {/\* Other Shell elements \*/}  
        \<StyledView className="mt-4"\>  
             {/\* Example Shell Button \*/}  
             {/\* \<PixelButton label="Shell Button" onPress={() \=\> {}} variant='primary'/\> \*/}  
        \</StyledView\>  
    \</StyledView\>  
  );  
};

export default ExampleScreen; // Simplified structure

## **State Management Architecture**

### **State Structure**

Feature-based Zustand stores for distinct domains (user, fitness, game) within apps/mobile-shell/src/stores/. Consider Legend-State for enhanced Supabase sync/offline capabilities.

Plaintext  
apps/mobile-shell/src/stores/  
├── userStore.ts    \# Profile, auth state  
├── fitnessStore.ts \# Synced health data, streak, energy calc results  
├── gameStore.ts    \# Tickets, selected_champion, bridge state  
├── appStore.ts     \# Global loading, notifications  
└── index.ts        \# Exports hooks

### **State Management Patterns**

Use selectors, ensure immutability, handle async actions within stores, leverage middleware (logging, persist, Immer).

### **State Management Template**

Zustand create API with TypeScript interfaces, including async action examples and notes on persistence.

TypeScript  
// apps/mobile-shell/src/stores/userStore.ts  
import { create } from 'zustand';  
// ... other imports ...  
// Define UserState interface based on shared types

const useUserStore \= create\<UserState\>((set, get) \=\> ({  
  // ... state properties ...  
  // ... actions ...  
  // ... async actions (e.g., fetchUserProfile) ...  
}));  
export default useUserStore;

## **Routing Architecture**

### **Route Organization**

Bottom Tab Navigator for primary navigation (Home, Battle, Profile, Settings), nested Stack Navigators for depth, managed within apps/mobile-shell/src/navigation/.

Plaintext  
apps/mobile-shell/src/navigation/  
├── AppNavigator.tsx    \# Handles Auth/Onboarding vs Main App state  
├── TabNavigator.tsx    \# Bottom tabs with CustomTabBar  
├── OnboardingNavigator.tsx \# Stack for onboarding screens  
└── types.ts            \# Navigation types

### **Protected Route Pattern**

Top-level AppNavigator conditionally renders OnboardingNavigator or TabNavigator based on user state (profile loaded / onboarding complete) from Zustand store.

TypeScript  
// apps/mobile-shell/src/navigation/AppNavigator.tsx  
// ... imports ...

const AppNavigator: React.FC \= () \=\> {  
  const profile \= useUserStore(/\* ... selector ... \*/);  
  const isOnboardingComplete \= /\* ... check profile state ... \*/;

  return (  
    \<NavigationContainer\>  
      \<Stack.Navigator screenOptions={{ headerShown: false }}\>  
        {isOnboardingComplete ? (  
          \<Stack.Screen name="MainApp" component={TabNavigator} /\>  
        ) : (  
          \<Stack.Screen name="Onboarding" component={OnboardingNavigator} /\>  
        )}  
      \</Stack.Navigator\>  
    \</NavigationContainer\>  
  );  
};  
export default AppNavigator;

## **Frontend Services Layer**

### **API Client Setup**

Centralized Supabase client initialization in apps/mobile-shell/src/services/supabaseClient.ts, configured with AsyncStorage for session persistence.

TypeScript  
// apps/mobile-shell/src/services/supabaseClient.ts  
import AsyncStorage from '@react-native-async-storage/async-storage';  
import { createClient } from '@supabase/supabase-js';  
// ... env var loading ...

export const supabase \= createClient(supabaseUrl\!, supabaseAnonKey\!, {  
  auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },  
});

### **Service Example**

Service functions encapsulating Supabase interactions (select, update, function calls) using the client, async/await, error handling, and shared types within apps/mobile-shell/src/services/.

TypeScript  
// apps/mobile-shell/src/services/userService.ts  
import { supabase } from './supabaseClient';  
import type { UserProfile } from '@packages/shared-types';

async function getUserProfile(userId: string): Promise\<UserProfile | null\> {  
  // ... Supabase query ...  
}  
// ... other service functions ...  
export const userService \= { getUserProfile, /\* ... \*/ };
