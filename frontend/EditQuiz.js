import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { api } from '../services/api'; // Ensure this matches your service structure

export default function EditQuiz({ route, navigation }) {
  const { quizId } = route.params || {};
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    topic: '',
  });

  // Fetch quiz data for editing
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { success, data, error } = await api.get(`/quizzes/${quizId}`);
        if (success) {
          setQuizData({
            title: data.title,
            description: data.description,
            category: data.category,
            level: data.level,
            topic: data.topic,
          });
        } else {
          Alert.alert('Error', error || 'Failed to load quiz data.');
        }
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        Alert.alert('Error', 'Failed to load quiz data.');
      }
    };

    if (quizId) fetchQuiz();
  }, [quizId]);

  // Handle form submission for updating quiz
  const handleUpdateQuiz = async () => {
    try {
      const { success, error } = await api.put(`/quizzes/${quizId}`, quizData);
      if (success) {
        Alert.alert('Success', 'Quiz updated successfully');
        navigation.goBack(); // Go back to the previous screen
      } else {
        Alert.alert('Error', error || 'Failed to update quiz');
      }
    } catch (error) {
      console.error('Error updating quiz:', error);
      Alert.alert('Error', 'Failed to update quiz');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title"
        value={quizData.title}
        onChangeText={(text) => setQuizData({ ...quizData, title: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={quizData.description}
        onChangeText={(text) => setQuizData({ ...quizData, description: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Category"
        value={quizData.category}
        onChangeText={(text) => setQuizData({ ...quizData, category: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Level"
        value={quizData.level}
        onChangeText={(text) => setQuizData({ ...quizData, level: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Topic"
        value={quizData.topic}
        onChangeText={(text) => setQuizData({ ...quizData, topic: text })}
        style={styles.input}
      />

      <Button title="Update Quiz" onPress={handleUpdateQuiz} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  input: { marginBottom: 15, padding: 10, borderWidth: 1, borderRadius: 5 },
});
