import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator, Alert,
    KeyboardAvoidingView, Platform,
    StyleSheet, Text, TextInput, Touchable, TouchableOpacity
} from 'react-native';

const API = 'http://192.168.1.3:8080'

export default function LoginScreen(){
    const router=useRouter();
    const [email, setEmail]=useState('');
    const [emailError, setEmailError]=useState('');
    const [password, setPassword]=useState('');
    const [passwordError, setPasswordError]=useState('');
    const [loading, setLoading]=useState(false);

    async function handleLogin(){
        if(!email) setEmailError('Please enter your email');
        if(!password) setPasswordError('Please enter your password');
        setLoading(true);
        
        try{
            console.log("LOGIN DATA:", {
                email,
                password,
            });
            const res=await fetch(`${API}/users/login`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({email, password}),
            })
            const responseText = await res.text();

            console.log("LOGIN STATUS:", res.status);
console.log("LOGIN RESPONSE:", responseText);

if (!res.ok) {
    Alert.alert('Login failed', responseText);
    return;
}

router.replace('/(tabs)');
        } catch (error: any) {
            console.log('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
            Alert.alert('Login error', error.message || 'Unknown error');
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
              placeholder="Email"
              placeholderTextColor="#888"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            {emailError ? <Text style={{ color: '#ef4444', fontSize: 12, marginBottom: 15, marginTop: -10 }}>{emailError}</Text> : null}
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
            {passwordError ? <Text style={{ color: '#ef4444', fontSize: 12, marginBottom: 15, marginTop: -10 }}>{passwordError}</Text> : null}
            <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Login</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={()=> router.push('./signup')}>
                <Text style={styles.btnText}> Get Started </Text>
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