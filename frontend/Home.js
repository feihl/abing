import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/Button';

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>MyQuizApp</Text>
      <Button title="Click Here to Start" onPress={() => navigation.navigate('Welcome')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  logo: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
});
