import React, { useState, useRef } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, FlatList,
    StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPaperPlane, faRobot } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import { OPENAI_API_KEY, OPENAI_MODEL } from '../../config/aiConfig';

const SYSTEM_PROMPT = `You are a Blood Donation Health Assistant for Blood Connect, a blood donation platform in Pakistan.
Your role is to help users understand blood donation eligibility, preparation, and aftercare.

Key knowledge:
- General eligibility: age 18–65, weight above 50 kg, no recent illness or fever
- Cannot donate if: tattoo or piercing within 6 months, recent surgery, pregnancy or breastfeeding, certain chronic conditions (HIV, Hepatitis B/C, active cancer), certain medications
- Whole blood can be donated every 90 days (3 months)
- Platelets can be donated every 2 weeks
- Pre-donation tips: eat iron-rich foods (spinach, meat, beans), stay well hydrated, sleep well the night before
- Post-donation tips: rest for 10–15 minutes after donation, drink extra fluids, avoid heavy lifting or strenuous activity for 24 hours, eat a snack
- Blood type facts: O- is the universal donor (can give to anyone), AB+ is the universal recipient (can receive from anyone)
- Pakistan-specific: Thalassemia patients need frequent transfusions and are always in need of blood

Always be friendly, concise, and supportive. Recommend consulting a doctor or visiting a blood bank for specific medical decisions. Keep responses under 120 words.`;

const WELCOME_MESSAGE = {
    id: 'welcome',
    role: 'assistant',
    text: "Hello! I'm your Blood Donation Health Assistant. Ask me anything about eligibility, preparation, recovery, or blood type compatibility.",
};

const HealthChatbot = () => {
    const navigation = useNavigation();
    const flatListRef = useRef(null);

    const [messages, setMessages] = useState([WELCOME_MESSAGE]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        const userText = input.trim();
        if (!userText || loading) return;

        const userMsg = { id: `u_${Date.now()}`, role: 'user', text: userText };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

        try {
            const apiMessages = [
                { role: 'system', content: SYSTEM_PROMPT },
                ...updatedMessages
                    .filter(m => m.id !== 'welcome')
                    .map(m => ({ role: m.role, content: m.text })),
            ];

            const res = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: OPENAI_MODEL,
                    messages: apiMessages,
                    max_tokens: 250,
                    temperature: 0.6,
                }),
            });

            const data = await res.json();
            const replyText = data.choices?.[0]?.message?.content?.trim();

            setMessages(prev => [
                ...prev,
                {
                    id: `a_${Date.now()}`,
                    role: 'assistant',
                    text: replyText || "I couldn't get a response. Please try again.",
                },
            ]);
        } catch {
            setMessages(prev => [
                ...prev,
                {
                    id: `a_${Date.now()}`,
                    role: 'assistant',
                    text: 'Connection error. Please check your internet and try again.',
                },
            ]);
        } finally {
            setLoading(false);
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 150);
        }
    };

    const renderMessage = ({ item }) => {
        const isUser = item.role === 'user';
        return (
            <View style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}>
                {!isUser && (
                    <View style={styles.botAvatar}>
                        <FontAwesomeIcon icon={faRobot} size={14} color="white" />
                    </View>
                )}
                <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
                    <Text style={[styles.bubbleText, isUser ? styles.textUser : styles.textAssistant]}>
                        {item.text}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Health Assistant" isRed={true} navigation={navigation} />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />

                {loading && (
                    <View style={styles.typing}>
                        <ActivityIndicator size="small" color="#DE0A1E" />
                        <Text style={styles.typingText}>Typing...</Text>
                    </View>
                )}

                <View style={styles.inputBar}>
                    <TextInput
                        style={styles.input}
                        value={input}
                        onChangeText={setInput}
                        placeholder="Ask about blood donation..."
                        placeholderTextColor="#999"
                        multiline
                        maxLength={300}
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, (!input.trim() || loading) && { opacity: 0.4 }]}
                        onPress={sendMessage}
                        disabled={!input.trim() || loading}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} size={17} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    list: {
        padding: 16,
        paddingBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 12,
    },
    rowUser: {
        justifyContent: 'flex-end',
    },
    rowAssistant: {
        justifyContent: 'flex-start',
    },
    botAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#DE0A1E',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        marginBottom: 2,
    },
    bubble: {
        maxWidth: '75%',
        borderRadius: 18,
        padding: 12,
    },
    bubbleUser: {
        backgroundColor: '#DE0A1E',
        borderBottomRightRadius: 4,
    },
    bubbleAssistant: {
        backgroundColor: 'white',
        borderBottomLeftRadius: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
    },
    bubbleText: {
        fontSize: 15,
        lineHeight: 22,
    },
    textUser: {
        color: 'white',
    },
    textAssistant: {
        color: '#353535',
    },
    typing: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 6,
        gap: 8,
    },
    typingText: {
        color: '#969696',
        fontSize: 13,
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 10,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        gap: 8,
    },
    input: {
        flex: 1,
        minHeight: 44,
        maxHeight: 100,
        borderWidth: 1,
        borderColor: '#C8C8C8',
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        color: 'black',
        backgroundColor: '#F9F9F9',
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#DE0A1E',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default HealthChatbot;
