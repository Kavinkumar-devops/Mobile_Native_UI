import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import Loading from '../Loading'; 
import config from '../config';
import commonStyles from './Styles/HomeWorkcss';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import RefreshButton from './RefreshButton';
import { Picker } from '@react-native-picker/picker';

const HomeWorkScreen = () => {
  
  const [loading, setLoading] = useState(true);
  const [homeworkList, setHomeworkList] = useState([]);
  const [groupedHomework, setGroupedHomework] = useState({});
  const [isAddingHomework, setIsAddingHomework] = useState(false);
  const [newHomeworkText, setNewHomeworkText] = useState('');

  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  // Additional state variables for required fields
  const [boardName, setBoardName] = useState('CBSE');
  const [className, setClassName] = useState('I-Std');
  const [sectionName, setSectionName] = useState('A');
  const [subjectName, setSubjectName] = useState('');
  const [assignmentDate, setAssignmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDate, setSelectedDate] = useState(null); // Track the currently selected date
  const [test, setTest] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [apiresponse, setApiresponse] = useState([]);
  const [selectedStandard, setSelectedStandard] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('');
  // const [date, setDate] = useState(dayjs().format('YYYY-MM-DD')); // Default to current date
  const [date, setDate] = useState('2024-08-19');


  useEffect(() => {
     fetchAttendanceData();
    fetchData();
  }, []);

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
  
  useEffect(() => {
    const groupedData = groupAssignmentsByDate(homeworkList);
    
    // Get today's date in 'YYYY-MM-DD' format
    const todayDate = new Date().toISOString().split('T')[0];
    
    // Filter the assignments to show only today's date assignments
    const todayData = groupedData[todayDate] || [];
    
    setGroupedHomework({ [todayDate]: todayData });
    setSelectedDate(todayDate);
  }, [homeworkList]);
  
  const renderHomeworkItem = ({ item }) => (
    <View style={commonStyles.itemContainer}>
      <Text style={commonStyles.subjectText}>{item.subject_name}</Text>
      <Text style={commonStyles.descriptionText}>{item.assignment}</Text>
    </View>
  );
  

  const openAddHomeworkModal = () => {
    setSubjectName(''); // Clear Picker selection
    setNewHomeworkText(''); // Clear TextInput
    setIsAddingHomework(true); // Open modal
  };

  const submitHomework = async () => {
    
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      Alert.alert("Error", "Token not found");
      return;
    }
    if (subjectName === '' || newHomeworkText.trim() === '') {
      setErrorMessage('Subject and Homework Notes are mandatory'); // Set error message if validation fails

      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`https://sitapi.arvens3.com/api/Homeworks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignment: newHomeworkText,
          board_name: boardName,
          class_name: className,
          section_name: sectionName,
          subject_name: subjectName,
          assignment_date: assignmentDate,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Homework added successfully.");
        setNewHomeworkText('');
        setIsAddingHomework(false);
        fetchAttendanceData();
      } else {
        Alert.alert("Error", "Failed to add homework.");
      }
    } catch (error) {
      console.error("Error posting homework:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  const renderDateSection = ({ item }) => {
    const [date, assignments] = item;
    const isSelected = selectedDate === date;

    // return (
    //   <View style={commonStyles.dateSection}>
    //   <TouchableOpacity onPress={() => setSelectedDate(isSelected ? null : date)}>
    //     <Text style={commonStyles.dateText}>{formatDate(date)}</Text>
    //   </TouchableOpacity>
    //   {isSelected && (
    //     <FlatList
    //       data={assignments}
    //       renderItem={renderHomeworkItem}
    //       keyExtractor={(item) => item.homework_id.toString()}
    //     />
    //   )}
    // </View>
    // );
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
        {/* <Text style={commonStyles.headerText}>Home Work Assignments</Text> */}
        <TouchableOpacity onPress={openAddHomeworkModal} style={commonStyles.addButton}>
          <Text style={commonStyles.addButtonText}>Add Homework</Text>
        </TouchableOpacity>
        <RefreshButton onPress={fetchAttendanceData} />
      </View>

      <View style={commonStyles.Headerclass}>
  <View style={commonStyles.rowContainer}>
    <View style={commonStyles.pickerContainer}>
      <Picker
        selectedValue={selectedStandard}
        onValueChange={(itemValue) => setSelectedStandard(itemValue)}
        // style={commonStyles.pickerstandard}
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
    <View style={commonStyles.pickerContainer}>
      <Picker
        selectedValue={selectedStandard}
        onValueChange={(itemValue) => setSelectedStandard(itemValue)}
        // style={commonStyles.pickerstandard}
      >
                <Picker.Item label="Jan" value="Jan" />
                <Picker.Item label="Feb" value="Feb" />
                <Picker.Item label="March" value="March" />
                <Picker.Item label="April" value="April" />
                <Picker.Item label="May" value="May" />
                <Picker.Item label="June" value="June" />
                <Picker.Item label="July" value="July" />
                <Picker.Item label="Aug" value="Aug" />
                <Picker.Item label="Sep" value="Sep" />
                <Picker.Item label="Oct" value="Oct" />
                <Picker.Item label="Nov" value="Nov" />
                <Picker.Item label="Dec" value="Dec" />
      </Picker>
    </View>
  </View>
</View>
     

      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddingHomework}
        onRequestClose={() => setIsAddingHomework(false)}
      >
        <View style={commonStyles.modalOverlay}>
          <View style={commonStyles.modalContainer}>
            <Text style={commonStyles.headerText}>Add Homework</Text>
            <View style={commonStyles.picker}>
              <Picker
                selectedValue={subjectName}
                onValueChange={(itemValue) => setSubjectName(itemValue)}
                style={{ width: '100%' }}
              >
                <Picker.Item label="Select Subject" value="" />
                <Picker.Item label="English" value="English" />
                <Picker.Item label="GK" value="GK" />
                <Picker.Item label="Kannada" value="Kannada" />
                <Picker.Item label="Hindi" value="Hindi" />
                <Picker.Item label="Maths" value="Maths" />
                <Picker.Item label="Science" value="Science" />
              </Picker>
            </View>
            <TextInput
              style={[commonStyles.textInput, { height: 135, textAlignVertical: 'top' }]} // Adjust height as needed
              placeholder="Enter Homework"
              value={newHomeworkText}
              onChangeText={setNewHomeworkText}
              multiline={true}
/>
            <TouchableOpacity onPress={submitHomework} style={commonStyles.submitButton}>
              <Text style={commonStyles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsAddingHomework(false)} style={commonStyles.cancelButton}>
              <Text style={commonStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            {errorMessage ? (
              <Text style={{ color: 'red', marginTop: 10 }}>{errorMessage}</Text>
            ) : null}
          </View>
        </View>
      </Modal>

      <FlatList
        data={Object.entries(groupedHomework)}
        renderItem={renderDateSection}
        keyExtractor={(item) => item[0]}
      />
    </View>
  );
};

export default HomeWorkScreen;
