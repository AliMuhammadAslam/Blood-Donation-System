import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountScreen from '../screens/Account/AccountScreen';
import ManageAddresses from '../screens/Account/Manage_Addresses';
import History from '../screens/Account/History';
import OrganizationsList from '../screens/organizations_list';
import OrganisationInfo from '../screens/OrganisationInfo/OrganisationInfo';
import ApplicationForm from '../screens/Forms/ApplicationForm';
import EditProfile from '../screens/Account/EditProfile';

const Stack = createNativeStackNavigator();


const AccountStack = () => {
    return (
        <Stack.Navigator initialRouteName="AccountScreen"
            screenOptions={{
                headerShown: false,
                animationEnabled: true,
            }}>
                <Stack.Screen name="AccountScreen" component={AccountScreen} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
                <Stack.Screen name="History" component={History} />
                <Stack.Screen name="ManageAddresses" component={ManageAddresses} />
                <Stack.Screen name="OrganizationsList" component={OrganizationsList} />
                <Stack.Screen name="OrganizationInfo" component={OrganisationInfo} />
                <Stack.Screen name="ApplicationForm" component={ApplicationForm} />
                
        </Stack.Navigator>
    );
}

export default AccountStack;