import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const CustomerList = () => {
  const customers = [
    {
      CustomerID: 'C12345',
      CustomerName: 'John Doe',
      Address: '123 Main Street, City, Country',
      PhoneNumber: '+1234567890',
      ModifiedDateTime: '2025-01-22 14:35:00',
      PrincipleID: 'P67890',
    },
    {
      CustomerID: 'C12346',
      CustomerName: 'Jane Smith',
      Address: '456 Elm Street, City, Country',
      PhoneNumber: '+9876543210',
      ModifiedDateTime: '2025-01-21 10:15:00',
      PrincipleID: 'P67891',
    },
    {
      CustomerID: 'C12347',
      CustomerName: 'Mark Taylor',
      Address: '789 Oak Street, City, Country',
      PhoneNumber: '+1122334455',
      ModifiedDateTime: '2025-01-20 08:25:00',
      PrincipleID: 'P67892',
    },
  ];

  const [searchText, setSearchText] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState(customers); // Initialize with the customers list
  const [expandedCustomer, setExpandedCustomer] = useState(null);

  const handleSearch = (text) => {
    setSearchText(text);

    if (text.trim() === '') {
      setFilteredCustomers(customers); // Show all customers if search text is empty
    } else {
      const filtered = customers.filter((customer) =>
        customer.CustomerName.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  };

  const handleExpand = (customerID) => {
    setExpandedCustomer((prev) => (prev === customerID ? null : customerID));
  };

  const renderCustomer = ({ item }) => (
    <View style={styles.customerCard}>
      <TouchableOpacity onPress={() => handleExpand(item.CustomerID)}>
        <Text style={styles.customerName}>{item.CustomerName}</Text>
        <Text style={styles.phoneNumber}>{item.PhoneNumber}</Text>
      </TouchableOpacity>

      {expandedCustomer === item.CustomerID && (
        <View style={styles.additionalDetails}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{item.Address}</Text>

          <Text style={styles.label}>Modified Date:</Text>
          <Text style={styles.value}>{item.ModifiedDateTime}</Text>

          <Text style={styles.label}>Principle ID:</Text>
          <Text style={styles.value}>{item.PrincipleID}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Customer List</Text>
      <Text style={styles.customerCount}>
        Total Customers: {filteredCustomers.length}
      </Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by Customer Name"
        value={searchText}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.CustomerID}
        renderItem={renderCustomer}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No customers found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  customerCount: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  list: {
    paddingBottom: 16,
  },
  customerCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  phoneNumber: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  additionalDetails: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});

export default CustomerList;
