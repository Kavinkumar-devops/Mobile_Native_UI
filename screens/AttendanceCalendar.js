import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Loading from '../Loading'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import RefreshButton from './RefreshButton';

const AttendanceCalendar = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [onDutyCount, setOnDutyCount] = useState(0);
  const [lateCount, setLateCount] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().split('T')[0]);
  const [maxDate, setMaxDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);  

  useEffect(() => {
    const today = new Date();
    const lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const formattedLastDate = lastDate.toISOString().split('T')[0];
    setMaxDate(formattedLastDate);
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert("Error", "Token not found");
        return;
      }
      const response = await fetch(`https://sitapi.arvens3.com/api/attendance/test/AD004`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        const data = await response.json();
        const formattedData = data.map(item => ({
          date: item.attendance_date.split('T')[0],
          status: item.attendancestatus_name.charAt(0).toUpperCase() + item.attendancestatus_name.slice(1),
        }));
        setAttendanceData(formattedData);
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
    const marked = {};
    let present = 0;
    let absent = 0;
    let onduty = 0;
    let late = 0;

    attendanceData.forEach(({ date, status }) => {
      if (date.startsWith(currentMonth.substring(0, 7))) {
        let dotColor = 'gray'; // Default dot color
        let backgroundColor = 'gray';
        if (status === 'Present') {
          dotColor = 'green';
          backgroundColor = 'green';
          present++;
        } else if (status === 'Absent') {
          dotColor = 'red';
          backgroundColor = 'red';
          absent++;
        } else if (status === 'Onduty') {
          dotColor = 'orange';
          backgroundColor = 'orange';
          onduty++;
        } else if (status === 'Late') {
          dotColor = 'blue';
          backgroundColor = 'blue';
          late++;
        }

        marked[date] = {
          customStyles: {
            container: {
              backgroundColor: backgroundColor, // Larger mark with full background color
              borderRadius: 10,
              padding: 0, // Adjust padding for a larger mark
            },
            text: {
              color: 'white',
              fontWeight: 'bold',
            },
          },
        };
      }
    });

    setMarkedDates(marked);
    setPresentCount(present);
    setAbsentCount(absent);
    setOnDutyCount(onduty);
    setLateCount(late);
  }, [currentMonth, attendanceData]);

    const renderDay = (day) => {
    const dateKey = day.dateString;
    const status = markedDates[dateKey];
    let backgroundColor = 'white';

    if (status) {
      backgroundColor = status.dotColor;
    }

    return (
      <View style={[styles.dayBox, { backgroundColor }]}>
        <Text style={styles.dayText}>{day.day}</Text>
      </View>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Attendance</Text>
        <RefreshButton onPress={fetchAttendanceData} />
      </View>
      {/* Calendar Section */}
      <View style={styles.calendarContainer}>
        <Calendar
          current={currentMonth}
          minDate={'2024-01-01'}
          maxDate={maxDate}
          monthFormat={'MMMM - yyyy'}
          markedDates={markedDates}
          markingType={'custom'}
          enableSwipeMonths={true}
          renderDay={renderDay}
          theme={{
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            todayTextColor: '#00adf5',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            arrowColor: '#00adf5',
            monthTextColor: '#7e6900', // Month text color
            indicatorColor: '#333',
            textMonthFontWeight: 'bold', // Make month text bold
            textMonthFontSize: 20, // Increase the font size for month text
          }}          
          onMonthChange={(month) => {
            setCurrentMonth(month.dateString);
          }}
        />
      </View>
            {/* Attendance Count Section */}
            <View style={styles.countContainer}>
        <View style={styles.row}>
          <View style={[styles.countBox, { backgroundColor: 'green' }]}>
            <Text style={styles.countText}>Present: {presentCount}</Text>
          </View>
          <View style={[styles.countBox, { backgroundColor: 'red' }]}>
            <Text style={styles.countText}>Absent: {absentCount}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={[styles.countBox, { backgroundColor: 'orange' }]}>
            <Text style={styles.countText}>On Duty: {onDutyCount}</Text>
          </View>
          <View style={[styles.countBox, { backgroundColor: 'blue' }]}>
            <Text style={styles.countText}>Late: {lateCount}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  calendarContainer: {
    borderWidth: 2,
    borderColor: '#d1d1d1',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  countContainer: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  countBox: {
    padding: 10,
    borderRadius: 9,
    width: '45%', // Make sure the boxes fit nicely in each row
    alignItems: 'center',
  },
  countText: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensures space between text and button
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default AttendanceCalendar;