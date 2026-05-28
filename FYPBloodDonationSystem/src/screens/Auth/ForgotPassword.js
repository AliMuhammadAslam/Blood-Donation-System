import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert, ActivityIndicator } from 'react-native';
import Header from '../../components/Header';
import auth from '@react-native-firebase/auth';

const ForgotPassword = ({ navigation }) => {
  const forgotPassImage = require('../../../assets/forgotPassPic.png');

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handlePasswordReset = async () => {
    if (email.trim().length === 0) {
      Alert.alert('Missing Field', 'Please enter your email address.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await auth().sendPasswordResetEmail(email.trim());
      Alert.alert(
        'Email Sent',
        'A password reset link has been sent to your email address.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      let msg = 'Failed to send reset email. Please try again.';
      if (error.code === 'auth/user-not-found') {
        msg = 'No account found with that email address.';
      } else if (error.code === 'auth/too-many-requests') {
        msg = 'Too many requests. Please wait before trying again.';
      }
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Forgot Password" isRed={true} navigation={navigation} />
      <View style={styles.innerContainer}>
        <Image source={forgotPassImage} />
        <Text style={styles.text}>Enter the email address associated with your account.</Text>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email Address"
          placeholderTextColor="#969696"
          inputMode="email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.text}>We will email you a link to reset your password.</Text>

        <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={handlePasswordReset} disabled={loading}>
          {loading
            ? <ActivityIndicator color="white" />
            : <Text style={styles.buttonText}>Send</Text>
          }
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={{ color: '#353535' }}>Didn't receive an email?</Text>
          <TouchableOpacity onPress={handlePasswordReset} disabled={loading}>
            <Text style={{ color: '#DE0A1E' }}>Resend</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  innerContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#353535',
    width: '100%',
  },
  input: {
    marginTop: 10,
    height: 40,
    width: '100%',
    borderWidth: 1,
    padding: 12,
    borderRadius: 5,
    borderColor: '#969696',
    color: '#353535',
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    height: 40,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    backgroundColor: '#DE0A1E',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
});

export default ForgotPassword;
