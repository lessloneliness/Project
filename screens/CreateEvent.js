import { useNavigation } from '@react-navigation/core';
import { React, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  Pressable,
  TextInput,
  View,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { db, firestore, auth } from '../firebase';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import {
  doc,
  onSnapshot,
  collection,
  query,
  arrayUnion,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
const CreateEvent = () => {
  const myId = auth.currentUser.uid;
  const myEmail = auth.currentUser.email;

  const navigation = useNavigation();
  const [openFriends, setOpenFriends] = useState(false);
  const [chosenFriends, setChosenFriends] = useState([]);
  const [serverFriends, setServerFriends] = useState([]);
  const [EventName, setEventName] = useState(null);
  const [EventDescription, setEventDescription] = useState('');
  const [EventLocation, setEventLocation] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [location, setLocation] = useState({
    latitude: 31.3077232604,
    longitude: 37.87780799875718,
  });
  useEffect(() => {
    Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
      maximumAge: 10000,
    })
      .then(({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation({ latitude, longitude });
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
    })();
  }, []);

  const onChange = (event, selectedDate) => {
    if (selectedDate) {
      const currentDate = selectedDate;
      setEventDate(currentDate);
    }
    setShow(false);
  };
  const showMode = (currentMode) => {
    setMode(currentMode);
  };

  const showDatepicker = () => {
    setShow(true);
    showMode('date');
  };

  const showTimepicker = () => {
    setShow(true);
    showMode('time');
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'users', myId), (documentSnapshot) => {
      const userFriends = documentSnapshot
        .data()
        .Friends.map((friend) => ({ label: friend, value: friend }));
      setServerFriends(userFriends);
    });

    return () => unsub();
  }, [myId]);

  const CreateEvent = () => {
    const serverUsers = new Map([[myEmail, myId]]);
    const q = query(collection(db, 'users'));
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((documentSnapshot) => {
        const id = documentSnapshot.id;
        const email = documentSnapshot.data().Email;
        if (id && email && !serverUsers.get(email)) {
          serverUsers.set(email, id);
        }
      });
      [...chosenFriends, myEmail].forEach((value) => {
        const freindId = serverUsers.get(value);
        if (freindId) {
          const userRef = doc(db, 'users', freindId);
          updateDoc(userRef, {
            EventsId: arrayUnion(EventName),
          });
        }
      });
    });

    const eventsRef = doc(db, 'events', EventName);
    setDoc(eventsRef, {
      members: [...chosenFriends, myEmail],
      name: EventName,
      discription: EventDescription,
      location: location,
      date: eventDate,
    }).then(() => navigation.replace('Home'));
  };
  return (
    <SafeAreaView>
      <View style={styles.inputContainer}>
        <Text style={styles.headerText}>Create Event</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={setEventName}
          placeholder='Enter Event Name'
        ></TextInput>
        <TextInput
          style={styles.textInput}
          onChangeText={setEventDescription}
          placeholder='Event Description'
        ></TextInput>
        <View style={styles.mapContanier}>
          {location && (
            <MapView
              style={{ flex: 1 }}
              region={{
                ...location,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={
                  location || {
                    latitude: 32.3077232604,
                    longitude: 34.87780799875718,
                  }
                }
                title={'marker.title'}
                description={'marker.description'}
              />
            </MapView>
          )}
        </View>
        <View>
          <View>
            <Pressable
              style={{
                fontSize: 15,
                borderWidth: 1,
                backgroundColor: 'white',
                paddingHorizontal: 15,
                paddingVertical: 7,
                borderRadius: 10,
                marginTop: 15,
              }}
              onPress={showDatepicker}
              title='Ch'
            >
              <Text>Select Event Date</Text>
            </Pressable>
          </View>
          <View>
            <Pressable
              style={{
                fontSize: 15,
                borderWidth: 1,
                backgroundColor: 'white',
                paddingHorizontal: 15,
                paddingVertical: 7,
                borderRadius: 10,
                marginTop: 15,
              }}
              onPress={showTimepicker}
              title='Ch'
            >
              <Text>Select Event Time</Text>
            </Pressable>
          </View>
          <Text>selected: {eventDate.toLocaleString()}</Text>
          {show && (
            <DateTimePicker
              testID='dateTimePicker'
              value={eventDate}
              mode={mode}
              is24Hour={true}
              onChange={onChange}
            />
          )}
        </View>
        <DropDownPicker
          style={styles.picker}
          zIndex={2000}
          zIndexInverse={2000}
          multiple={true}
          mode='BADGE'
          open={openFriends}
          value={chosenFriends}
          items={serverFriends}
          setOpen={setOpenFriends}
          setValue={setChosenFriends}
          setItems={setServerFriends}
          placeholder='Select Friends'
        />
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: '#0782F9',
          width: '40%',
          padding: 7,
          borderRadius: 50,
          alignItems: 'center',
          marginTop: '1%',
          marginHorizontal: '30%',
        }}
        onPress={CreateEvent}
      >
        <Text
          style={{ fontSize: 20, alignSelf: 'center', alignItems: 'center' }}
        >
          Create
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.replace('Home')}
        style={[styles.button, styles.buttonOutline]}
      >
        <Text style={styles.buttonOutlineText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CreateEvent;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  headerText: {
    fontSize: 20,
  },
  inputContainer: {
    paddingVertical: 15,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },

  picker: {
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 5,
  },
  textInput: {
    fontSize: 15,
    borderWidth: 1,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 10,
    marginTop: 15,
  },
  button: {
    backgroundColor: 'red',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
    marginHorizontal: '20%',
  },
  mapContanier: {
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 10,
    marginTop: 15,
    height: 150,
  },
});
