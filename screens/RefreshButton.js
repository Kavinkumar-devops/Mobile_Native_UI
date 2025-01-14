import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const RefreshButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.refreshButton}>
      <Icon name="refresh" size={24} color="#0004ff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  refreshButton: {
    padding: 10,
  },
});

export default RefreshButton;
