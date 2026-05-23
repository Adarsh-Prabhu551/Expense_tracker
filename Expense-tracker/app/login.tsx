import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator, Alert,
    KeyboardAvoidingView, Platform,
    StyleSheet, Text, TextInput, TouchableOpacity
} from 'react-native';

const API= 'http://10.11.186.229:8080'

export default function LoginScreen(){
    const router=useRouter();
    const [name, setName]=useState('');
    const [loading, setLoading]=useState(false);

    async function handleLogin(){
        if(!name) return Alert.alert('Error', 'Enter your name');
        setLoading(true);
        
        try{
            const res=await fetch(`${API}/users/login`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ name}),
            })
            const data=await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');
            await AsyncStorage.setItem('user_id', String(data.id));
            router.replace('/(tabs)')
        } catch(e: any){
            Alert.alert('Login failed', e.message);
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS==='ios'?'padding':undefined}
        >
            <Text style={styles.title}>Expense Tracker</Text>
            <Text style={styles.sub}>Sign in to continue</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#888"
              autoCapitalize="none"
              value={name}
              onChangeText={setName}
            />
            <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Login</Text>}
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', justifyContent: 'center', padding: 28 },
  title: { fontSize: 32, fontWeight: '700', color: '#fff', marginBottom: 4 },
  sub: { color: '#666', marginBottom: 36, fontSize: 15 },
  input: {
    backgroundColor: '#1c1c1e', color: '#fff', borderRadius: 10,
    padding: 14, fontSize: 15, marginBottom: 14, borderWidth: 1, borderColor: '#2c2c2e',
  },
  btn: {
    backgroundColor: '#4f6ef7', borderRadius: 10, padding: 16,
    alignItems: 'center', marginTop: 8,
  },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});