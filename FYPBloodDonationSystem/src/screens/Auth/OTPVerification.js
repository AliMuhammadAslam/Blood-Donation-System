import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, Alert, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';

const OTPVerification = () => {
  const navigation = useNavigation();

  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);

  const checkVerification = async () => {
    setChecking(true);
    try {
      await auth().currentUser.reload();
      const user = auth().currentUser;

      if (user.emailVerified) {
        // check if this user has already completed the questionnaire
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        const hasCompletedQuestionnaire = userDoc.exists && !!userDoc.data().questionnaireCompletedAt;

        if (hasCompletedQuestionnaire) {
          navigation.navigate('TabNavigation');
        } else {
          navigation.navigate('Questionnaire');
        }
      } else {
        Alert.alert(
          'Not Verified Yet',
          'We could not confirm your email yet. Please open the link in the email we sent you, then try again.'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const resendEmail = async () => {
    setResending(true);
    try {
      await auth().currentUser.sendEmailVerification();
      Alert.alert('Email Sent', 'A new verification link has been sent to your email.');
    } catch (error) {
      let msg = 'Could not resend the email. Please try again.';
      if (error.code === 'auth/too-many-requests') {
        msg = 'Too many requests. Please wait a moment before trying again.';
      }
      Alert.alert('Error', msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Verify Your Email" isRed={true} />

      <Image
        style={styles.image}
        resizeMode="contain"
        source={require('../../../assets/OTP-Verification.png')}
      />

      <Text style={styles.title}>Check your inbox</Text>
      <Text style={styles.subtitle}>
        We sent a verification link to your email address. Open it to verify your account, then come back and tap the button below.
      </Text>

      <TouchableOpacity
        style={[styles.button, checking && { opacity: 0.6 }]}
        onPress={checkVerification}
        disabled={checking}
      >
        {checking
          ? <ActivityIndicator color="white" />
          : <Text style={styles.btnText}>I've Verified My Email</Text>
        }
      </TouchableOpacity>

      <View style={styles.resendRow}>
        <Text style={styles.footerText}>Didn't receive an email?</Text>
        <TouchableOpacity onPress={resendEmail} disabled={resending}>
          {resending
            ? <ActivityIndicator size="small" color="#DE0A1E" />
            : <Text style={styles.resendText}>Resend</Text>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  image: {
    height: 150,
    width: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#353535',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#969696',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  button: {
    width: '100%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DE0A1E',
    borderRadius: 10,
    marginBottom: 16,
  },
  btnText: {
    fontSize: 17,
    color: 'white',
    fontWeight: '500',
  },
  resendRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  footerText: {
    color: '#353535',
    fontSize: 14,
  },
  resendText: {
    color: '#DE0A1E',
    fontSize: 14,
  },
});

export default OTPVerification;
