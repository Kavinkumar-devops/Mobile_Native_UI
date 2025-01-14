import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Loading from '../Loading'; 
import commonStyles from './Styles/HomeWorkcss';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import RefreshButton from './RefreshButton';

const HomeWorkScreen = () => {
  const [loading, setLoading] = useState(true);
  const [homeworkList, setHomeworkList] = useState([]);
  const [groupedHomework, setGroupedHomework] = useState({});
  const [selectedDate, setSelectedDate] = useState(null); // Track the currently selected date

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const groupAssignmentsByDate = (assignments) => {
    return assignments.reduce((acc, item) => {
      const date = item.assignment_date.split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});
  };

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert("Error", "Token not found");
        return;
      }
      const response = await fetch(`https://sitapi.arvens3.com/api/Homeworks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        const data = await response.json();       
        setHomeworkList(data);
      } else {
        Alert.alert("Error", "Please contact admin.");
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const groupedData = groupAssignmentsByDate(homeworkList);
    setGroupedHomework(groupedData);

    // Set the first date as selected by default
    const firstDate = Object.keys(groupedData)[0];
    if (firstDate) setSelectedDate(firstDate);
  }, [homeworkList]);

  const renderHomeworkItem = ({ item }) => (
    <View style={commonStyles.itemContainer}>
      <Text style={commonStyles.subjectText}>{item.subject_name}</Text>
      <Text style={commonStyles.descriptionText}>{item.assignment}</Text>
    </View>
  );

  if (loading) {
    return <Loading />;
  }

  const renderDateSection = ({ item }) => {
    const [date, assignments] = item;
    const isSelected = selectedDate === date;

    return (
      <View style={commonStyles.dateSection}>
        <TouchableOpacity onPress={() => setSelectedDate(isSelected ? null : date)}>
          <Text style={commonStyles.dateText}>{formatDate(date)}</Text>
        </TouchableOpacity>
        {isSelected && (
          <FlatList
            data={assignments}
            renderItem={renderHomeworkItem}
            keyExtractor={(item) => item.homework_id.toString()}
          />
        )}
      </View>
    );
  };

  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.headerRow}>
        <Text style={commonStyles.headerText}>Home Work Assignments</Text>
        <RefreshButton onPress={fetchAttendanceData} />
      </View>
      <FlatList
        data={Object.entries(groupedHomework)}
        renderItem={renderDateSection}
        keyExtractor={(item) => item[0]}
      />
    </View>
  );
};

export default HomeWorkScreen;
