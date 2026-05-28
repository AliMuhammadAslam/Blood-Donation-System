import React, { useState } from 'react';
import { Alert, BackHandler, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';

function Signup_first() {
  const navigation = useNavigation();

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
        { text: 'Cancel', onPress: () => null, style: 'cancel' },
        { text: 'YES', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const [genderOpen, setGenderOpen] = useState(false);
  const [genderValue, setGenderValue] = useState(null);
  const [genderItems, setGenderItems] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ]);

  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [emergencyDonorValue, setEmergencyDonorValue] = useState(null);
  const [emergencyItems, setEmergencyItems] = useState([
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ]);

  const [bloodOpen, setBloodOpen] = useState(false);
  const [bloodValue, setBloodValue] = useState(null);
  const [bloodItems, setBloodItems] = useState([
    { label: 'A+', value: 'a+' },
    { label: 'O+', value: 'o+' },
    { label: 'B+', value: 'b+' },
    { label: 'AB+', value: 'ab+' },
    { label: 'A-', value: 'a-' },
    { label: 'O-', value: 'o-' },
    { label: 'B-', value: 'b-' },
    { label: 'AB-', value: 'ab-' },
  ]);

  const [email, onChangeEmail] = useState('');
  const [mobileNumber, onChangeMobNum] = useState('');
  const [address, onChangeAddress] = useState('');
  const [name, onChangeName] = useState('');

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const isValidPhone = (val) => /^[0-9+\s\-]{10,15}$/.test(val.trim());

  const handleProceed = () => {
    if (!name.trim() || !email.trim() || !mobileNumber.trim() || !address.trim() || !genderValue || !bloodValue || !emergencyDonorValue) {
      Alert.alert('Missing Information', 'Please fill in all fields before proceeding.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!isValidPhone(mobileNumber)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid mobile number (10–15 digits).');
      return;
    }

    navigation.navigate('SignupSecond', {
      name: name.trim(),
      address: address.trim(),
      mobileNumber: mobileNumber.trim(),
      genderValue,
      bloodValue,
      isEmergencyDonor: emergencyDonorValue,
      email: email.trim(),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Signup</Text>

      <TextInput
        style={styles.input}
        onChangeText={onChangeName}
        value={name}
        placeholder="Full Name"
        placeholderTextColor="#808080"
      />

      <TextInput
        style={styles.input}
        onChangeText={onChangeEmail}
        value={email}
        placeholder="Email Address"
        inputMode="email"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#808080"
      />

      <View style={styles.dropdown}>
        <DropDownPicker
          placeholder="Gender"
          open={genderOpen}
          value={genderValue}
          items={genderItems}
          setOpen={setGenderOpen}
          setValue={setGenderValue}
          setItems={setGenderItems}
          theme="LIGHT"
        />
      </View>

      <TextInput
        style={styles.input}
        onChangeText={onChangeMobNum}
        value={mobileNumber}
        placeholder="Mobile Number"
        inputMode="numeric"
        keyboardType="numeric"
        placeholderTextColor="#808080"
      />

      <TextInput
        style={styles.input}
        onChangeText={onChangeAddress}
        value={address}
        placeholder="Address"
        placeholderTextColor="#808080"
      />

      <View style={styles.dropdown}>
        <DropDownPicker
          placeholder="Blood Group"
          open={bloodOpen}
          value={bloodValue}
          items={bloodItems}
          setOpen={setBloodOpen}
          setValue={setBloodValue}
          setItems={setBloodItems}
          theme="LIGHT"
          dropDownDirection="TOP"
          listMode="MODAL"
          searchable={true}
          scrollViewProps={true}
        />
      </View>

      <View style={{ padding: 8 }} />

      <View style={styles.dropdown}>
        <DropDownPicker
          placeholder="Do you want to be registered as an Emergency Donor?"
          open={emergencyOpen}
          value={emergencyDonorValue}
          items={emergencyItems}
          setOpen={setEmergencyOpen}
          setValue={setEmergencyDonorValue}
          setItems={setEmergencyItems}
          theme="LIGHT"
        />
      </View>

      <View style={{ padding: 4 }} />

      <TouchableOpacity style={styles.button} onPress={handleProceed}>
        <Text style={styles.btnText}>Proceed</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={{ color: '#353535' }}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{ color: '#DE0A1E' }}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  input: {
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    color: 'black',
    backgroundColor: 'white',
  },
  header: {
    fontSize: 30,
    marginBottom: 30,
    color: 'black',
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 300,
    height: 40,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    backgroundColor: '#DE0A1E',
    borderRadius: 10,
  },
  btnText: {
    fontSize: 18,
    color: 'white',
  },
  dropdown: {
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    zIndex: 999,
    borderRadius: 8,
  },
});

export default Signup_first;
