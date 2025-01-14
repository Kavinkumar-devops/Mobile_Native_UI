import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../Loading';
import RefreshButton from './RefreshButton';

const AttendanceScreen = ({ route, navigation }) => {
  const { apiUrl } = route.params; // Access the API URL
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // const [homeworkList, setHomeworkList] = useState([
  //   {"attendance_id": 75582, "attendancestatus_name": "absent", "studentName": "AvJYYJYJYa"},
  //   {"attendance_id": 73916, "attendancestatus_name": "absent", "studentName": "HGHG"},
  //   {"attendance_id": 74014, "attendancestatus_name": "absent", "studentName": "JAJYYJYMA"},
  //   {"attendance_id": 74112, "attendancestatus_name": "absent", "studentName": "KARJYJYJYA"},
  //   {"attendance_id": 74210, "attendancestatus_name": "absent", "studentName": "JYYJYY"},
  //   {"attendance_id": 74308, "attendancestatus_name": "absent", "studentName": "JYJYJYYJ"},
  //   {"attendance_id": 74406, "attendancestatus_name": "absent", "studentName": "VJYJYJCSD"},
  //   {"attendance_id": 74504, "attendancestatus_name": "absent", "studentName": "JYYJYJYY"},
  //   {"attendance_id": 74602, "attendancestatus_name": "absent", "studentName": "XSGJJHD"},
  //   {"attendance_id": 74700, "attendancestatus_name": "absent", "studentName": "SDSD"},
  //   {"attendance_id": 74798, "attendancestatus_name": "absent", "studentName": "FDGGHFGFG"},
  //   {"attendance_id": 74896, "attendancestatus_name": "absent", "studentName": "CGFHGDGFXHGF"},
  //   {"attendance_id": 74994, "attendancestatus_name": "absent", "studentName": "ASSD"},
  //   {"attendance_id": 75092, "attendancestatus_name": "absent", "studentName": "JYYJYY"},
  //   {"attendance_id": 75190, "attendancestatus_name": "absent", "studentName": "SDSF"},
  //   {"attendance_id": 75288, "attendancestatus_name": "absent", "studentName": "JFGJ"},
  // ]);

  // Fetch attendance data from the API
  
  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken'); // Retrieve token
      if (!token) {
        console.error("No auth token found");
        return;
      }

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
        },
      });

      const data = await response.json();
      const formattedData = data.map(student => ({
        ...student,
        status: student.attendancestatus_name || 'present', // Default to "present"
      }));
      setStudents(formattedData);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      Alert.alert('Error', 'Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const markAllAsPresent = () => {
    // Set all items to 'present'
    const updatedData = students.map(item => ({
      ...item,
      status: 'present',
    }));
    setStudents(updatedData);
  };

  // Toggle between statuses
  const toggleStatus = (attendanceId) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.attendance_id === attendanceId
          ? {
              ...student,
              status:
                student.status === 'present'
                  ? 'absent'
                  : student.status === 'absent'
                  ? 'late'
                  : student.status === 'late'
                  ? 'onduty'
                  : 'present', // Toggle through statuses
            }
          : student
      )
    );
  };

  // Submit updated attendance data
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken'); // Retrieve token
      if (!token) {
        console.error("No auth token found");
        return;
      }

      for (const student of students) {
        const response = await fetch(`https://sitapi.arvens3.com/api/attendance/${student.attendance_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Add token to headers
          },
          body: JSON.stringify({
            attendance_id: student.attendance_id,
            attendancestatus_name: student.status,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update attendance');
        }
      }
      Alert.alert('Success', 'Attendance updated successfully');
      navigation.navigate('Home'); 
    } catch (error) {
      console.error('Error submitting attendance:', error);
      Alert.alert('Error', 'Failed to update attendance');
    }finally
    {
      setLoading(false);
    }
  };

  const renderStudentItem = ({ item }) => (
    <View style={styles.studentContainer}>
      <Text style={styles.studentName}>{item.studentName}</Text>
      <TouchableOpacity onPress={() => toggleStatus(item.attendance_id)} style={[styles.statusButton, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.statusText}>{item.status}</Text>
      </TouchableOpacity>
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'green';
      case 'absent':
        return 'red';
      case 'late':
        return 'orange';
      case 'onduty':
        return 'blue';
      default:
        return 'gray';
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Take Attendance</Text>
        <TouchableOpacity style={styles.presentButton} onPress={markAllAsPresent}>
          <Text style={styles.buttonText}>Mark All Present</Text>
        </TouchableOpacity>
        <RefreshButton onPress={fetchAttendanceData} />
      </View>
        <FlatList
          data={students}
          keyExtractor={(item) => item.attendance_id.toString()}
          renderItem={renderStudentItem}
          contentContainerStyle={styles.list}
        />
      <Button title="Submit Attendance" onPress={handleSubmit} color="#2196F3" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  studentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  statusText: {
    color: '#fff',
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
  presentButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AttendanceScreen;
