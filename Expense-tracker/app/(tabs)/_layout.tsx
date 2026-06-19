import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout(){
  return (
    <Tabs
      screenOptions={{
        headerShown:false,
        tabBarStyle:{backgroundColor: '#0f0f0f', borderTopColor:'#1c1c1e'},
        tabBarActiveTintColor:'#4f6ef7',
        tabBarInactiveTintColor:'#555'
      }}
    >
      
      <Tabs.Screen 
        name="index" 
        options={{ title:'Home', 
        tabBarIcon: ({color, size}) => (
          <Ionicons name="home" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="explore"
        options={{title:'Expenses',
        tabBarIcon: ({color, size}) => (
          <Ionicons name="wallet" size={size} color={color} />
        ),
        }} 
      />
      
    </Tabs>
  );
}