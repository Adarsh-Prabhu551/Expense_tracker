import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator, Alert,
    KeyboardAvoidingView, Platform,
    StyleSheet, Text, TextInput, TouchableOpacity
} from 'react-native';

const API = 'http://192.168.1.3:8080'

export default function SignUpScreen(){
    const router=useRouter();
    const [name, setName]=useState('');
    const [income, setIncome]=useState('');
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');
    const [loading, setLoading]=useState(false);

    async function hadnleSignup(){
        if(!name) return Alert.alert('Error', 'Enter the name');
        if(!income) return Alert.alert('Error', 'Enter the income')
        if(!email) return Alert.alert('Error', 'Enter the email');
        if(!password) return Alert.alert('Error', 'Enter the password');
        setLoading(true);
        
        try{
            const res=await fetch(`${API}/users/signup`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({name, email, password}),
            })
            const data=await res.json();
            
            if (!res.ok) throw new Error(data.error || 'SignUp failed');
            await AsyncStorage.setItem('user_id', String(data.id));
            router.replace('/(tabs)')
        } catch(e: any){
            Alert.alert('Signup failed', e.message);
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
            <Text style={styles.sub}>Sign up to create an account</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#888"
              autoCapitalize='none'
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Income"
              placeholderTextColor="#888"
              autoCapitalize='none'
              value={income}
              onChangeText={setIncome}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.btn} onPress={hadnleSignup} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Signup</Text>}
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