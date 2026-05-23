import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const API= 'http://10.11.186.229:8080'

type Expense = {
  id: number;
  user_id: number;
  type: string;
  amount: number;
  created: string;
};

export default function ExpensesScreen(){
  const router=useRouter();
  const [expenses, setExpenses]=useState<Expense[]>([]);
  const [loading, setLoading]=useState(true);
  const [refreshing, setRefreshing]=useState(false);

  async function fetchExpenses(){
    try{
      const userId=await AsyncStorage.getItem('user_id')
      if (!userId) {
        router.replace('/login'); 
        return;
      }
      const res=await fetch(`${API}/expenses/user/${userId}`);
      const data=await res.json();
      setExpenses(data || []);
    }catch (e){
      Alert.alert('Error', 'Could not load expenses');
    }finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(useCallback(() => {fetchExpenses(); }, []));
  
  async function deleteExpense(id: number){
    Alert.alert('Delete', 'Remove this expense?', [
      {text : 'Cancel', style: 'cancel'},
      {
        text: 'Delete', style: 'destructive', onPress:async () =>{
          await fetch(`${API}/expenses/${id}`, { method:'DELETE'});
          setExpenses(prev=>prev.filter(e=>e.id!==id));
        }
      }
    ]);
  }

  const total=expenses.reduce((sum, e)=>sum+e.amount,0);
  if(loading) return (
    <View style={styles.center}>
      <ActivityIndicator color="#4f6ef7" size="large" />
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Expenses</Text>
        <View style={styles.totalBadge}>
          <Text style={styles.totalText}>${total.toFixed(2)}</Text>
        </View>
      </View>

      <FlatList
        data={expenses}
        keyExtractor={item => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchExpenses(); }} />}
        ListEmptyComponent={<Text style={styles.empty}>No expenses yet. Add one!</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <Text style={styles.cardTitle}>{item.type}</Text>
              <Text style={styles.cardMeta}>{new Date(item.created).toLocaleDateString()}</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
              <TouchableOpacity onPress={() => deleteExpense(item.id)}>
                <Text style={styles.del}>del</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 16, paddingTop: 60 },
  center: { flex: 1, backgroundColor: '#0f0f0f', justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  heading: { fontSize: 28, fontWeight: '700', color: '#fff' },
  totalBadge: { backgroundColor: '#1c1c2e', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  totalText: { color: '#4f6ef7', fontWeight: '700', fontSize: 15 },
  empty: { color: '#555', textAlign: 'center', marginTop: 60, fontSize: 15 },
  card: {
    backgroundColor: '#1c1c1e', borderRadius: 12, padding: 14,
    marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  cardLeft: { flex: 1 },
  cardRight: { alignItems: 'flex-end', gap: 6 },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '600' },
  cardMeta: { color: '#666', fontSize: 12, marginTop: 3 },
  amount: { color: '#4f6ef7', fontWeight: '700', fontSize: 16 },
  del: { color: '#ff4444', fontSize: 14 },
});