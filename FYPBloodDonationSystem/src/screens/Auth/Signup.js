import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Signup = () => {
    const navigation = useNavigation();

    const [genderOpen, setGenderOpen] = useState(false);
    const [genderValue, setGenderValue] = useState(null);
    const [genderItems, setGenderItems] = useState([
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
    ]);

    const [bloodOpen, setBloodOpen] = useState(false);
    const [bloodValue, setBloodValue] = useState(null);
    const [bloodItems, setBloodItems] = useState([
        { label: 'A+', value: 'a+' },
        { label: 'O+', value: 'o+' },
        { label: 'B+', value: 'b+' },
        { label: 'AB+', value: 'ab+' },
        { label: 'A-', value: 'a-' },
        { label: 'O-', value: 'o-' },
        { label: 'B-', value: 'b-' },
        { label: 'AB-', value: 'ab-' },
    ]);

    const [email, onChangeEmail] = useState('');
    const [password, onChangePassword] = useState('');
    const [mobileNumber, onChangeMobNum] = useState('');
    const [address, onChangeAddress] = useState('');
    const [name, onChangeName] = useState('');
    const [loading, setLoading] = useState(false);

    const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

    const isPasswordStrong = (pwd) => {
        if (pwd.length < 8) return false;
        if (!/[A-Z]/.test(pwd)) return false;
        if (!/[a-z]/.test(pwd)) return false;
        if (!/[0-9]/.test(pwd)) return false;
        return true;
    };

    const userSignUp = async () => {
        if (!email.trim() || !password || !name.trim() || !mobileNumber.trim() || !address.trim() || !genderValue || !bloodValue) {
            Alert.alert('Missing Information', 'Please fill in all required fields.');
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }

        if (!isPasswordStrong(password)) {
            Alert.alert(
                'Weak Password',
                'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number.'
            );
            return;
        }

        setLoading(true);
        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email.trim(), password);
            const { uid } = userCredential.user;

            const profileImage = genderValue === 'male'
                ? 'https://static.vecteezy.com/system/resources/previews/002/002/427/original/man-avatar-character-isolated-icon-free-vector.jpg'
                : 'https://media.istockphoto.com/id/1331335536/vector/female-avatar-icon.jpg?s=170667a&w=0&k=20&c=-iyD_53ZEeZPc4SmvmGB1FJXZcHy_fvbJBv6O8HblHs=';

            await firestore().collection('users').doc(uid).set({
                name: name.trim(),
                address: address.trim(),
                mobileNumber: mobileNumber.trim(),
                genderValue,
                bloodValue,
                email: email.trim(),
                isOrg: false,
                image: profileImage,
            });

            await userCredential.user.sendEmailVerification();
            navigation.navigate('OTPVerification');
        } catch (error) {
            let msg = 'Something went wrong. Please try again.';
            if (error.code === 'auth/email-already-in-use') {
                msg = 'That email address is already registered.';
            } else if (error.code === 'auth/invalid-email') {
                msg = 'The email address entered is not valid.';
            } else {
                msg = error.code || error.message || msg;
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
                onChangeText={onChangeName}
                value={name}
                placeholder="Full Name"
                placeholderTextColor="#808080"
            />

            <TextInput
                style={styles.input}
                onChangeText={onChangeEmail}
                value={email}
                placeholder="Email Address"
                inputMode="email"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#808080"
            />

            <View style={styles.dropdown}>
                <DropDownPicker
                    placeholder="Gender"
                    open={genderOpen}
                    value={genderValue}
                    items={genderItems}
                    setOpen={setGenderOpen}
                    setValue={setGenderValue}
                    setItems={setGenderItems}
                    theme="LIGHT"
                />
            </View>

            <TextInput
                style={styles.input}
                onChangeText={onChangeMobNum}
                value={mobileNumber}
                placeholder="Mobile Number"
                inputMode="numeric"
                keyboardType="numeric"
                placeholderTextColor="#808080"
            />

            <TextInput
                style={styles.input}
                onChangeText={onChangeAddress}
                value={address}
                placeholder="Address"
                placeholderTextColor="#808080"
            />

            <View style={styles.dropdown}>
                <DropDownPicker
                    placeholder="Blood Group"
                    open={bloodOpen}
                    value={bloodValue}
                    items={bloodItems}
                    setOpen={setBloodOpen}
                    setValue={setBloodValue}
                    setItems={setBloodItems}
                    theme="LIGHT"
                    dropDownDirection="TOP"
                    listMode="MODAL"
                    searchable={true}
                    scrollViewProps={true}
                />
            </View>

            <TextInput
                style={styles.input}
                onChangeText={onChangePassword}
                value={password}
                secureTextEntry={true}
                placeholder="Password"
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
};

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
        borderRadius: 8,
        color: 'black',
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
    dropdown: {
        backgroundColor: '#171717',
        alignItems: 'center',
        justifyContent: 'center',
        width: 300,
        zIndex: 999,
        borderRadius: 8,
    },
});

export default Signup;
