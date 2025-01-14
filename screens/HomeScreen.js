import React, { useState,useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Loading from '../Loading';

const HomeScreen = ({ navigation }) => {

const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        setLoading(true);
        // Simulate a fetch or API call
        setTimeout(() => {
          setLoading(false);
        }, 500); // 3 seconds delay
      }, []);

      const menuItems = [
        {id: 1, title: 'Customers', icon: require('../assets/Images/hw1.png') },
        {id: 16, title: 'Update_HW', icon: require('../assets/Images/hw2.png') },
        {id: 3, title: 'AttendanceInput', icon: require('../assets/Images/attendance.png') },
        {id: 2, title: 'View_Attendance', icon: require('../assets/Images/attendance1.png') },
        {id: 4, title: 'Staff Leave', icon: require('../assets/Images/leave.png') },
        {id: 5, title: 'Circular', icon: require('../assets/Images/agile.png') },
        {id: 6, title: 'Photo Gallery', icon: require('../assets/Images/picture.png') },
        {id: 7, title: 'Student Leave', icon: require('../assets/Images/leave_1.png') },
        {id: 8, title: 'Staff SMS', icon: require('../assets/Images/sms.png') },
        {id: 9, title: 'Day Book', icon: require('../assets/Images/books.png') },
        {id: 10, title: 'Dues List', icon: require('../assets/Images/due-date.png') },
        {id: 11, title: 'Fee Day Book', icon: require('../assets/Images/charge.png') },
        {id: 12, title: 'Fee Receipt', icon: require('../assets/Images/bill.png') },
        {id: 13, title: 'Feedback List', icon: require('../assets/Images/feedback.png') },
        {id: 14, title: 'Visitor List', icon: require('../assets/Images/visitor.png') },
      ];
      if (loading) {
        return <Loading />;
      }

  return (
    <View style={styles.container}>
      {/* Dashboard Grid */}
      <View style={styles.dashboardContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.dashboardItem}
            onPress={() => navigation.navigate(item.title)}
          >
            <Image source={item.icon} style={styles.dashboardIcon} />
            <Text style={styles.dashboardText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', // Move the elements down
    backgroundColor: '#ADD8E6', // Light blue background for the header
    paddingHorizontal: 15,
    height: 100, // Increase the height of the header
    paddingBottom: 10, // Add some padding to move elements down
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 20,
  },
  dashboardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly', // Adjust spacing between icons
    paddingHorizontal: 10, // Reduce free space on left and right
  },
  dashboardItem: {
    width: '30%', // Increase width for larger icons
    alignItems: 'center',
    marginVertical: 15,
    backgroundColor: 'hsl(0, 48.30%, 59.00%)',
    borderRadius: 10,
    padding: 10,
    elevation: 10, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dashboardIcon: {
    width: 60, // Adjust size of the icons
    height: 60, // Adjust size of the icons
    marginBottom: 10,
  },
  dashboardText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'white',
  },
});


export default HomeScreen;
