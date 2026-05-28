import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, ActivityIndicator, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDroplet, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { rankDonors } from '../utils/bloodCompatibility';

const getMatchMeta = (score) => {
    if (score >= 90) return { label: 'Perfect Match', color: '#1B7F3A' };
    if (score >= 70) return { label: 'Good Match', color: '#D4820A' };
    return { label: 'Compatible', color: '#2D9CDB' };
};

const DonorCard = ({ donor, navigation }) => {
    const meta = getMatchMeta(donor.matchScore);
    const isAvailable = donor.availableToDonate === true;

    return (
        <View style={styles.card}>
            <Image
                source={{ uri: donor.image }}
                style={styles.avatar}
            />
            <View style={styles.cardBody}>
                <Text style={styles.donorName}>{donor.name}</Text>
                <Text style={styles.donorAddress} numberOfLines={1}>
                    {donor.address || 'Address not provided'}
                </Text>
                <View style={styles.availRow}>
                    <FontAwesomeIcon
                        icon={isAvailable ? faCircleCheck : faCircleXmark}
                        size={13}
                        color={isAvailable ? '#1B7F3A' : '#969696'}
                    />
                    <Text style={[styles.availText, { color: isAvailable ? '#1B7F3A' : '#969696' }]}>
                        {isAvailable ? 'Available to donate' : 'Currently unavailable'}
                    </Text>
                </View>
            </View>
            <View style={styles.cardRight}>
                <View style={styles.bloodBadge}>
                    <FontAwesomeIcon icon={faDroplet} size={34} color="#DE0A1E" />
                    <Text style={styles.bloodBadgeText}>
                        {donor.bloodValue?.toUpperCase() || '?'}
                    </Text>
                </View>
                <View style={[styles.matchBadge, { backgroundColor: meta.color }]}>
                    <Text style={styles.matchBadgeText}>{meta.label}</Text>
                </View>
            </View>
        </View>
    );
};

const DonorMatches = ({ route, navigation }) => {
    const { bloodType } = route.params;
    const currentUid = auth().currentUser?.uid;

    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        firestore()
            .collection('users')
            .where('isOrg', '==', false)
            .get()
            .then(snapshot => {
                const users = snapshot.docs
                    .map(doc => ({ uid: doc.id, ...doc.data() }))
                    .filter(u => u.uid !== currentUid);

                setDonors(rankDonors(users, bloodType));
            })
            .catch(() => setDonors([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Compatible Donors" isRed={true} navigation={navigation} />

            <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}>
                    Donors compatible with blood type{' '}
                    <Text style={{ color: '#DE0A1E', fontWeight: 'bold' }}>{bloodType}</Text>
                    {' '}— ranked by best match
                </Text>
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator color="#DE0A1E" size="large" />
                </View>
            ) : donors.length === 0 ? (
                <View style={styles.centered}>
                    <FontAwesomeIcon icon={faDroplet} size={42} color="#B6B6B6" />
                    <Text style={styles.emptyTitle}>No compatible donors found</Text>
                    <Text style={styles.emptySubText}>
                        No registered donors match this blood type yet. Check back as more users join.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={donors}
                    renderItem={({ item }) => <DonorCard donor={item} navigation={navigation} />}
                    keyExtractor={item => item.uid}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
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
        gap: 10,
        paddingHorizontal: 30,
    },
    subHeader: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#FFF5F5',
        borderBottomWidth: 1,
        borderBottomColor: '#FFE0E0',
    },
    subHeaderText: {
        color: '#353535',
        fontSize: 13,
        lineHeight: 18,
    },
    list: {
        padding: 16,
        paddingBottom: 30,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        backgroundColor: 'white',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#E0E0E0',
    },
    cardBody: {
        flex: 1,
        marginLeft: 12,
    },
    donorName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#353535',
    },
    donorAddress: {
        fontSize: 13,
        color: '#969696',
        marginTop: 2,
    },
    availRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 5,
    },
    availText: {
        fontSize: 12,
    },
    cardRight: {
        alignItems: 'center',
        gap: 6,
        marginLeft: 8,
    },
    bloodBadge: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    bloodBadgeText: {
        position: 'absolute',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 11,
        marginTop: 6,
    },
    matchBadge: {
        borderRadius: 8,
        paddingHorizontal: 7,
        paddingVertical: 3,
    },
    matchBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '700',
    },
    emptyTitle: {
        color: '#353535',
        fontSize: 17,
        fontWeight: '600',
        marginTop: 8,
    },
    emptySubText: {
        color: '#969696',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default DonorMatches;
