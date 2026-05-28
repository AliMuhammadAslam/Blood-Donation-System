import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';

const ChangePassword = () => {
    const navigation = useNavigation();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(true);
    const [showNew, setShowNew] = useState(true);
    const [showConfirm, setShowConfirm] = useState(true);
    const [loading, setLoading] = useState(false);

    const isPasswordStrong = (pwd) => {
        if (pwd.length < 8) return false;
        if (!/[A-Z]/.test(pwd)) return false;
        if (!/[a-z]/.test(pwd)) return false;
        if (!/[0-9]/.test(pwd)) return false;
        return true;
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            Alert.alert('Missing Fields', 'Please fill in all fields.');
            return;
        }

        if (!isPasswordStrong(newPassword)) {
            Alert.alert(
                'Weak Password',
                'New password must be at least 8 characters and include an uppercase letter, lowercase letter, and a number.'
            );
            return;
        }

        if (newPassword !== confirmNewPassword) {
            Alert.alert('Mismatch', 'New passwords do not match.');
            return;
        }

        if (newPassword === currentPassword) {
            Alert.alert('Same Password', 'New password cannot be the same as your current password.');
            return;
        }

        setLoading(true);
        try {
            const user = auth().currentUser;
            const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);

            await user.reauthenticateWithCredential(credential);
            await user.updatePassword(newPassword);

            Alert.alert('Success', 'Your password has been changed successfully.', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            let msg = 'Failed to change password. Please try again.';
            if (error.code === 'auth/wrong-password') {
                msg = 'Current password is incorrect.';
            } else if (error.code === 'auth/too-many-requests') {
                msg = 'Too many attempts. Please try again later.';
            } else if (error.code === 'auth/requires-recent-login') {
                msg = 'Session expired. Please log out and log back in.';
            }
            Alert.alert('Error', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Change Password" isRed={true} />

            <View style={styles.formContainer}>
                <Text style={styles.label}>Current Password</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setCurrentPassword}
                    value={currentPassword}
                    secureTextEntry={showCurrent}
                    right={
                        <TextInput.Icon
                            icon={showCurrent ? require('../../../assets/eye-off.png') : require('../../../assets/eye.png')}
                            onPress={() => setShowCurrent(!showCurrent)}
                        />
                    }
                    placeholder="Enter current password"
                    placeholderTextColor="#808080"
                />

                <Text style={styles.label}>New Password</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setNewPassword}
                    value={newPassword}
                    secureTextEntry={showNew}
                    right={
                        <TextInput.Icon
                            icon={showNew ? require('../../../assets/eye-off.png') : require('../../../assets/eye.png')}
                            onPress={() => setShowNew(!showNew)}
                        />
                    }
                    placeholder="Enter new password"
                    placeholderTextColor="#808080"
                />

                <Text style={styles.label}>Confirm New Password</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setConfirmNewPassword}
                    value={confirmNewPassword}
                    secureTextEntry={showConfirm}
                    right={
                        <TextInput.Icon
                            icon={showConfirm ? require('../../../assets/eye-off.png') : require('../../../assets/eye.png')}
                            onPress={() => setShowConfirm(!showConfirm)}
                        />
                    }
                    placeholder="Confirm new password"
                    placeholderTextColor="#808080"
                />

                <TouchableOpacity
                    style={[styles.button, loading && { opacity: 0.6 }]}
                    onPress={handleChangePassword}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator color="white" />
                        : <Text style={styles.btnText}>Change Password</Text>
                    }
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    formContainer: {
        width: 300,
        marginTop: 20,
    },
    label: {
        fontSize: 16,
        color: '#353535',
        marginTop: 10,
        marginBottom: 4,
    },
    input: {
        height: 40,
        marginBottom: 4,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    button: {
        width: '100%',
        height: 40,
        marginTop: 20,
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

export default ChangePassword;
