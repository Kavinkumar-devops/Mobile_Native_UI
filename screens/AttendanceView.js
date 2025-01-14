// AttendanceView.js
import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AttendanceCalendar from './AttendanceCalendar'; // Adjust the path accordingly
import Loading from '../Loading';

const AttendanceView = () => {
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        setLoading(true);
        // Simulate a fetch or API call
        setTimeout(() => {
          setLoading(false);
        }, 500); // 3 seconds delay
      }, []);

      if (loading) {
        return <Loading />;
      }

  return (
    <View style={styles.container}>
      <AttendanceCalendar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});

export default AttendanceView;
