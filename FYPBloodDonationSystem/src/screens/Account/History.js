import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDroplet } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/Header';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const History = (props) => {
    const { title } = props.route.params;
    const isDonation = title === 'Donation History';

    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const uid = auth().currentUser?.uid;
        if (!uid) return;

        // donation history = appointments where the current user was the donor
        // receiving history = requests posted by the current user (they needed blood)
        const query = isDonation
            ? firestore().collection('appointments').where('donorId', '==', uid).orderBy('createdAt', 'desc')
            : firestore().collection('requests').where('uid', '==', uid).orderBy('postedAt', 'desc');

        query.get()
            .then(snapshot => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setHistoryData(data);
            })
            .catch(() => setHistoryData([]))
            .finally(() => setLoading(false));
    }, []);

    const InfoBox = ({ data }) => (
        <View style={styles.box}>
            <View style={{ flex: 1 }}>
                <Text style={styles.nameText}>
                    {isDonation ? data.receiverName : data.userName}
                </Text>
                <View style={styles.infoRow}>
                    <Text style={styles.labelText}>Hospital: </Text>
                    <Text style={styles.valueText} numberOfLines={1}>
                        {data.hospitalName || data.hospital || '—'}
                    </Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.labelText}>Date: </Text>
                    <Text style={styles.valueText}>
                        {data.postedAt?.toDate?.()
                            ? data.postedAt.toDate().toLocaleDateString()
                            : data.createdAt?.toDate?.()
                                ? data.createdAt.toDate().toLocaleDateString()
                                : '—'}
                    </Text>
                </View>
            </View>
            <View style={styles.bloodBadge}>
                <FontAwesomeIcon icon={faDroplet} size={34} color="#DE0A1E" />
                <Text style={styles.bloodBadgeText}>
                    {data.bloodType || '?'}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header title={title} isRed={true} navigation={props.navigation} />

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator color="#DE0A1E" size="large" />
                </View>
            ) : historyData.length === 0 ? (
                <View style={styles.centered}>
                    <FontAwesomeIcon icon={faDroplet} size={40} color="#B6B6B6" />
                    <Text style={styles.emptyTitle}>No history yet</Text>
                    <Text style={styles.emptySubText}>
                        {isDonation
                            ? 'Your blood donations will appear here.'
                            : 'Blood requests you have posted will appear here.'}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={historyData}
                    renderItem={({ item }) => <InfoBox data={item} />}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
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
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    box: {
        borderColor: '#B6B6B6',
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
    },
    nameText: {
        color: 'black',
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 4,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    labelText: {
        color: '#353535',
        fontSize: 14,
    },
    valueText: {
        color: '#969696',
        fontSize: 14,
        flex: 1,
    },
    bloodBadge: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    bloodBadgeText: {
        position: 'absolute',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
        marginTop: 6,
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

export default History;
