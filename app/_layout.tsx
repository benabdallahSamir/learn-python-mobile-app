import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { getIntroStatus } from "@/hooks/useStorage";
import { useRouter } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [hasCompletedIntro, setHasCompletedIntro] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function prepare() {
      try {
        const status = await getIntroStatus();
        setHasCompletedIntro(status);
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (isReady && hasCompletedIntro === false) {
      router.replace("/intro");
    }
  }, [isReady, hasCompletedIntro]);

  if (!isReady) {
    return null; // Keep splash screen visible
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="intro" options={{ gestureEnabled: false }} />
        <Stack.Screen name="quiz" options={{ presentation: 'modal' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
