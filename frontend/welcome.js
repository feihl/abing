import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/Button';

export default function Welcome({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Hello! It's time to take a quiz.</Text>
      <Button title="Create Quiz" onPress={() => navigation.navigate('CreateQuiz')} />
      <Button title="Take Quiz" onPress={() => navigation.navigate('QuizList')} />
      <Button title="View Quiz" onPress={() => navigation.navigate('viewquiz')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  message: { fontSize: 20, marginBottom: 20 },
});
