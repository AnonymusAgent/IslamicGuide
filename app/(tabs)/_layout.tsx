import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';

function TabIcon({ name, label, color, focused }: { name: any; label: string; color: string; focused: boolean }) {
  return (
    <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
      <MaterialIcons name={name} size={22} color={color} />
      <Text style={[styles.tabLabel, { color }]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const tabBarStyle = {
    height: Platform.select({ ios: insets.bottom + 64, android: insets.bottom + 64, default: 72 }),
    paddingTop: 8,
    paddingBottom: Platform.select({ ios: insets.bottom + 8, android: insets.bottom + 8, default: 8 }),
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" label="Home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="menu-book" label="Quran" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="mosque" label="Prayer" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="apps" label="More" color={color} focused={focused} />
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
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 2,
  },
  tabIconActive: {
    backgroundColor: `${Colors.gold}15`,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
});
