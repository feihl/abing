import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import { api } from '../services/api'; // Import the API utility

export default function QuizList({ navigation }) {
  const [quizzes, setQuizzes] = useState([]);

  // Fetch quizzes from the backend
  useEffect(() => {
    const fetchQuizzes = async () => {
      const { success, data, error } = await api.get('/quizzes');
      if (success) {
        setQuizzes(data);
      } else {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  const renderQuiz = ({ item }) => (
    <View style={styles.quizItem}>
      <Text style={styles.quizTitle}>{item.title}</Text>
      <Button
        title="Take Quiz"
        onPress={() => navigation.navigate('TakeQuiz', { quizId: item.id })} // Pass quizId
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Quizzes</Text>
      <FlatList
        data={quizzes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderQuiz}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  quizItem: { marginBottom: 20 },
  quizTitle: { fontSize: 18, fontWeight: 'bold' },
});
