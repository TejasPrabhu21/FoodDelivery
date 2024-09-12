import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const Contact = () => {
  const handleCall = () => {
    Linking.openURL('tel:+919538505031');
  };
  const handleEmail = () => {
    Linking.openURL('mailto:udupikinaraffpcltd@gmail.com');
  };

  return (
    <SafeAreaView className="flex-1" >
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Contact Us</Text>

      <View style={styles.contactItem}>
        <MaterialIcons name="call" size={28} color="#9F5216"  />
        <View style={styles.contactInfo}>
          <Text style={styles.title}>Call us</Text>
          <TouchableOpacity onPress={handleCall}>
            <Text style={styles.text}>+91 9538505031</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contactItem}>
        <FontAwesome name="envelope" size={28} color="#9F5216"  />
        <View style={styles.contactInfo}>
          <Text style={styles.title}>Send us a message</Text>
          <TouchableOpacity onPress={handleEmail}>
            <Text style={styles.text}>udupikinaraffpcltd@gmail.com</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contactItem}>
        <MaterialIcons name="location-on" size={28} color="#9F5216"  />
        <View style={styles.contactInfo}>
          <Text style={styles.title}>Address</Text>
          <Text style={styles.text}>Canara, Barebail,</Text>
          <Text style={styles.text}>Mangalore 575004</Text>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:15,
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "#9F5216" ,
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  contactInfo: {
    marginLeft: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
});

export default Contact;
