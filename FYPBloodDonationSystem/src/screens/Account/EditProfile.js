import React, { useState, useEffect } from 'react';
import {
    Alert, KeyboardAvoidingView, Platform, SafeAreaView,
    ScrollView, StyleSheet, Text, TextInput, TouchableOpacity,
    View, Image, ActivityIndicator,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Header from '../../components/Header';

const GENDER_ITEMS = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
];

const BLOOD_ITEMS = [
    { label: 'A+', value: 'A+' },
    { label: 'O+', value: 'O+' },
    { label: 'B+', value: 'B+' },
    { label: 'AB+', value: 'AB+' },
    { label: 'A-', value: 'A-' },
    { label: 'O-', value: 'O-' },
    { label: 'B-', value: 'B-' },
    { label: 'AB-', value: 'AB-' },
];

const EditProfile = () => {
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [address, setAddress] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [genderOpen, setGenderOpen] = useState(false);
    const [genderValue, setGenderValue] = useState(null);

    const [bloodOpen, setBloodOpen] = useState(false);
    const [bloodValue, setBloodValue] = useState(null);

    useEffect(() => {
        const uid = auth().currentUser?.uid;
        if (!uid) return;

        firestore().collection('users').doc(uid).get()
            .then(doc => {
                if (doc.exists) {
                    const data = doc.data();
                    setName(data.name || '');
                    setMobileNumber(data.mobileNumber || '');
                    setAddress(data.address || '');
                    setBloodValue(data.bloodValue || null);
                    setGenderValue(data.genderValue || null);
                    setImage(data.image || '');
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const saveChanges = async () => {
        if (!name.trim()) {
            Alert.alert('Validation', 'Please enter your full name.');
            return;
        }
        const digits = mobileNumber.replace(/\s/g, '');
        if (digits && !/^\d{10,15}$/.test(digits)) {
            Alert.alert('Validation', 'Please enter a valid mobile number (10–15 digits).');
            return;
        }

        setSaving(true);
        try {
            const uid = auth().currentUser?.uid;
            await firestore().collection('users').doc(uid).update({
                name: name.trim(),
                mobileNumber: mobileNumber.trim(),
                address: address.trim(),
                bloodValue,
                genderValue,
            });
            Alert.alert('Success', 'Your profile has been updated.');
        } catch {
            Alert.alert('Error', 'Could not save changes. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Header title="Edit Profile" isRed={true} navigation={navigation} />
                <View style={styles.centered}>
                    <ActivityIndicator color="#DE0A1E" size="large" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Edit Profile" isRed={true} navigation={navigation} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.avatarContainer}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatar, styles.avatarPlaceholder]} />
                        )}
                    </View>

                    <TextInput
                        style={styles.input}
                        onChangeText={setName}
                        value={name}
                        placeholder="Full Name"
                        placeholderTextColor="#808080"
                    />

                    <View style={[styles.dropdownWrapper, { zIndex: 3000, elevation: 3000 }]}>
                        <DropDownPicker
                            placeholder="Gender"
                            open={genderOpen}
                            value={genderValue}
                            items={GENDER_ITEMS}
                            setOpen={setGenderOpen}
                            setValue={setGenderValue}
                            theme="LIGHT"
                            style={styles.dropdownPicker}
                            dropDownContainerStyle={styles.dropdownContainer}
                        />
                    </View>

                    <TextInput
                        style={styles.input}
                        onChangeText={setMobileNumber}
                        value={mobileNumber}
                        placeholder="Mobile Number"
                        inputMode="numeric"
                        keyboardType="numeric"
                        placeholderTextColor="#808080"
                    />

                    <TextInput
                        style={styles.input}
                        onChangeText={setAddress}
                        value={address}
                        placeholder="Address"
                        placeholderTextColor="#808080"
                    />

                    <View style={[styles.dropdownWrapper, { zIndex: 2000, elevation: 2000 }]}>
                        <DropDownPicker
                            placeholder="Blood Group"
                            open={bloodOpen}
                            value={bloodValue}
                            items={BLOOD_ITEMS}
                            setOpen={setBloodOpen}
                            setValue={setBloodValue}
                            theme="LIGHT"
                            dropDownDirection="TOP"
                            listMode="MODAL"
                            searchable={true}
                            style={styles.dropdownPicker}
                            dropDownContainerStyle={styles.dropdownContainer}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, saving && { opacity: 0.7 }]}
                        onPress={saveChanges}
                        disabled={saving}
                    >
                        {saving
                            ? <ActivityIndicator color="white" />
                            : <Text style={styles.btnText}>Save Changes</Text>
                        }
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    avatarContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 16,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
    },
    avatarPlaceholder: {
        backgroundColor: '#E0E0E0',
    },
    input: {
        height: 46,
        width: '100%',
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#C0C0C0',
        paddingHorizontal: 12,
        borderRadius: 8,
        color: 'black',
        backgroundColor: 'white',
    },
    dropdownWrapper: {
        width: '100%',
        marginVertical: 8,
    },
    dropdownPicker: {
        borderColor: '#C0C0C0',
        borderRadius: 8,
        backgroundColor: 'white',
    },
    dropdownContainer: {
        borderColor: '#C0C0C0',
        backgroundColor: 'white',
    },
    button: {
        width: '100%',
        height: 46,
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DE0A1E',
        borderRadius: 8,
    },
    btnText: {
        fontSize: 17,
        color: 'white',
        fontWeight: '500',
    },
});

export default EditProfile;
