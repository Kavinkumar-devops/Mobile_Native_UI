import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, TouchableOpacity,Alert,Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Assume you have react-native-vector-icons installed
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';
import Loading from '../Loading'; 
import Popup from './Popup/popup.js'; // Adjust the path if necessary

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('AD004');
  const [password, setPassword] = useState('sk1');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const showPopup = () => setPopupVisible(true);
  const hidePopup = () => setPopupVisible(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    setLoading(true);  
    try {
      const response = await fetch(`${config.API_URL}/Auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: email,
          password: password,
        }),
      });
  
      let data;
      const contentType = response.headers.get("content-type");
  
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (response.ok) {
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('username', email);

        navigation.replace('Home');
        // setTimeout(() => {
        //   hidePopup();
        //   navigation.replace('Home'); // Navigate to Home screen after a delay
        // }, 2000); // Delay in milliseconds
      } else {
        // const errorMessage = typeof data === 'string' ? data : data.message || 'Invalid credentials';
        // Alert.alert('Login Failed', errorMessage);
       showPopup(); // Show the popup on successful login
       setTimeout(() => {
          hidePopup();
        }, 2000); // Delay in milliseconds
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/Logo/logosch.png')} style={styles.logo} />
      <Text style={styles.welcomeText}>Welcome!</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="User Name"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Icon name="user" size={20} color="#888" style={styles.icon} />
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Icon name={isPasswordVisible ? "eye" : "eye-slash"} size={20} color="#888" style={styles.icon} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, !email || !password ? styles.disabledButton : null]}
        onPress={handleLogin}
        disabled={!email || !password}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPasswordText}>I forgot my password</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Terms & Conditions <Text style={styles.linkText} onPress={() => navigation.navigate('T&C')}>Apply</Text>
      </Text>

      {/* Popup Component */}
      <Popup
        visible={isPopupVisible}
        onClose={hidePopup}
        title="Login Failed !"
        message="Incorrect username or password."
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Align content to the top
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'whitesmoke',
  },
  logo: {
    width: 180,
    height: 220,
    resizeMode: 'contain',
    marginTop: 50, // Adjust this value to move the logo up or down
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#6e6b7b',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#063970',
    borderWidth:2,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: '100%',
  },
  input: {
    flex: 1,
    padding: 13,
    fontSize: 14,
    
  },
  icon: {
    marginLeft: 20,
    color:'black',
    fontSize:25,
  },
  button: {
    backgroundColor: '#6d65de',
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 25,
    marginTop: 20,
    height:55,
    justifyContent:'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: '#6e00ff',
    marginTop: 20,
    textDecorationLine: 'underline',
    marginBottom:30,
    fontWeight:'bold',
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: '#333',
  },
  linkText: {
    color: '#6e00ff',
    textDecorationLine: 'underline',
  },
});
export default LoginScreen;