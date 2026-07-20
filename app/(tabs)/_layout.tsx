import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { useApp } from '../../contexts/AppContext';

function TabIcon({ name, label, color, focused, bgColor }: { name: any; label: string; color: string; focused: boolean; bgColor: string }) {
  return (
    <View style={[styles.tabIcon, focused && [styles.tabIconActive, { backgroundColor: bgColor }]]}>
      <MaterialIcons name={name} size={22} color={color} />
      <Text style={[styles.tabLabel, { color }]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { colors: C } = useApp();

  const tabBarStyle = {
    height: Platform.select({ ios: insets.bottom + 64, android: insets.bottom + 64, default: 72 }),
    paddingTop: 8,
    paddingBottom: Platform.select({ ios: insets.bottom + 8, android: insets.bottom + 8, default: 8 }),
    backgroundColor: C.surface,
    borderTopWidth: 1,
    borderTopColor: C.cardBorder,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: C.gold,
        tabBarInactiveTintColor: C.textMuted,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" label="Home" color={color} focused={focused} bgColor={`${C.gold}15`} />
          ),
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="menu-book" label="Quran" color={color} focused={focused} bgColor={`${C.gold}15`} />
          ),
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="mosque" label="Prayer" color={color} focused={focused} bgColor={`${C.gold}15`} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="apps" label="More" color={color} focused={focused} bgColor={`${C.gold}15`} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 2,
  },
  tabIconActive: {},
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
});
