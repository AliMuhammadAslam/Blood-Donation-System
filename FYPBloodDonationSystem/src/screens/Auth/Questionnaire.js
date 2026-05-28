import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const QUESTIONS = [
    { key: 'hasDiabetes',       text: 'Do you have Diabetes?' },
    { key: 'hasHeartLungIssue', text: 'Have you ever had problems with your heart or lungs?' },
    { key: 'hadCovid30Days',    text: 'Have you had COVID-19 in the last 30 days?' },
    { key: 'hasHIV',            text: 'Have you ever had a positive test for the HIV / AIDS virus?' },
    { key: 'hasCancer',         text: 'Have you ever had cancer?' },
    { key: 'hadVaccine3Months', text: 'In the last 3 months have you had a vaccination?' },
];

// a "Yes" answer to any of these means the person cannot donate
const DISQUALIFYING_KEYS = ['hasDiabetes', 'hasHeartLungIssue', 'hadCovid30Days', 'hasHIV', 'hasCancer'];

const RadioButton = ({ text, value, onChange }) => {
    return (
        <View style={styles.radioContainer}>
            <Text style={styles.questionText}>{text}</Text>
            <View style={{ flexDirection: 'row' }}>
                {['Yes', 'No'].map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={styles.radioButton}
                        onPress={() => onChange(option)}
                    >
                        <View style={styles.radioOuter}>
                            {value === option && <View style={styles.radioInner} />}
                        </View>
                        <Text style={styles.radioButtonText}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const Questionnaire = () => {
    const navigation = useNavigation();

    const [answers, setAnswers] = useState({
        hasDiabetes: null,
        hasHeartLungIssue: null,
        hadCovid30Days: null,
        hasHIV: null,
        hasCancer: null,
        hadVaccine3Months: null,
    });
    const [loading, setLoading] = useState(false);

    const handleAnswer = (key, value) => {
        setAnswers(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        const unanswered = QUESTIONS.filter(q => answers[q.key] === null);
        if (unanswered.length > 0) {
            Alert.alert('Incomplete', 'Please answer all questions before submitting.');
            return;
        }

        const isEligible = !DISQUALIFYING_KEYS.some(key => answers[key] === 'Yes');

        setLoading(true);
        try {
            const uid = auth().currentUser.uid;
            await firestore().collection('users').doc(uid).update({
                questionnaire: answers,
                isEligibleToDonate: isEligible,
                questionnaireCompletedAt: firestore.FieldValue.serverTimestamp(),
            });

            if (isEligible) {
                Alert.alert(
                    'You\'re Eligible!',
                    'Based on your answers you are eligible to donate blood. Thank you!',
                    [{ text: 'Continue', onPress: () => navigation.navigate('TabNavigation') }]
                );
            } else {
                Alert.alert(
                    'Not Eligible',
                    'Based on your answers you are currently not eligible to donate blood. You can still use the app to request blood.',
                    [{ text: 'Continue', onPress: () => navigation.navigate('TabNavigation') }]
                );
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to save your answers. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <FontAwesomeIcon icon={faArrowLeft} size={20} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Questionnaire</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.intro}>
                    Please fill in the following questionnaire to determine your blood donation eligibility.
                </Text>

                {QUESTIONS.map((q) => (
                    <RadioButton
                        key={q.key}
                        text={q.text}
                        value={answers[q.key]}
                        onChange={(val) => handleAnswer(q.key, val)}
                    />
                ))}

                <TouchableOpacity
                    style={[styles.submitButton, loading && { opacity: 0.6 }]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator color="white" />
                        : <Text style={styles.submitText}>Submit</Text>
                    }
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DE0A1E',
        height: 60,
        paddingHorizontal: 10,
    },
    backButton: {
        marginLeft: 10,
    },
    headerTitle: {
        fontSize: 18,
        flex: 1,
        textAlign: 'center',
        color: '#FFF',
        fontWeight: 'bold',
    },
    scrollContent: {
        flexDirection: 'column',
        margin: 15,
        paddingBottom: 30,
    },
    intro: {
        fontWeight: 'bold',
        paddingBottom: 15,
        color: 'black',
    },
    radioContainer: {
        flexDirection: 'column',
        borderRadius: 10,
        borderColor: '#808080',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
    },
    questionText: {
        fontWeight: '400',
        color: 'black',
        marginBottom: 4,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
        marginRight: 16,
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'black',
    },
    radioButtonText: {
        fontSize: 15,
        fontWeight: '500',
        marginLeft: 8,
    },
    submitButton: {
        height: 45,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DE0A1E',
        borderRadius: 10,
    },
    submitText: {
        fontSize: 17,
        color: 'white',
        fontWeight: '500',
    },
});

export default Questionnaire;
