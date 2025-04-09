import { Tabs } from 'expo-router';
import { ChartBar, Apple, User, Heart, Home } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4ECDC4',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 8,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name='health'
        options={{
          title: 'Health',
          tabBarIcon: ({ color, size }) => (
            <Heart size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="diet"
        options={{
          title: 'Diet',
          tabBarIcon: ({ color, size }) => (
            <Apple size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Doo Doo',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, size }) => (
            <ChartBar size={size} color={color} />
          ),
        }}
      />
      
      {/* <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      /> */}

      <Tabs.Screen
        name='settings'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}/>
    </Tabs>
  );
}