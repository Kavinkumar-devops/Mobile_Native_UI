import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import config from '../../config';
import Loading from '../../Loading'; 


const DynamicMenu = () => {
  const navigation = useNavigation();
  // const menuCount = apiResponse.principles.length;
  const [apiResponse, setApiResponse] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // Define async function to fetch data
    const fetchPrinciples = async () => {
      const UserID = await AsyncStorage.getItem('UserID');
      const token = await AsyncStorage.getItem('authToken');
      if (UserID)
      {
        try {
              const response = await fetch(`${config.API_URL}/principles/${UserID}`, {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                }
              });
          if (response.ok) {
            const data = await response.json();
            setApiResponse(data.principles); // Assuming the response contains 'principles'
          } else {
            console.error('Failed to fetch data', response.status);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }
      else{
        console.error('UserID not found in Local Storage');
      }
      };
  
      fetchPrinciples();
    }, []); // Empty dependency array to run only once when the component mounts

  // Function to store PrincipleCode in AsyncStorage
  const handlePress = async (principleCode,PrincipleID,PrincipleName) => {
    
    try {
      await AsyncStorage.setItem("selectedPrinciple", principleCode);
      await AsyncStorage.setItem("selectedPrincipleID", PrincipleID.toString());
      await AsyncStorage.setItem("selectedPrincipleName", PrincipleName);

      navigation.navigate("Home", { code: principleCode });
    } catch (error) {
      console.error("Error storing principle code:", error);
    }
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <View style={styles.container}>
      {/* <Text style={styles.countText}>Total Menus: {menuCount}</Text> */}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
      {apiResponse.map((principle) => (
        <TouchableOpacity
          key={principle.PrincipleID}
          style={styles.dashboardItem}
          onPress={() => handlePress(principle.PrincipleCode, principle.PrincipleID, principle.PrincipleName)} // Call function on press
        >
          <Image source={require("../../assets/Images/hw1.png")} style={styles.dashboardIcon} />
          <Text style={styles.dashboardText}>{principle.PrincipleCode}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  countText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  dashboardItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    height: 150,
    marginVertical: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    elevation: 5,
  },
  dashboardIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  dashboardText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default DynamicMenu;
