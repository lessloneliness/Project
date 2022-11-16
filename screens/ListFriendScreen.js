import { React, useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth, db } from '../firebase';
import { AntDesign, Entypo } from '@expo/vector-icons';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  arrayRemove,
  updateDoc,
} from 'firebase/firestore';

const ListFriendScreen = () => {
  const navigation = useNavigation(); // must if we want to use navigation
  const [list, setList] = useState([]);
  const [frindsList, setFreindsList] = useState([]);
  const user = auth.currentUser;
  //const userRef = firebase.firestore().collection('users').doc(user.uid); // get the uid.

  useEffect(() => {
    const userRef = doc(db, 'users', user.uid);
    getDoc(userRef)
      .then(function (doc) {
        if (doc.exists) {
          setList(doc.data().Friends);

          //console.log("user: " + JSON.stringify(doc.data().Name));
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!');
        }
      })
      .catch(function (error) {
        console.log('Error getting document:', error);
      });
  }, []);

  useEffect(() => {
    list.forEach((email) =>
      findIdByEmail(email).then((id) => {
        setFreindsList((prev) => [...prev, { email, id }]);
      })
    );
  }, [list]);

  const findIdByEmail = async (email) => {
    let id = '';
    const q = query(collection(db, 'users'), where('Email', '==', email));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      id = doc.id;
    });
    return id;
  };

  const RemoveFriend = async (emailFriend) => {
    const freindId = await findIdByEmail(emailFriend);

    const meRef = doc(db, 'users', user.uid);
    await updateDoc(meRef, {
      Friends: arrayRemove(emailFriend),
    });

    const friendRef = doc(db, 'users', freindId);
    await updateDoc(friendRef, {
      Friends: arrayRemove(auth.currentUser?.email), // add cuurent user (hadar) to matan array
    });

    setList((prev) => prev.filter((email) => email !== emailFriend));
  };

  return (
    <ScrollView>
      <View
        style={{
          justifyContent: 'center',
          marginTop: 30,
          alignItems: 'center',
        }}
      >
        <Text style={styles.text}>My friends</Text>
        <View style={styles.container}>
          {list.map((person, index) => {
            return (
              <View key={index + person} style={styles.container}>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    onPress={() => RemoveFriend(person)}
                    style={[styles.button3, styles.buttonOutline]}
                  >
                    <Entypo name='remove-user' size={24} color='black' />
                  </TouchableOpacity>
                  <Text style={styles.item}>{person}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('ChatScreen', {
                        otherUserId: frindsList.filter(
                          ({ email }) => person === email
                        )[0]?.id,
                      });
                    }}
                    style={[styles.button3, styles.buttonOutline]}
                  >
                    <AntDesign name='message1' size={24} color='black' />
                  </TouchableOpacity>
                </View>
                <View style={styles.divider}></View>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={() => navigation.replace('Home')}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ListFriendScreen;

const styles = StyleSheet.create({
  container: {
    padding: 4,
    marginBottom: 5,
    width: '100%',
    //backgroundColor: 'blue',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    //backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    borderTopWidth: 0.5,
    width: '30%',
    margin: 10,
  },
  item: {
    padding: 2,
    fontSize: 15,
    marginTop: 0,
    marginBottom: 5,
    width: '60%',
    textAlign: 'center',
  },
  headerText: {
    fontSize: 30,
  },
  formContainer: {
    width: '100%',
    height: '60%',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  textInput: {
    width: '75%',
    height: '15%',
    fontSize: 15,
    borderWidth: 1,
  },
  text: {
    fontSize: 23,
    color: 'green',
    fontStyle: 'italic',
    marginTop: 0,
    marginBottom: 33,
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: 'red',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  button3: {
    padding: 15,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  button2: {
    backgroundColor: 'black',
    width: '40%',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  Image: {
    width: 70,
    height: 70,
    borderRadius: 230 / 2,
    overflow: 'hidden',
    marginBottom: '1%',
    marginHorizontal: '1%',
    marginVertical: '0%',
  },
  textAreaContainer: {
    borderColor: 'gray',
    borderWidth: 0,
    padding: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.1)',
    marginHorizontal: '7%',
  },

  textArea: {
    height: 70,
    justifyContent: 'flex-start',
  },
});
