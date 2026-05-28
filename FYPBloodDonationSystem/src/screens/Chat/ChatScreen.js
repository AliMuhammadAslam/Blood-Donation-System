import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Bubble, GiftedChat, Send, InputToolbar } from 'react-native-gifted-chat';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowDown, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';

const ChatScreen = ({ route }) => {
  const { name, id } = route.params;

  const [messages, setMessages] = useState([]);
  const user = firebase.auth().currentUser;
  const navigation = useNavigation();

  const getChatId = () => id > user.uid ? user.uid + '-' + id : id + '-' + user.uid;

  const getAllMessages = async () => {
    try {
      const msgResponse = await firestore()
        .collection('Chats')
        .doc(getChatId())
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .get();

      const allTheMsgs = msgResponse.docs.map(snap => ({
        ...snap.data(),
        createdAt: snap.data().createdAt.toDate(),
      }));
      setMessages(allTheMsgs);
    } catch (error) {
      Alert.alert('Error', 'Could not load messages. Please try again.');
    }
  };

  useEffect(() => {
    getAllMessages();
  }, []);

  const onSend = (msgArray) => {
    const msg = msgArray[0];
    const userMsg = {
      ...msg,
      sentBy: user.uid,
      sentTo: id,
      createdAt: new Date(),
    };

    setMessages(prev => GiftedChat.append(prev, userMsg));

    const chatId = getChatId();

    firestore().collection('Chats').doc(chatId).collection('messages').add(userMsg);

    firestore().collection('users').doc(id).set(
      { chats: firestore.FieldValue.arrayUnion(auth().currentUser.uid) },
      { merge: true }
    );

    firestore().collection('users').doc(auth().currentUser.uid).set(
      { chats: firestore.FieldValue.arrayUnion(id) },
      { merge: true }
    );
  };

  const renderSend = (props) => (
    <Send style={{ color: '#000' }} {...props}>
      <View style={{ marginBottom: 15, marginRight: 20 }}>
        <FontAwesomeIcon icon={faPaperPlane} size={20} color="#DE0A1E" />
      </View>
    </Send>
  );

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: '#DE0A1E' },
        left: { backgroundColor: '#eaeaea', marginLeft: -40 },
      }}
      textProps={{
        style: { color: props.position === 'left' ? '#000' : '#fff' },
      }}
      textStyle={{
        right: { color: '#000000' },
        left: { color: '#ffffff' },
      }}
    />
  );

  const scrollToBottomComponent = () => (
    <FontAwesomeIcon icon={faArrowDown} size={22} color="#333" />
  );

  const renderInputToolbar = (props) => (
    <InputToolbar {...props} textInputStyle={{ color: '#000000' }} />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title={name} isRed={true} navigation={navigation} />
      <GiftedChat
        messages={messages}
        onSend={text => onSend(text)}
        user={{ _id: user.uid }}
        renderBubble={renderBubble}
        alwaysShowSend
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
        renderInputToolbar={renderInputToolbar}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatScreen;
