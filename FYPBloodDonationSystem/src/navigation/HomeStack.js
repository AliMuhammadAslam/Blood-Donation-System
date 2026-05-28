import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import PrivateReceiversRequestList from '../screens/privateRequests';
import DonationRequestInfoPage from '../screens/DonationRequestInfoPage';
import CreateAppointment from '../screens/createAppointment';
import MyOrganizations from '../screens/MyOrganizations';
import MyNotifications from '../screens/MyNotifications';
import EmergencyDonors from '../screens/EmergencyDonors';
import DonorMatches from '../screens/DonorMatches';
import HealthChatbot from '../screens/AI/HealthChatbot';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                animationEnabled: true,
            }}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Notifications" component={MyNotifications} />
            <Stack.Screen name="ReceiversList" component={PrivateReceiversRequestList} />
            <Stack.Screen name="DonationRequestInfo" component={DonationRequestInfoPage} />
            <Stack.Screen name="Create Appointment" component={CreateAppointment} />
            <Stack.Screen name="My Organizations" component={MyOrganizations} />
            <Stack.Screen name="EmergencyDonors" component={EmergencyDonors} />
            <Stack.Screen name="DonorMatches" component={DonorMatches} />
            <Stack.Screen name="HealthChatbot" component={HealthChatbot} />
        </Stack.Navigator>
    );
};

export default HomeStack;
