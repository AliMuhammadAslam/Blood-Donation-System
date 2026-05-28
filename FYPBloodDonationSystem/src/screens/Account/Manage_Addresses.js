import React, { useState, useEffect } from 'react';
import {
    StyleSheet, TouchableOpacity, View, Text,
    ScrollView, TextInput, ActivityIndicator, Alert,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ManageAddresses = ({ navigation }) => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newAddress, setNewAddress] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [saving, setSaving] = useState(false);

    const uid = auth().currentUser?.uid;

    useEffect(() => {
        if (!uid) return;

        firestore().collection('users').doc(uid).get()
            .then(doc => {
                if (doc.exists) {
                    const locs = doc.data().donationLocations;
                    if (Array.isArray(locs)) setLocations(locs);
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const persistLocations = (updated) =>
        firestore().collection('users').doc(uid).update({ donationLocations: updated });

    const addLocation = async () => {
        const trimmed = newAddress.trim();
        if (!trimmed) {
            Alert.alert('Please enter an address.');
            return;
        }
        setSaving(true);
        try {
            const updated = [...locations, trimmed];
            await persistLocations(updated);
            setLocations(updated);
            setNewAddress('');
            setShowInput(false);
        } catch {
            Alert.alert('Error', 'Could not save address. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const removeLocation = async (index) => {
        const updated = locations.filter((_, i) => i !== index);
        try {
            await persistLocations(updated);
            setLocations(updated);
        } catch {
            Alert.alert('Error', 'Could not remove address. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Manage Addresses" isRed={true} navigation={navigation} />

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator color="#DE0A1E" size="large" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    <Text style={styles.subtitle}>
                        Add multiple locations where you can travel to donate blood.
                    </Text>

                    {locations.length === 0 && !showInput && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No locations added yet.</Text>
                        </View>
                    )}

                    {locations.map((loc, index) => (
                        <View key={index} style={styles.locationRow}>
                            <Text style={styles.locationText} numberOfLines={2}>{loc}</Text>
                            <TouchableOpacity
                                onPress={() => removeLocation(index)}
                                style={styles.deleteBtn}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                                <FontAwesomeIcon icon={faTrash} size={16} color="#DE0A1E" />
                            </TouchableOpacity>
                        </View>
                    ))}

                    {showInput && (
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                value={newAddress}
                                onChangeText={setNewAddress}
                                placeholder="Enter address..."
                                placeholderTextColor="#999"
                                autoFocus
                            />
                            <TouchableOpacity
                                style={[styles.confirmBtn, saving && { opacity: 0.6 }]}
                                onPress={addLocation}
                                disabled={saving}
                            >
                                {saving
                                    ? <ActivityIndicator color="white" size="small" />
                                    : <Text style={styles.confirmBtnText}>Add</Text>
                                }
                            </TouchableOpacity>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.addMoreBtn}
                        onPress={() => {
                            setShowInput(v => !v);
                            if (showInput) setNewAddress('');
                        }}
                    >
                        <FontAwesomeIcon icon={faPlus} size={15} color="white" />
                        <Text style={styles.addMoreText}>{showInput ? 'Cancel' : 'Add more'}</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}
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
        padding: 25,
    },
    subtitle: {
        fontWeight: '600',
        paddingBottom: 20,
        color: 'black',
        fontSize: 15,
        lineHeight: 22,
    },
    locationRow: {
        flexDirection: 'row',
        borderRadius: 10,
        borderColor: '#C0C0C0',
        borderWidth: 1,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    locationText: {
        color: 'black',
        flex: 1,
        marginRight: 10,
        fontSize: 14,
    },
    deleteBtn: {
        padding: 4,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    emptyText: {
        color: '#969696',
        fontSize: 15,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    input: {
        flex: 1,
        height: 44,
        borderWidth: 1,
        borderColor: '#C0C0C0',
        borderRadius: 8,
        paddingHorizontal: 12,
        color: 'black',
        backgroundColor: 'white',
    },
    confirmBtn: {
        backgroundColor: '#DE0A1E',
        borderRadius: 8,
        paddingHorizontal: 16,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmBtnText: {
        color: 'white',
        fontWeight: '600',
    },
    addMoreBtn: {
        flexDirection: 'row',
        borderRadius: 10,
        backgroundColor: '#DE0A1E',
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'center',
        marginTop: 8,
    },
    addMoreText: {
        color: 'white',
        fontSize: 14,
    },
});

export default ManageAddresses;
