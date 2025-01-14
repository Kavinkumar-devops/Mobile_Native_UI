import React, { useState,useEffect  } from 'react';
import { View, Text, TextInput, Button, StyleSheet,Alert } from 'react-native';
import { useNavigation,TouchableOpacity } from '@react-navigation/native';
import dayjs from 'dayjs';
import config from '../config';
import RefreshButton from './RefreshButton';
import Loading from '../Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const AttendanceInputScreen = () => {
  const navigation = useNavigation();
  const [test, setTest] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [apiresponse, setApiresponse] = useState([]);
  const [selectedStandard, setSelectedStandard] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('');
  // const [date, setDate] = useState(dayjs().format('YYYY-MM-DD')); // Default to current date
  const [date, setDate] = useState('2024-08-19');
  const [loading, setLoading] = useState(false);


  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userEmail = await AsyncStorage.getItem('username');

      // First API call to get RoleName and school_name
      const roleResponse = await fetch(`${config.API_URL}/Users/${userEmail}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!roleResponse.ok) {
        throw new Error(`Failed to fetch user role data: ${roleResponse.status}`);
      }

      const roleData = await roleResponse.json();
      const { roleName, school_name } = roleData[0];
      setTest(school_name);

      // Second API call to get class mapping data
      const classResponse = await fetch(`${config.API_URL}/classmapping/${userEmail}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!classResponse.ok) {
        throw new Error(`Failed to fetch class mapping data: ${classResponse.status}`);
      }

      const data = await classResponse.json();
      
      if (data.length === 1) {
        setSelectedStandard(data[0]?.class_name || ''); // Select first section as default
        setAcademicYear(data[0].academicYear);
        setApiresponse(data);
        setSelectedSection(data[0]?.section_name || ''); // Select first section as default
        setSelectedBoard(data[0]?.board_name || '');
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data. Please contact admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = () => {
    const apiUrl = `https://sitapi.arvens3.com/api/attendance/${test}/${selectedStandard}/${selectedSection}/${selectedBoard}/${academicYear}/${date}`;
    navigation.navigate('TakeAttendance', { apiUrl }); // Pass the full URL to the attendance screen
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Class Details</Text>
        <RefreshButton onPress={fetchData} />
      </View>
      <Text style={styles.label}>Standard</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedStandard}
          onValueChange={(itemValue) => setSelectedStandard(itemValue)}
          style={styles.picker}
        >
          {apiresponse.map((item) => (
            <Picker.Item
              label={item.class_name}
              value={item.class_name}
              key={item.master_id}
            />
          ))}
        </Picker>
      </View>
      <Text style={styles.label}>Section</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedSection}
          onValueChange={(itemValue) => setSelectedSection(itemValue)}
          style={styles.picker}
        >
          {apiresponse.map((item) => (
            <Picker.Item
              label={item.section_name}
              value={item.section_name}
              key={item.master_id}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Board</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedBoard}
          onValueChange={(itemValue) => setSelectedBoard(itemValue)}
          style={styles.picker}
        >
          {apiresponse.map((item) => (
            <Picker.Item
              label={item.board_name}
              value={item.board_name}
              key={item.master_id}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Academic Year</Text>
      <TextInput style={styles.input} value={academicYear} editable={false} />

      <Text style={styles.label}>Date</Text>
      <TextInput style={styles.input} value={date} editable={false} />

      <Button title="Submit" onPress={handleSubmit} color="#dcae1d" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fffbea', // light yellow background
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#f4e1a6',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3d3d3d',
  },
  label: {
    fontSize: 16,
    color: '#5f5f5f',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e8dcb5',
    backgroundColor: '#fff7d6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#3d3d3d',
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e8dcb5',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff7d6',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#3d3d3d',
  },
});

export default AttendanceInputScreen;
