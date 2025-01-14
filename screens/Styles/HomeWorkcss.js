import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  subjectText: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 16,
    marginTop: 5,
  },
  dueDateText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#002e98',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',               // White text color for contrast
    backgroundColor: 'coral',   // Background color for highlighting
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    textAlign: 'left',
    alignSelf: 'flex-start',      // Ensure it doesn't stretch full width
    marginBottom: 5,
    width:'100%',
  },
  refreshButton: {
    padding: 5,
    color: '#000000', 
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
  dateSection: {
marginBottom:20,
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth:0.5,
    borderColor:'lightgrey',
  },

//Additional for update homework


addButton: {
  backgroundColor: '#ffda47',
  padding: 10,
  borderRadius: 10,
  marginHorizontal: 8,
},
addButtonText: {
  color: '#333',
  fontWeight: 'bold',
},
picker: {
  width: '100%',
  marginTop:25,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5, // Optional: adds rounded corners
    overflow: 'hidden', // Prevents the picker from overflowing the border on Android
  
},
submitButtonText: {
  color: '#fff',
  fontWeight: 'bold',
},
submitButton: {
  backgroundColor: '#002e98',
  padding: 10,
  borderRadius: 8,
  marginTop:30,
  alignItems: 'center',
  width:'60%',
  justifyContent:'center',
},


inputContainer: {
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: 15,
  paddingVertical: 10,
  paddingHorizontal: 15,
  backgroundColor: '#fff',
  borderRadius: 8,
  elevation: 3,
},

textInput: {
  width: '100%',
  borderWidth: 1,
  borderColor: '#ccc',
  paddingVertical: 8,
  paddingHorizontal: 15,
  borderRadius: 8,
  marginTop:20,
},
Headerclass: {
  backgroundColor: 'lightgrey', // Soft, neutral background color
  padding: 15,
  borderRadius: 10,
  marginBottom: 10,
},
rowContainer: {
  flexDirection: 'row',
   alignItems: 'center',
  justifyContent: 'space-between',
},
input: {
  flex: 1,
  padding: 8,
  borderWidth: 1,
  borderColor: 'lightgray',
  borderRadius: 5,
  backgroundColor: 'white',
  height: 45, // Set to match TextInput height
  color:'black',
},
pickerContainer: {
  flex: 1,
  marginRight: 10,
  borderWidth: 1,
  borderColor: 'lightgray',
  borderRadius: 5,
  backgroundColor: 'white',
  overflow: 'hidden', // Ensures the border-radius works properly
  height: 45, // Set to match TextInput height
    justifyContent: 'center', // Center aligns Picker text vertically
},


//Homework pop-up screen design

modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContainer: {
  width: '80%',
  padding: 20,
  backgroundColor: 'white',
  borderRadius: 10,
  alignItems: 'center',
  elevation: 5,
},
cancelButton: {
  marginTop: 20,
},
cancelButtonText: {
  color: '#007AFF',
  fontSize: 16,
},

});

export default commonStyles;
