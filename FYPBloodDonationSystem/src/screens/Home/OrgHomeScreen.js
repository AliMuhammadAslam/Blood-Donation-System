import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeHeader from '../../components/HomeHeader';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationDot, faDroplet } from '@fortawesome/free-solid-svg-icons';
import Slideshow from '../../components/slideshow';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { BarChart, PieChart } from "react-native-chart-kit";


const OrgHomeScreen = ({ navigation }) => {

    const [userDetails, setDetails] = useState();
    const RequestData = [
        { Name: 'Zulfiqar Khan', Address: 'DHA Phase 4, karachi', Blood_grp: 'O-' },
        { Name: 'Zulfiqar Khan', Address: 'House no 1, Street no 10, Landhi, karachi', Blood_grp: 'A-' },
        { Name: 'Zulfiqar Khan', Address: 'Street 2, SMCHS, karachi', Blood_grp: 'B-' },
        { Name: 'Zulfiqar Khan', Address: 'Clifton, karachi', Blood_grp: 'A+' },
        { Name: 'Zulfiqar Khan', Address: 'Pechs Block 6, karachi', Blood_grp: 'O+' }
    ]
    const data = {
        labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June'],
        datasets: [{
            data: [
                50,
                20,
                2,
                86,
                71,
                100
            ],
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})` // optional
        }, {
            data: [
                20,
                10,
                4,
                56,
                87,
                90
            ]
        }, {
            data: [
                30,
                90,
                67,
                54,
                10,
                2
            ]
        }]
    }
    const pieChart1Data = [
        { name: 'Karachi', population: 21500, color: 'blue', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        { name: 'Lahore', population: 2800, color: 'green', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        { name: 'Islamabad', population: 1527, color: 'red', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        { name: 'Quetta', population: 8538, color: 'yellow', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        { name: 'Peshawar', population: 9020, color: 'orange', legendFontColor: '#7F7F7F', legendFontSize: 12 }
    ]
    const pieChart2Data = [
        { name: 'Karachi', population: 18000, color: 'blue', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        { name: 'Lahore', population: 5800, color: 'green', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        { name: 'Islamabad', population: 7527, color: 'red', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        { name: 'Quetta', population: 10538, color: 'yellow', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        { name: 'Peshawar', population: 10020, color: 'orange', legendFontColor: '#7F7F7F', legendFontSize: 12 }
    ]
    const RequestBox = ({ data }) => {
        return (
            <View style={{ borderRadius: 10, borderColor: '#B6B6B6', borderWidth: 1, padding: 10, marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={{ fontWeight: 600, fontSize: 20, color: '#353535' }}>{data.Name}</Text>
                        <Text style={{ paddingVertical: 3, color: '#969696' }}>{data.Address}</Text>
                    </View>
                    <View style={{}}>
                        <FontAwesomeIcon icon={faDroplet} size={45} color="#DE0A1E" />
                        <Text style={{ color: 'white', position: 'absolute', right: 14, marginTop: 14, fontWeight: 'bold', fontSize: 16 }}>{data.Blood_grp}</Text>
                    </View>
                </View>
                <View style={{ margin: 2, marginTop: 4, flex: 1, height: 1, backgroundColor: '#B6B6B6' }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }}>
                    <TouchableOpacity style={{ alignItems: 'center', backgroundColor: 'white', borderRadius: 10, paddingVertical: 8, width: '50%' }}>
                        <Text style={{ fontSize: 17, color: '#8C8C8C', }}>Decline</Text>
                    </TouchableOpacity>
                    <View style={{ marginTop: 10, height: '100%', width: 1, backgroundColor: '#8C8C8C' }} />
                    <TouchableOpacity onPress={() => { }} style={{ alignItems: 'center', backgroundColor: '#00000000', borderRadius: 3, paddingVertical: 8, width: '50%' }}>
                        <Text style={{ fontSize: 17, color: '#DE0A1E' }}>Accept</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    useEffect(() => {
        const uid = auth().currentUser?.uid;
        if (!uid) {
            navigation.replace('Login');
            return;
        }

        const userRef = firestore().collection('users').doc(uid);

        userRef.get().then((doc) => {
            if (doc.exists) {
                if (!doc.data().isOrg) {
                    navigation.replace('TabNavigation');
                    return;
                }
                setDetails(doc.data());
            }
        }).catch(() => {
            Alert.alert('Error', 'Could not load your profile. Please try again.');
        });

    }, []);

    return (
        <SafeAreaView style={styles.container}>
                 {userDetails?.name ? <HomeHeader title={"Hello! " + userDetails?.name} navigation={navigation} isOrgHeader={true} /> : <Text>Loading</Text>}
            <View style={styles.header}>
                <Slideshow />
            </View>
            <View style={{ alignItems: 'center', width: '100%', paddingHorizontal: 12, flex: 1 }}>
                <ScrollView style={styles.scrollView}>
                <Text style={{ color: 'black', marginTop: 10, fontSize: 18, marginBottom: 10, fontWeight: 600 }}>Donation and Recieving Statistics</Text>
                        <View style={{ alignItems: 'center', marginBottom: 20 }}>

                            <PieChart
                                data={pieChart1Data}
                                height={160}
                                width={300}
                                chartConfig={{
                                    backgroundColor: '#26872a',
                                    backgroundGradientFrom: '#43a047',
                                    backgroundGradientTo: '#66bb6a',
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${0})`,
                                    style: {
                                        borderRadius: 16
                                    }
                                }}
                                accessor="population"
                                backgroundColor={"transparent"}
                                paddingLeft={"25"}
                                style={{
                                    marginVertical: 0,
                                    borderRadius: 16,
                                }}
                            />
                            <Text style={styles.text}>Blood Donation Statistics by City</Text>
                        </View>
                        <View style={{ alignItems: 'center', marginBottom: 20 }}>

                            <BarChart
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 16,
                                }}
                                data={data}
                                width={300}
                                height={230}
                                yAxisLabel=""
                                chartConfig={{
                                    backgroundColor: '#ffffff',
                                    backgroundGradientFrom: '#ffffff',
                                    backgroundGradientTo: '#ffffff',
                                    color: (opacity = 1) => `rgba(0, 1, 0, ${1})`
                                }}
                                verticalLabelRotation={50}
                            />
                            <Text style={styles.text}>Blood Donation Statistics by City</Text>
                        </View>
                        <View style={{ alignItems: 'center', marginBottom: 30 }}>

                            <PieChart
                                data={pieChart2Data}
                                height={160}
                                width={300}
                                chartConfig={{
                                    backgroundColor: '#26872a',
                                    backgroundGradientFrom: '#43a047',
                                    backgroundGradientTo: '#66bb6a',
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${0})`,
                                    style: {
                                        borderRadius: 16
                                    }
                                }}
                                accessor="population"
                                backgroundColor={"transparent"}
                                paddingLeft={"25"}
                                style={{
                                    marginVertical: 0,
                                    borderRadius: 16,
                                }}
                            />
                            <Text style={styles.text}>Blood Recieving Statistics by City</Text>
                        </View>
                    {/* <View style={styles.donationReqsContainer}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 5, alignItems: 'center', marginBottom: 10 }}>
                            <Text style={{ color: '#353535', fontSize: 18 }}>Donation Requests</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('ReceiversList')}>
                                <Text style={{ color: '#969696', fontSize: 12 }}>See all</Text>
                            </TouchableOpacity>
                        </View>
                        {RequestData.map((data) => <RequestBox data={data} />)}
                        <View style={{ height: 55 }}></View>
                    </View> */}
                    <View style={{ height: 55 }}></View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    header: {
        marginTop: 6,
        width: '100%',
        height: 200,
    },
    scrollView: {
        width: '100%'
    },
    donationReqsContainer: {
        width: '100%',
        marginTop: 10,
    },
    text: {
        color: 'grey'
    },
});

export default OrgHomeScreen;