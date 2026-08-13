import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const API = 'http://192.168.1.3:8080'

type Expense = {
  id: number;
  user_id: number;
  category: string;
  description: string;
  amount: number;
  created: string;
};

const CATEGORIES=[
  {label: 'ALL'},
  {label:'FOOD'},
  {label:'TRANSPORT'},
  {label:'HOUSING'},
  {label:'OTHER'}
];

export default function ExpensesScreen(){
  const router=useRouter();
  const [expenses, setExpenses]=useState<Expense[]>([]);
  const [loading, setLoading]=useState(true);
  const [refreshing, setRefreshing]=useState(false);
  const [selected, setSelected]=useState('ALL'); 
  const [dropdown, setDropdown]=useState(false);

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
      console.log('categories from API:', data.map((e: Expense) => e.category));
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

  const filteredExpense = selected === 'ALL' 
  ? expenses
  : expenses.filter(e=>e.category.toUpperCase()===selected);

  const activeCat = CATEGORIES.find(c => c.label === selected)!;

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

      <TouchableOpacity
        style={styles.trigger}
        onPress={()=>setDropdown(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.triggerLabel}>{activeCat.label}</Text>
        <Text style={styles.chevron}>{dropdown? '▲' : '▼'}</Text>
      </TouchableOpacity>

      <Modal
        transparent 
        visible={dropdown}
        animationType="fade"
        onRequestClose={()=> setDropdown(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={()=>setDropdown(false)}
        >
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Filter by category</Text>
            {CATEGORIES.map(cat=>{
              const isActive=selected===cat.label;
              return (
                <TouchableOpacity
                  key={cat.label}
                  style={[styles.option, isActive && styles.optionActive]}
                  onPress={()=>{setSelected(cat.label); setDropdown(false); }}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.optionLabel, isActive && styles.optionLabelActive]}>
                    {cat.label}
                  </Text>
                  {isActive && <Text style={styles.check}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      <FlatList
        data={filteredExpense}
        keyExtractor={item => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchExpenses(); }} />}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {selected ==='ALL' ? 'No expenses yet. Add one!' : `No expenses in "${selected}".`}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <Text style={styles.cardTitle}>{item.category}</Text>
                {item.description ? <Text style={styles.cardMeta}>{item.description}</Text> : null}
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deleteExpense(item.id)}
            >
            <Text style={styles.del}>del</Text>
            </TouchableOpacity>
          </View>
)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#0f0f0f', padding: 16, paddingTop: 60 },
  center:     { flex: 1, backgroundColor: '#0f0f0f', justifyContent: 'center', alignItems: 'center' },

  // Header
  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  heading:    { fontSize: 28, fontWeight: '700', color: '#fff' },
  totalBadge: { backgroundColor: '#1c1c2e', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  totalText:  { color: '#4f6ef7', fontWeight: '700', fontSize: 15 },

  // Dropdown trigger
  trigger: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#1c1c1e', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 11,
    marginBottom: 16, borderWidth: 1, borderColor: '#2a2a3e',
  },
  triggerIcon:  { fontSize: 18 },
  triggerLabel: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '600' },
  chevron:      { color: '#555', fontSize: 11 },
// Modal
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#1a1a1a', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, paddingBottom: 36,
  },
  sheetTitle: { color: '#888', fontSize: 12, fontWeight: '700', letterSpacing: 1.2, marginBottom: 12, textTransform: 'uppercase' },

  // Options
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 13, paddingHorizontal: 12,
    borderRadius: 10, marginBottom: 4,
  },
  optionActive:      { backgroundColor: '#1c1c2e' },
  optionIcon:        { fontSize: 20 },
  optionLabel:       { flex: 1, color: '#aaa', fontSize: 15, fontWeight: '500' },
  optionLabelActive: { color: '#4f6ef7', fontWeight: '700' },
  check:             { color: '#4f6ef7', fontWeight: '800', fontSize: 15 },
// List
  deleteBtn: {
  paddingHorizontal: 12,
  paddingVertical: 8,
  backgroundColor: '#2a1a1a',
  borderRadius: 8,
  marginLeft: 8,
  },
  del: { color: '#ff4444', fontSize: 13, fontWeight: '600' },
  empty:    { color: '#555', textAlign: 'center', marginTop: 60, fontSize: 15 },
  card: {
    backgroundColor: '#1c1c1e', borderRadius: 12, padding: 14,
    marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  cardLeft:       { flex: 1 },
  cardRight:      { alignItems: 'flex-end', gap: 6 },
  cardTitle:      { color: '#fff', fontSize: 15, fontWeight: '600' },
  cardMeta:       { color: '#666', fontSize: 12, marginTop: 3 },
  amount:         { color: '#4f6ef7', fontWeight: '700', fontSize: 16 },
});