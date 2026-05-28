import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faStar, faCalendarCheck, faArrowRight, faDroplet,
    faStarOfLife, faHandHoldingHeart, faArrowRotateLeft,
    faRightFromBracket, faHospital, faUserEdit, faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import {
    SafeAreaView, View, Text, Image, StyleSheet,
    TouchableOpacity, Switch, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const MENU_ITEMS = [
    { icon: faUserEdit,         label: 'Edit Profile',                  route: 'EditProfile',       params: undefined },
    { icon: faLocationDot,      label: 'Manage Addresses',              route: 'ManageAddresses',   params: undefined },
    { icon: faHandHoldingHeart, label: 'View Donation History',         route: 'History',           params: { title: 'Donation History' } },
    { icon: faArrowRotateLeft,  label: 'View Receiving History',        route: 'History',           params: { title: 'Recieving History' } },
    { icon: faHospital,         label: 'Register With An Organisation', route: 'OrganizationsList', params: undefined },
];

const AccountScreen = ({ navigation }) => {
    const [userDetails, setUserDetails] = useState(null);
    const [isEnabled, setIsEnabled] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const uid = auth().currentUser?.uid;
        if (!uid) return;

        firestore().collection('users').doc(uid).get()
            .then(doc => {
                if (doc.exists) {
                    setUserDetails(doc.data());
                    setIsEnabled(doc.data().availableToDonate ?? true);
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const userLogout = async () => {
        try {
            await auth().signOut();
            navigation.navigate('Authentication');
        } catch (error) {
            Alert.alert('Logout failed', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator color="white" size="large" />
                </View>
            ) : !userDetails ? (
                <View style={styles.centered}>
                    <Text style={{ color: 'white' }}>Could not load profile.</Text>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Red header section */}
                    <View style={styles.profileContainer}>
                        <Image source={{ uri: userDetails.image }} style={styles.avatar} />
                        <Text style={styles.name}>{userDetails.name}</Text>
                        <Text style={styles.subtitle}>{userDetails.mobileNumber}</Text>
                        <View style={styles.starContainer}>
                            {[1, 2, 3, 4].map(i => (
                                <FontAwesomeIcon key={i} icon={faStar} size={15} color="#ffcc00" />
                            ))}
                            <FontAwesomeIcon icon={faStar} size={15} color="#c7c7c7" />
                        </View>
                    </View>

                    {/* Stats card — negative marginTop pulls it up to straddle the red/white boundary */}
                    <View style={styles.overlay}>
                        <View style={styles.overlayRow}>
                            <View style={styles.statItem}>
                                <FontAwesomeIcon icon={faDroplet} size={20} color="#DE0A1E" />
                                <Text style={styles.statLabel}>Vital Impact</Text>
                            </View>
                            <View style={styles.statItem}>
                                <FontAwesomeIcon icon={faStarOfLife} size={20} color="#DE0A1E" />
                                <Text style={styles.statLabel}>5 Lives Saved</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>13 March</Text>
                                <Text style={styles.statLabel}>Next Donation</Text>
                            </View>
                        </View>
                    </View>

                    {/* White settings section */}
                    <View style={styles.settingsContainer}>
                        <View style={styles.rowContainer}>
                            <View style={styles.rowLeft}>
                                <View style={styles.iconContainer}>
                                    <FontAwesomeIcon icon={faCalendarCheck} size={20} color="#DE0A1E" />
                                </View>
                                <Text style={styles.rowText}>Available to Donate</Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#767577', true: '#DE0A1E' }}
                                thumbColor="white"
                                onValueChange={() => {
                                    const next = !isEnabled;
                                    setIsEnabled(next);
                                    const uid = auth().currentUser?.uid;
                                    if (uid) firestore().collection('users').doc(uid).update({ availableToDonate: next }).catch(() => {});
                                }}
                                value={isEnabled}
                            />
                        </View>

                        {MENU_ITEMS.map(item => (
                            <TouchableOpacity
                                key={item.label}
                                onPress={() => navigation.navigate(item.route, item.params)}
                            >
                                <View style={styles.rowContainer}>
                                    <View style={styles.rowLeft}>
                                        <View style={styles.iconContainer}>
                                            <FontAwesomeIcon icon={item.icon} size={20} color="#DE0A1E" />
                                        </View>
                                        <Text style={styles.rowText}>{item.label}</Text>
                                    </View>
                                    <FontAwesomeIcon icon={faArrowRight} size={20} color="black" />
                                </View>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity onPress={userLogout}>
                            <View style={styles.rowContainer}>
                                <View style={styles.rowLeft}>
                                    <View style={styles.iconContainer}>
                                        <FontAwesomeIcon icon={faRightFromBracket} size={20} color="#DE0A1E" />
                                    </View>
                                    <Text style={styles.rowText}>Log Out</Text>
                                </View>
                                <FontAwesomeIcon icon={faArrowRight} size={20} color="black" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DE0A1E',
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileContainer: {
        paddingTop: 40,
        paddingBottom: 50,
        alignItems: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 10,
    },
    subtitle: {
        fontSize: 16,
        color: 'white',
        marginTop: 4,
    },
    starContainer: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 4,
    },
    overlay: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginHorizontal: 30,
        height: 70,
        marginTop: -35,
        zIndex: 2,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    overlayRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingHorizontal: 10,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        color: 'black',
        fontSize: 12,
        marginTop: 4,
    },
    statValue: {
        color: '#DE0A1E',
        fontWeight: 'bold',
        fontSize: 15,
    },
    settingsContainer: {
        backgroundColor: 'white',
        paddingTop: 45,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 5,
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        marginRight: 10,
    },
    rowText: {
        fontSize: 16,
        color: 'black',
    },
});

export default AccountScreen;
