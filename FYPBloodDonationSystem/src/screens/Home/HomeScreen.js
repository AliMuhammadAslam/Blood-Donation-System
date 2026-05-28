import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeHeader from '../../components/HomeHeader';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationDot, faDroplet, faRobot, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Slideshow from '../../components/slideshow';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const BLOOD_GROUPS = ['A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-'];

const HomeScreen = ({ navigation }) => {
    const blood_bank_icon = require('../../../assets/bloodbank.png');
    const emergency_donor = require('../../../assets/emergencydonor.png');
    const post_request = require('../../../assets/envelope.png');
    const blood_drop = require('../../../assets/blood_drop.jpg');

    const [userDetails, setDetails] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(true);

    const HomeBoxData = [
        { icon: <Image style={{ width: 65, height: 55, marginTop: 10 }} source={post_request} />, title: 'Post Blood Request', route: 'CreateRequest' },
        { icon: <Image style={{ width: 70, height: 90 }} source={blood_bank_icon} />, title: 'Blood Bank', route: 'My Organizations' },
        { icon: <Image style={{ width: 55, height: 60, marginTop: 10 }} source={emergency_donor} />, title: 'Emergency Donors', route: 'EmergencyDonors' },
    ];

    const BloodStatDrop = ({ blood_grp, icon }) => (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Image style={{ width: 35, height: 45 }} source={icon} />
            <Text style={{ fontSize: 13, color: '#353535', textAlign: 'center', marginTop: 2 }}>{blood_grp}</Text>
        </View>
    );

    const HomeBox = ({ icon, title, route }) => (
        <TouchableOpacity style={styles.homeBox} onPress={() => navigation.navigate(route)}>
            <View style={{ height: 80 }}>{icon}</View>
            <View style={styles.homeBoxLabel}>
                <Text style={{ fontSize: 13, color: '#353535', textAlign: 'center' }}>{title}</Text>
            </View>
        </TouchableOpacity>
    );

    const RequestBox = ({ data }) => (
        <View style={styles.requestBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '600', fontSize: 18, color: '#353535' }}>{data.userName}</Text>
                    <Text style={{ paddingVertical: 3, color: '#969696' }} numberOfLines={1}>{data.hospitalName}</Text>
                </View>
                <View>
                    <FontAwesomeIcon icon={faDroplet} size={45} color="#DE0A1E" />
                    <Text style={{ color: 'white', position: 'absolute', right: 12, marginTop: 14, fontWeight: 'bold', fontSize: 14 }}>{data.bloodType}</Text>
                </View>
            </View>
            <View style={styles.divider} />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                <TouchableOpacity style={styles.requestActionBtn}>
                    <Text style={{ fontSize: 16, color: '#8C8C8C' }}>Skip</Text>
                </TouchableOpacity>
                <View style={styles.verticalDivider} />
                <TouchableOpacity
                    style={styles.requestActionBtn}
                    onPress={() => navigation.navigate('DonationRequestInfo', { docId: data.id })}
                >
                    <Text style={{ fontSize: 16, color: '#DE0A1E' }}>Donate Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    useEffect(() => {
        const uid = auth().currentUser?.uid;
        if (!uid) return;

        firestore().collection('users').doc(uid).get()
            .then(doc => { if (doc.exists) setDetails(doc.data()); })
            .catch(() => {});

        setLoadingRequests(true);
        firestore()
            .collection('requests')
            .where('uid', '!=', uid)
            .limit(10)
            .get()
            .then(snapshot => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setRequests(data);
            })
            .catch(() => setRequests([]))
            .finally(() => setLoadingRequests(false));
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {userDetails?.name
                ? <HomeHeader title={'Hello! ' + userDetails.name} navigation={navigation} isOrgHeader={false} />
                : <View style={{ height: 56 }} />
            }

            <View style={styles.slideshowContainer}>
                <Text style={styles.headingText}>Are You Looking for Blood?</Text>
                <Slideshow />
            </View>

            <View style={{ alignItems: 'center', width: '100%', paddingHorizontal: 12, flex: 1 }}>
                <View style={styles.boxRow}>
                    {HomeBoxData.map((item, i) => (
                        <HomeBox key={i} icon={item.icon} title={item.title} route={item.route} />
                    ))}
                </View>

                <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>

                    {/* AI Health Assistant Banner */}
                    <TouchableOpacity
                        style={styles.aiCard}
                        onPress={() => navigation.navigate('HealthChatbot')}
                        activeOpacity={0.85}
                    >
                        <View style={styles.aiIconWrapper}>
                            <FontAwesomeIcon icon={faRobot} size={22} color="white" />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.aiCardTitle}>AI Health Assistant</Text>
                            <Text style={styles.aiCardSubtitle}>Ask about eligibility, prep tips & more</Text>
                        </View>
                        <FontAwesomeIcon icon={faArrowRight} size={14} color="white" />
                    </TouchableOpacity>

                    <View style={styles.bloodStatsContainer}>
                        <View style={styles.bloodStatsHeader}>
                            <Text style={{ color: '#353535', fontSize: 14 }}>Blood Groups</Text>
                            <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                                <FontAwesomeIcon icon={faLocationDot} size={12} color="#969696" />
                                <Text style={{ color: '#969696', fontSize: 12 }}>Karachi</Text>
                            </View>
                        </View>
                        <View style={styles.bloodStatsRow}>
                            {BLOOD_GROUPS.map(grp => (
                                <BloodStatDrop key={grp} blood_grp={grp} icon={blood_drop} />
                            ))}
                        </View>
                    </View>

                    <View style={styles.donationReqsContainer}>
                        <View style={styles.sectionHeader}>
                            <Text style={{ color: '#353535', fontSize: 17 }}>Donation Requests</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('ReceiversList')}>
                                <Text style={{ color: '#969696', fontSize: 12 }}>See all</Text>
                            </TouchableOpacity>
                        </View>

                        {loadingRequests ? (
                            <ActivityIndicator color="#DE0A1E" style={{ marginTop: 20 }} />
                        ) : requests.length === 0 ? (
                            <View style={styles.emptyState}>
                                <FontAwesomeIcon icon={faDroplet} size={36} color="#B6B6B6" />
                                <Text style={styles.emptyText}>No donation requests at the moment.</Text>
                                <Text style={styles.emptySubText}>Check back later or post your own request.</Text>
                            </View>
                        ) : (
                            requests.map(item => <RequestBox key={item.id} data={item} />)
                        )}

                        <View style={{ height: 60 }} />
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    headingText: {
        color: 'black',
        fontSize: 16,
        paddingHorizontal: 12,
        marginBottom: 4,
    },
    slideshowContainer: {
        marginTop: 6,
        width: '100%',
        height: 210,
    },
    boxRow: {
        marginTop: 10,
        flexDirection: 'row',
        width: '100%',
        gap: 10,
    },
    homeBox: {
        height: 120,
        flex: 1,
        borderColor: '#B6B6B6',
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 10,
    },
    homeBoxLabel: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        paddingHorizontal: 4,
        width: '100%',
    },
    aiCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DE0A1E',
        borderRadius: 12,
        padding: 14,
        marginTop: 12,
        marginBottom: 2,
    },
    aiIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    aiCardTitle: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
    },
    aiCardSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginTop: 2,
    },
    bloodStatsContainer: {
        marginTop: 12,
        borderColor: '#B6B6B6',
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    bloodStatsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 6,
        marginBottom: 6,
    },
    bloodStatsRow: {
        flexDirection: 'row',
        gap: 4,
    },
    donationReqsContainer: {
        width: '100%',
        marginTop: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        alignItems: 'center',
        marginBottom: 10,
    },
    requestBox: {
        borderRadius: 10,
        borderColor: '#B6B6B6',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
    },
    divider: {
        marginVertical: 6,
        height: 1,
        backgroundColor: '#B6B6B6',
    },
    verticalDivider: {
        height: '100%',
        width: 1,
        backgroundColor: '#B6B6B6',
    },
    requestActionBtn: {
        alignItems: 'center',
        paddingVertical: 6,
        width: '48%',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
        gap: 8,
    },
    emptyText: {
        color: '#353535',
        fontSize: 15,
        marginTop: 8,
    },
    emptySubText: {
        color: '#969696',
        fontSize: 13,
        textAlign: 'center',
    },
});

export default HomeScreen;
