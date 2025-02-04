import {React,useState,useEffect} from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AttendanceView from './screens/AttendanceView';
import TakeAttendance from './screens/TakeAttendance';
import RegisterScreen from './screens/RegisterScreen'; // Import RegisterScreen
import HomeWorkScreen from './screens/HomeWorkScreen';
import vehicle from './screens/vehicle/VehicleScreen';
import ProfileScreen from './screens/ProfileScreen';
import AttendanceInput from './screens/AttendanceInputScreen';
import HWInput from './screens/HWInputScreen';
import HWUpdate from './screens/HWUpdate';
import TermsConditions from './screens/T&C';
import NotificationIcon from './assets/Images/notification.png'; // Your notification icon
import ProfileIcon from './assets/Images/profile-m.png'; // Your profile icon
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const CustomHeader = ({ navigation }) => {

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

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Hello, {email}</Text>
      <View style={styles.headerIcons}>
        <TouchableOpacity onPress={() => alert('Notifications')}>
          <Image source={NotificationIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={ProfileIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const CustomHeader_Vehicle = ({ navigation }) => {

  const [principle, setprinciple] = useState('');
  const [principleID, setprincipleID] = useState('');

  useEffect(() => {
    // Fetch the email from AsyncStorage
    const fetchEmail = async () => {
      try {
        const selectedPrinciple = await AsyncStorage.getItem('selectedPrinciple');
        const selectedPrincipleID = await AsyncStorage.getItem('selectedPrincipleID');
        if (selectedPrinciple) {
          setprinciple(selectedPrinciple);
          setprincipleID(selectedPrincipleID);
        }
      } catch (error) {
        console.error('Error fetching email:', error);
      }
    };

    fetchEmail();
  }, []);

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{principle}</Text>
      <View style={styles.headerIcons}>
        <TouchableOpacity onPress={() => alert('Notifications')}>
          <Image source={NotificationIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={ProfileIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const commonHeaderOptions = {
  headerTitleStyle: { fontSize: 20, color: 'black', fontWeight: 'bold' },
  headerStyle: { backgroundColor: '#FFD700' },
  headerBackTitleVisible: false,
  headerTintColor: 'black',
};


const AppNavigator = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login status on app launch
    const checkLoginStatus = async () => {
      try {
        const loggedIn = await AsyncStorage.getItem('isLoggedIn');
        const token = await AsyncStorage.getItem('authToken');
        
        // Set isLoggedIn to true only if both `isLoggedIn` and `authToken` exist
        if (loggedIn === 'true' && token) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          // Optionally clear any lingering data
          await AsyncStorage.multiRemove(['isLoggedIn', 'authToken', 'username']);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoginStatus();
  }, []);


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "Vehicle" : "Login"}>
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />         
         <Stack.Screen 
          name="Vehicle" 
          component={vehicle} 
          options={({ navigation }) => ({
            header: () => <CustomHeader navigation={navigation} />,
            
          })}
        /> 
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={({ navigation }) => ({
            header: () => <CustomHeader_Vehicle navigation={navigation} />,
          })} 
        />        
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen 
        name="Customers" 
        component={HomeWorkScreen} 
        options={{
          headerTitle: "Customers",
          ...commonHeaderOptions, // Apply common header options
        }}   
      />
      <Stack.Screen 
        name="View_Attendance" 
        component={AttendanceView} 
        options={{
          headerTitle: "View_Attendance",
          ...commonHeaderOptions, // Apply common header options
        }}
      />
      <Stack.Screen 
        name="AttendanceInput" 
        component={AttendanceInput} 
        options={{
          headerTitle: "AttendanceInput",
          ...commonHeaderOptions, // Apply common header options
        }}
      />
      <Stack.Screen 
        name="TakeAttendance" 
        component={TakeAttendance} 
        options={{
          headerTitle: "AttendanceInput",
          ...commonHeaderOptions, // Apply common header options
        }}
      />
      <Stack.Screen 
        name="Update_HW" 
        component={HWInput} 
        options={{
          headerTitle: "AttendanceInput",
          ...commonHeaderOptions, // Apply common header options
        }}
      />
      <Stack.Screen 
        name="HWUpdate" 
        component={HWUpdate} 
        options={{
          headerTitle: "AttendanceInput",
          ...commonHeaderOptions, // Apply common header options
        }}
      />
      <Stack.Screen 
        name="T&C" 
        component={TermsConditions} 
        options={{
          headerTitle: "Terms & Conditions",
          ...commonHeaderOptions, // Apply common header options
        }}
      />
      <Stack.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{
        headerTitle: "Profile",
        ...commonHeaderOptions, // Apply common header options
      }}
      />
    </Stack.Navigator>
  </NavigationContainer>
  );
};

export default AppNavigator;

const styles = {
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', // Move the elements down
    // alignItems: 'center',
    backgroundColor: '#f9e003', // Light blue background for the header
    paddingHorizontal: 20,
    height: 85, // Increase the height of the header
    paddingBottom: 10, // Add some padding to move elements down
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#336321',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 35,
  },
};