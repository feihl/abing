import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/Button';

export default function ViewQuiz({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Details</Text>
      <Text style={styles.description}>
        Here you can view the details of the selected quiz.
      </Text>
      {/* Navigation button to QuizList */}
      <Button 
        title="Back to Quiz List" 
        onPress={() => navigation.navigate('quizList')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
});
