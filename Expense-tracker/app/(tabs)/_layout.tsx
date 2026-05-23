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
      <Tabs.Screen name="index" options={{ title:'Expenses', tabBarIcon: ()=>null}} />
      <Tabs.Screen name="explore" options={{title:'Add Expense', tabBarIcon: () => null}} />
    </Tabs>
  );
}