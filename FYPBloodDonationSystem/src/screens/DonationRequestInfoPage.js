import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MoreOrLess } from '@rntext/more-or-less';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMessage, faArrowLeft, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import MapView, { Marker } from 'react-native-maps';

const DonationRequestInfoPage = ({ route, navigation }) => {
    const { docId } = route.params;

    const blood_drop = require('../../assets/blood_drop.jpg');
    const star = require('../../assets/star_icon.png');

    const [request, setRequest] = useState(null);
    const [userDetails, setDetails] = useState(null);
    const [reqID, setReqId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        firestore().collection('requests').doc(docId).get()
            .then(doc => {
                if (doc.exists) {
                    setReqId(doc.id);
                    setRequest(doc.data());
                    return firestore().collection('users').doc(doc.data().uid).get();
                }
            })
            .then(userDoc => {
                if (userDoc?.exists) setDetails(userDoc.data());
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [docId]);

    return (
        <View style={styles.container}>
            <MapView
                style={StyleSheet.absoluteFillObject}
                region={{
                    latitude: 24.891975,
                    longitude: 67.072861,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker coordinate={{ latitude: 24.891975, longitude: 67.072861 }} />
            </MapView>

            {/* back button floated safely over the map */}
            <SafeAreaView style={styles.backButtonWrapper} pointerEvents="box-none">
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <FontAwesomeIcon icon={faArrowLeft} size={20} color="black" />
                </TouchableOpacity>
            </SafeAreaView>

            <View style={styles.infoContainer}>
                {loading ? (
                    <View style={styles.centered}>
                        <ActivityIndicator color="#DE0A1E" />
                    </View>
                ) : !request || !userDetails ? (
                    <View style={styles.centered}>
                        <Text style={{ color: '#969696' }}>Could not load request details.</Text>
                    </View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.profileRow}>
                            <Image
                                style={styles.avatar}
                                source={{ uri: userDetails.image }}
                            />
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.userName}>{request.userName}</Text>
                                <Text style={styles.addressText} numberOfLines={2}>{userDetails.address}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                                    <Image style={{ width: 14, height: 14 }} source={star} />
                                    <Text style={{ color: '#969696', fontSize: 12 }}>4.5 / 5 Ratings</Text>
                                </View>
                            </View>
                            <ImageBackground
                                style={styles.bloodDropBg}
                                source={blood_drop}
                            >
                                <Text style={styles.bloodTypeText}>{request.bloodType}</Text>
                            </ImageBackground>
                        </View>

                        <View style={styles.detailsSection}>
                            <View style={styles.detailsHeader}>
                                <Text style={styles.sectionTitle}>Donation Details</Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('ChatScreen', {
                                        name: request.userName,
                                        id: request.uid,
                                    })}
                                >
                                    <FontAwesomeIcon icon={faMessage} size={22} color="#DE0A1E" />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.hospitalText}>{request.hospitalName}</Text>

                            <View style={styles.infoRow}>
                                <Text style={styles.labelText}>Expiry Date: </Text>
                                <Text style={styles.valueText}>
                                    {request.expiryDate?.toDate?.()?.toLocaleDateString?.() ?? '—'}
                                </Text>
                            </View>

                            {request.notes ? (
                                <MoreOrLess
                                    numberOfLines={3}
                                    textButtonStyle={{ color: '#DE0A1E' }}
                                    animated
                                    textStyle={{ color: '#353535', marginTop: 6, lineHeight: 20 }}
                                >
                                    {request.notes}
                                </MoreOrLess>
                            ) : null}
                        </View>

                        <TouchableOpacity
                            style={styles.findDonorsButton}
                            onPress={() => navigation.navigate('DonorMatches', { bloodType: request.bloodType })}
                        >
                            <FontAwesomeIcon icon={faMagnifyingGlass} size={16} color="#DE0A1E" />
                            <Text style={styles.findDonorsButtonText}>Find Compatible Donors</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.appointmentButton}
                            onPress={() => navigation.navigate('Create Appointment', {
                                reqId: reqID,
                                receiverName: request.userName,
                                receiverId: request.uid,
                                hospital: request.hospitalName,
                                bloodType: request.bloodType,
                                maxDateLimit: request.expiryDate.toDate().toISOString(),
                            })}
                        >
                            <Text style={styles.appointmentButtonText}>Create An Appointment</Text>
                        </TouchableOpacity>

                        <View style={{ height: 80 }} />
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButtonWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    backButton: {
        margin: 16,
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    infoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        height: '48%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    userName: {
        color: '#353535',
        fontSize: 18,
        fontWeight: '600',
    },
    addressText: {
        color: '#969696',
        fontSize: 13,
        marginTop: 2,
    },
    bloodDropBg: {
        width: 38,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bloodTypeText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 12,
    },
    detailsSection: {
        marginTop: 4,
    },
    detailsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    sectionTitle: {
        color: 'black',
        fontSize: 17,
        fontWeight: '600',
    },
    hospitalText: {
        color: '#353535',
        fontSize: 15,
        marginBottom: 4,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    labelText: {
        color: '#353535',
        fontSize: 14,
    },
    valueText: {
        color: '#969696',
        fontSize: 14,
    },
    findDonorsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 14,
        borderWidth: 1.5,
        borderColor: '#DE0A1E',
        borderRadius: 10,
        paddingVertical: 11,
    },
    findDonorsButtonText: {
        fontSize: 16,
        color: '#DE0A1E',
        fontWeight: '500',
    },
    appointmentButton: {
        backgroundColor: '#DE0A1E',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        paddingVertical: 12,
    },
    appointmentButtonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
    },
});

export default DonationRequestInfoPage;
