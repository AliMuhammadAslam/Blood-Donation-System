import React, { useState } from 'react';
import { Alert, BackHandler, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

function Signup_second({ route }) {
    const { name, address, mobileNumber, genderValue, bloodValue, email, isEmergencyDonor } = route.params;

    const navigation = useNavigation();

    const [password, onChangePassword] = useState('');
    const [confirmPassword, onChangeConfirmPassword] = useState('');
    const [isPassVisible, setIsPassVisible] = useState(true);
    const [isConPassVisible, setIsConPassVisible] = useState(true);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.goBack();
        });
        return () => backHandler.remove();
    }, []);

    const isPasswordStrong = (pwd) => {
        if (pwd.length < 8) return false;
        if (!/[A-Z]/.test(pwd)) return false;
        if (!/[a-z]/.test(pwd)) return false;
        if (!/[0-9]/.test(pwd)) return false;
        return true;
    };

    const userSignUp = async () => {
        if (!email || !password || !name || !mobileNumber || !address || !genderValue || !bloodValue || !isEmergencyDonor) {
            Alert.alert('Missing Information', 'Please fill in all required fields.');
            return;
        }

        if (!isPasswordStrong(password)) {
            Alert.alert(
                'Weak Password',
                'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number.'
            );
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Mismatch', 'Passwords do not match. Please try again.');
            onChangePassword('');
            onChangeConfirmPassword('');
            return;
        }

        setLoading(true);
        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            const { uid } = userCredential.user;

            const profileImage = genderValue === 'male'
                ? 'https://static.vecteezy.com/system/resources/previews/002/002/427/original/man-avatar-character-isolated-icon-free-vector.jpg'
                : 'https://media.istockphoto.com/id/1331335536/vector/female-avatar-icon.jpg?s=170667a&w=0&k=20&c=-iyD_53ZEeZPc4SmvmGB1FJXZcHy_fvbJBv6O8HblHs=';

            await firestore().collection('users').doc(uid).set({
                name,
                address,
                mobileNumber,
                genderValue,
                bloodValue,
                email,
                isOrg: false,
                isEmergencyDonor,
                image: profileImage,
            });

            await userCredential.user.sendEmailVerification();

            Alert.alert('Account Created', 'A verification email has been sent. Please verify before continuing.');
            navigation.navigate('OTPVerification');
        } catch (error) {
            let msg = 'Something went wrong. Please try again.';
            if (error.code === 'auth/email-already-in-use') {
                msg = 'That email address is already registered.';
            } else if (error.code === 'auth/invalid-email') {
                msg = 'The email address entered is not valid.';
            }
            Alert.alert('Sign Up Failed', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Signup</Text>

            <TextInput
                style={styles.input}
                onChangeText={onChangePassword}
                value={password}
                secureTextEntry={isPassVisible}
                right={
                    <TextInput.Icon
                        icon={isPassVisible ? require('../../assets/eye-off.png') : require('../../assets/eye.png')}
                        onPress={() => setIsPassVisible(!isPassVisible)}
                    />
                }
                placeholder="Password"
                placeholderTextColor="#808080"
            />

            <TextInput
                style={styles.input}
                onChangeText={onChangeConfirmPassword}
                value={confirmPassword}
                secureTextEntry={isConPassVisible}
                right={
                    <TextInput.Icon
                        icon={isConPassVisible ? require('../../assets/eye-off.png') : require('../../assets/eye.png')}
                        onPress={() => setIsConPassVisible(!isConPassVisible)}
                    />
                }
                placeholder="Confirm Password"
                placeholderTextColor="#808080"
            />

            <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={userSignUp} disabled={loading}>
                {loading
                    ? <ActivityIndicator color="white" />
                    : <Text style={styles.btnText}>Sign Up</Text>
                }
            </TouchableOpacity>

            <Text style={styles.footer}>
                Already have an account?{' '}
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={{ color: '#DE0A1E' }}>Login</Text>
                </TouchableOpacity>
            </Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    input: {
        height: 40,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 12,
        color: 'black',
        backgroundColor: 'white',
        borderTopEndRadius: 15,
        borderBottomEndRadius: 15,
        borderBottomStartRadius: 15,
        borderTopStartRadius: 15,
    },
    header: {
        fontSize: 30,
        marginBottom: 30,
        color: 'black',
    },
    footer: {
        margin: 10,
        color: '#808080',
    },
    button: {
        width: 300,
        height: 40,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        backgroundColor: '#DE0A1E',
        borderRadius: 5,
    },
    btnText: {
        fontSize: 18,
        color: 'white',
    },
});

export default Signup_second;
