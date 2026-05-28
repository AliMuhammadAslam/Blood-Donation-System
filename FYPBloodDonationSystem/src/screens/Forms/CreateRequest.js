import React, { useState, useEffect } from 'react';
import { Alert, View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Header from '../../components/Header';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import SelectDropdown from 'react-native-select-dropdown';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';

const CreateRequest = ({ navigation }) => {
    const isFocused = useIsFocused();

    const [name, setName] = useState('');
    const [bloodType, setBloodType] = useState(null);
    const [bloodItems] = useState(['A+', 'B+', 'O+', 'O-', 'AB+', 'A-', 'B-', 'AB-']);
    const [notes, setNotes] = useState('');
    const [expiryDate, setExpiryDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const currentDate = new Date();

    const onExpiryDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) setExpiryDate(selectedDate);
    };

    useEffect(() => {
        if (isFocused) {
            setName('');
            setBloodType(null);
            setNotes('');
            setExpiryDate(new Date());
        }
    }, [isFocused]);

    const postRequest = async () => {
        if (!name.trim() || !bloodType || !notes.trim()) {
            Alert.alert('Missing Information', 'Please fill in all required fields.');
            return;
        }

        setLoading(true);
        try {
            const uid = auth().currentUser.uid;
            const userDoc = await firestore().collection('users').doc(uid).get();

            if (!userDoc.exists) {
                Alert.alert('Error', 'Could not find your user profile.');
                return;
            }

            const userName = userDoc.data().name;

            await firestore().collection('requests').doc().set({
                uid,
                userName,
                hospitalName: name.trim(),
                bloodType,
                notes: notes.trim(),
                postedAt: currentDate,
                expiryDate,
            });

            Alert.alert('Success', 'Your blood request has been posted.');
            navigation.navigate('Home');
        } catch (error) {
            Alert.alert('Error', 'Failed to post the request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Create a Request" isRed={true} navigation={navigation} />
            <View style={styles.innerContainer}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        underlineColorAndroid="transparent"
                        placeholder="Select Hospital"
                        placeholderTextColor="#969696"
                        mode="outlined"
                        outlineStyle={{
                            borderWidth: 1,
                            borderRadius: 10,
                            borderColor: '#b6b6b6',
                        }}
                    />

                    <SelectDropdown
                        data={bloodItems}
                        onSelect={(selectedItem) => setBloodType(selectedItem)}
                        buttonTextAfterSelection={(selectedItem) => selectedItem}
                        rowTextForSelection={(item) => item}
                        defaultButtonText="Select Blood Group"
                        buttonStyle={styles.picker}
                        buttonTextStyle={{ fontSize: 16, color: '#969696', textAlign: 'left' }}
                    />

                    <Text style={{ fontSize: 16, color: '#969696' }}>Current Date: {currentDate.toLocaleDateString()}</Text>

                    <View style={{ flexDirection: 'row', gap: 15, alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, color: '#969696' }}>Expiry Date: {expiryDate.toLocaleDateString()}</Text>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                            <FontAwesomeIcon icon={faCalendarDays} size={26} color="#DE0A1E" />
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={expiryDate}
                            mode="date"
                            minimumDate={currentDate}
                            onChange={onExpiryDateChange}
                        />
                    )}

                    <TextInput
                        style={styles.multiline_input}
                        underlineColorAndroid="transparent"
                        underlineColor="transparent"
                        placeholder="Note"
                        placeholderTextColor="#969696"
                        multiline={true}
                        numberOfLines={4}
                        maxLength={40}
                        value={notes}
                        onChangeText={setNotes}
                    />

                    <TouchableOpacity
                        style={[styles.postButton, loading && { opacity: 0.6 }]}
                        onPress={postRequest}
                        disabled={loading}
                    >
                        {loading
                            ? <ActivityIndicator color="white" />
                            : <Text style={styles.postButtonText}>Post Request</Text>
                        }
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
        alignItems: 'center',
    },
    innerContainer: {
        paddingTop: 40,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        flexDirection: 'column',
        width: '90%',
        gap: 20,
    },
    input: {
        height: 40,
        backgroundColor: 'white',
    },
    multiline_input: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#b6b6b6',
        backgroundColor: 'white',
    },
    picker: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#b6b6b6',
        backgroundColor: 'white',
    },
    postButton: {
        height: 45,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DE0A1E',
        marginTop: 70,
    },
    postButtonText: {
        fontSize: 18,
        color: 'white',
    },
});

export default CreateRequest;
