import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator, Alert,
  KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet,
  Text, TextInput, Touchable, TouchableOpacity, View
} from 'react-native';

const API = 'http://192.168.1.2:8080'

export default function AddExpenseScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [category, setCategory]=useState('');

  async function handleSubmit() {
    if (!amount) return Alert.alert('Error', 'Amount is required');
    if (!category) return Alert.alert('Error', 'Please select a category');
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) return Alert.alert('Error', 'Enter a valid amount');

    
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('user_id');
      const res = await fetch(`${API}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: Number(userId),
          amount: parsed,
          description: description,
          category: category || 'General',
        }),
      });
      console.log(res.status);
      console.log(await res.text());
      Alert.alert('Done', 'Expense added!', [{ text: 'OK', onPress: () => {
        setAmount(''); setDescription(''); setCategory('');
        router.replace('/(tabs)');
      }}]);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#0f0f0f' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Add Expense</Text>

        <Text style={styles.label}>Category</Text>
        <View style={styles.chips}>
          {['FOOD','TRANSPORT','HOUSING','OTHER'].map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, category ===cat && styles.chipActive]}
            onPress={()=> setCategory(cat)}
          >
            <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Expense Type</Text>
        <TextInput 
          style={styles.input} placeholder="description" placeholderTextColor="#555"
          value={description} onChangeText={setDescription}
        />
        <Text style={styles.label}>Amount ($)</Text>
        <TextInput
          style={styles.input} placeholder="0.00" placeholderTextColor="#555"
          keyboardType="decimal-pad" value={amount} onChangeText={setAmount}
        />
        <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Save Expense</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60 },
  heading: { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 28 },
  label: { color: '#888', fontSize: 12, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 },
  input: {
    backgroundColor: '#1c1c1e', color: '#fff', borderRadius: 10,
    padding: 14, fontSize: 15, marginBottom: 20, borderWidth: 1, borderColor: '#2c2c2e',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#1c1c1e', borderWidth: 1, borderColor: '#2c2c2e' },
  chipActive: { backgroundColor: '#4f6ef7', borderColor: '#4f6ef7' },
  chipText: { color: '#888', fontSize: 13, fontWeight: '500' },
  chipTextActive: { color: '#fff' },
  btn: { backgroundColor: '#4f6ef7', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});