import { Tabs } from 'expo-router';
import { TabBar } from '../../src/components/layout/TabBar';

export default function AppLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ tabBarLabel: 'Home' }} />
      <Tabs.Screen name="schedule/index" options={{ tabBarLabel: 'Schedule' }} />
      <Tabs.Screen name="players/index" options={{ tabBarLabel: 'Players' }} />
      <Tabs.Screen name="scoring/index" options={{ tabBarLabel: 'Scores' }} />
      <Tabs.Screen name="profile/index" options={{ tabBarLabel: 'Profile' }} />
      <Tabs.Screen name="schedule/[id]" options={{ href: null }} />
      <Tabs.Screen name="schedule/add" options={{ href: null }} />
      <Tabs.Screen name="players/[id]" options={{ href: null }} />
      <Tabs.Screen name="players/add" options={{ href: null }} />
      <Tabs.Screen name="teams/index" options={{ href: null }} />
      <Tabs.Screen name="teams/[id]" options={{ href: null }} />
      <Tabs.Screen name="teams/create" options={{ href: null }} />
      <Tabs.Screen name="availability/index" options={{ href: null }} />
      <Tabs.Screen name="scoring/live" options={{ href: null }} />
      <Tabs.Screen name="membership/index" options={{ href: null }} />
      <Tabs.Screen name="recording/index" options={{ href: null }} />
      <Tabs.Screen name="profile/edit" options={{ href: null }} />
    </Tabs>
  );
}
