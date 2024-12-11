import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Timer from '../../components/Timer';
import Button from '../../components/Button';

export default function TakeQuiz({ navigation }) {
  const [score, setScore] = useState(null);

  const handleSubmitQuiz = () => {
    // Logic to calculate and display score
    const calculatedScore = Math.floor(Math.random() * 100); // Example logic
    setScore(calculatedScore);
  };

  return (
    <View style={styles.container}>
      <Timer minutes={20} />
      <Text style={styles.message}>Answer the following questions:</Text>
      {/* Add questions rendering logic here */}
      <Button title="Submit Quiz" onPress={handleSubmitQuiz} />
      {score !== null && <Text>Your Score: {score}</Text>}
      <Button title="Retake Quiz" onPress={() => navigation.navigate('TakeQuiz')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  message: { fontSize: 18, marginBottom: 20 },
});
