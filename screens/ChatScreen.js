import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import {
  setDoc,
  doc,
  getDoc,
  onSnapshot,
  arrayUnion,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { GiftedChat } from 'react-native-gifted-chat';
import { getUserImageUrl } from '../utils/getUserImageUrl';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ChatScreen = ({ route }) => {
  const { otherUserId } = route.params;
  const myId = auth.currentUser.uid;
  const chatRoomId = [otherUserId, myId].sort().join('');
  const [me, setMe] = useState(null);
  const [messages, setMessages] = useState([]);
  const [laoding, setLoading] = useState(true);

  useEffect(() => {
    getDoc(doc(db, 'users', myId))
      .then((doc) => {
        const { Name } = doc.data();
        getUserImageUrl()
          .then((url) => {
            setMe({
              name: Name.First,
              avatar: url,
              _id: myId,
            });
          })
          .catch((error) => {
            console.log('can not fetch user profile', error);
            setMe({
              name: Name.First,
              _id: myId,
            });
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const chatRef = doc(db, 'chats', chatRoomId);
    const unsub = onSnapshot(chatRef, (docData) => {
      const data = docData.data();
      const allMassges = data
        ? data.messages
            .map((msg) => ({
              ...msg,
              createdAt: new Date(msg.createdAt.seconds * 1000),
            }))
            .reverse()
        : [];
      setMessages(allMassges);
    });

    return () => unsub();
  }, []);

  const onSend = useCallback((messages = []) => {
    const chatRef = doc(db, 'chats', chatRoomId);
    setDoc(
      chatRef,
      {
        messages: arrayUnion(messages[0]),
      },
      { merge: true }
    ).catch((e) => {
      console.log(e);
    });
  }, []);
  return !laoding ? (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={true}
      onSend={(messages) => onSend(messages)}
      user={me}
      renderChatEmpty={() => (
        <View style={styles.loading}>
          <MaterialCommunityIcons
            name='message-bulleted-off'
            size={50}
            color='grey'
          />
        </View>
      )}
    />
  ) : (
    <View style={styles.loading}>
      <ActivityIndicator size='large' color='green' />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    transform: [{ rotate: '180deg' }, { rotateY: '180deg' }],
  },
});
