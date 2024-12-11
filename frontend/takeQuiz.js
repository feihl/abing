import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Button } from 'react-native';
import { api } from '../services/api'; // Import API service

export default function TakeQuiz({ route }) {
  const { quizId } = route.params || {};
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);

  const fetchQuiz = async () => {
    const { success, data, error } = await api.get(`/quizzes/${quizId}`);
    if (success) {
      console.log('Quiz Data:', data); // Inspect the structure

      // Split choices string into an array
      const sanitizedQuestions = data.questions.map((question) => ({
        ...question,
        choices: typeof question.choices === 'string' ? question.choices.split(',') : [],
      }));

      setQuiz({ ...data, questions: sanitizedQuestions });

      // Initialize answers array with null for each question
      setAnswers(new Array(sanitizedQuestions.length).fill(null));
    } else {
      Alert.alert('Error', 'Failed to fetch quiz.');
      console.error(error);
    }
  };

  useEffect(() => {
    if (quizId) fetchQuiz();
  }, [quizId]);

  const handleAnswerSelect = (questionIndex, selectedChoice) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = selectedChoice;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    const { success, data, error } = await api.post('/attempts', {
      quiz_id: quizId,
      user_answers: answers,
    });
    if (success) {
      setScore(data.score);
    } else {
      Alert.alert('Error', 'Failed to submit quiz.');
      console.error(error);
    }
  };

  if (!quiz) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{quiz.title}</Text>
      {quiz.questions?.map((question, index) => (
        <View key={index} style={styles.question}>
          <Text>{question.question_text}</Text>
          {question.choices.map((choice, idx) => (
            <Button
              key={idx}
              title={choice}
              onPress={() => handleAnswerSelect(index, choice)}
              color={answers[index] === choice ? 'green' : undefined} // Highlight selected choice
            />
          ))}
        </View>
      ))}
      <Button title="Submit Quiz" onPress={handleSubmit} />
      {score !== null && <Text>Your score: {score}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 24, marginBottom: 20 },
  question: { marginBottom: 20 },
});
