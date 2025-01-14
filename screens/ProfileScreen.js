  import {React,useState,useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ProfileScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Fetch the email from AsyncStorage
    const fetchEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('username');
        if (storedEmail) {
          setEmail(storedEmail);
        }
      } catch (error) {
        console.error('Error fetching email:', error);
      }
    };

    fetchEmail();
  }, []);

  const handleLogout = async () => {
    // Clear login status or token from AsyncStorage
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('userData');
    console.log('Logging out...');

    // Reset the navigation stack and go to the Login screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      {/* Profile Name */}
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>{email}</Text>
      </TouchableOpacity>

      {/* Settings */}
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Settings</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={styles.option} onPress={handleLogout}>
        <Text style={styles.optionText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  option: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  optionText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default ProfileScreen;
