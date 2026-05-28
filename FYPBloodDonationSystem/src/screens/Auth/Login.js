import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const navigation = useNavigation();

  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const userLogin = async () => {
    if (email.trim().length === 0 || password.length === 0) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email.trim(), password);

      const uid = userCredential.user.uid;
      const doc = await firestore().collection('users').doc(uid).get();

      if (!doc.exists) {
        Alert.alert('Error', 'User record not found. Please sign up.');
        return;
      }

      await AsyncStorage.setItem('@user_Id', JSON.stringify(uid));
      await AsyncStorage.setItem('@user_data', JSON.stringify(doc.data()));

      if (doc.data().isOrg) {
        navigation.navigate('TabNavigationOrganizations');
      } else {
        navigation.navigate('TabNavigation');
      }
    } catch (error) {
      let msg = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        msg = 'Incorrect email or password.';
      } else if (error.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        msg = 'Too many failed attempts. Please try again later.';
      }
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Login</Text>

      <TextInput
        style={styles.input}
        onChangeText={onChangeEmail}
        value={email}
        placeholder="Email Address"
        inputMode="email"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#808080"
        mode="outlined"
        outlineStyle={{ borderRadius: 10, borderColor: '#969696' }}
      />

      <TextInput
        style={styles.input}
        onChangeText={onChangePassword}
        value={password}
        secureTextEntry={isVisible}
        right={
          <TextInput.Icon
            icon={isVisible ? require('../../../assets/eye-off.png') : require('../../../assets/eye.png')}
            iconColor="#969696"
            onPress={() => setIsVisible(!isVisible)}
          />
        }
        placeholder="Password"
        placeholderTextColor="#808080"
        mode="outlined"
        outlineStyle={{ borderRadius: 10, borderColor: '#969696' }}
      />

      <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={userLogin} disabled={loading}>
        {loading
          ? <ActivityIndicator color="white" />
          : <Text style={styles.btnText}>Log In</Text>
        }
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={{ color: '#353535' }}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignupFirst')}>
          <Text style={{ color: '#DE0A1E' }}>Signup</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={{ color: '#353535' }}>Forgot your password?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={{ color: '#DE0A1E' }}>Forgot Password</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 30,
    marginBottom: 30,
    color: 'black',
  },
  input: {
    width: '100%',
    marginBottom: 12,
    backgroundColor: 'white',
  },
  button: {
    width: '100%',
    height: 40,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    backgroundColor: '#DE0A1E',
    borderRadius: 10,
  },
  btnText: {
    fontSize: 18,
    color: 'white',
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Login;
