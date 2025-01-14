import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const TermsAndConditionsScreen = ({ navigation }) => {
  const [agreed, setAgreed] = useState(false);

  const handleAgree = () => {
    if (!agreed) {
      Alert.alert("Notice", "Please scroll down and read the Terms and Conditions before agreeing.");
    } else {
      Alert.alert("Thank you!", "You have agreed to the Terms and Conditions.");
      navigation.navigate('Login'); // Replace 'Home' with the actual screen you want to navigate to
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>School Terms and Conditions</Text>
      <ScrollView 
        style={styles.scrollView}
        onScroll={(event) => {
          const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
          const isScrolledToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
          if (isScrolledToBottom) {
            setAgreed(true);
          }
        }}
      >
        <Text style={styles.termsText}>
          Welcome to our school app. By using this app, you agree to comply with and be bound by the following terms and conditions. Please review them carefully. If you do not agree to these terms, do not use this app.

          1. **Usage**: This app is intended for educational purposes only. Students, teachers, and parents must use it responsibly.
          
          2. **Privacy**: All data and information shared on this app will be kept confidential and used only for educational purposes.
          
          3. **Code of Conduct**: Users are expected to follow a respectful code of conduct. Any misuse of the app may result in restricted access.
          
          4. **Updates**: The school may update these terms as necessary. Users are responsible for reviewing any updates.
          
          1. **Usage**: This app is intended for educational purposes only. Students, teachers, and parents must use it responsibly.
          
          2. **Privacy**: All data and information shared on this app will be kept confidential and used only for educational purposes.
          
          3. **Code of Conduct**: Users are expected to follow a respectful code of conduct. Any misuse of the app may result in restricted access.
          
          4. **Updates**: The school may update these terms as necessary. Users are responsible for reviewing any updates.
          
          1. **Usage**: This app is intended for educational purposes only. Students, teachers, and parents must use it responsibly.
          
          2. **Privacy**: All data and information shared on this app will be kept confidential and used only for educational purposes.
          
          3. **Code of Conduct**: Users are expected to follow a respectful code of conduct. Any misuse of the app may result in restricted access.
          
          4. **Updates**: The school may update these terms as necessary. Users are responsible for reviewing any updates.
          
          [Additional terms can be added here according to the school's policies.]

          By accepting these terms, you agree to abide by all the above rules and regulations and understand the consequences of misuse.
        </Text>
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: agreed ? '#4CAF50' : '#888' }]}
        onPress={handleAgree}
        disabled={!agreed}
      >
        <Text style={styles.buttonText}>I Agree</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  termsText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'justify',
    paddingHorizontal: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TermsAndConditionsScreen;
