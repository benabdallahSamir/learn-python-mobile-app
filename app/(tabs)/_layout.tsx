import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#5E5CE6',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          // Dynamically adjust height and padding based on safe area insets
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
          paddingTop: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="python"
        options={{
          title: 'Python',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'logo-python' : 'logo-python'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="django"
        options={{
          title: 'Django',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'code-working' : 'code-working-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
