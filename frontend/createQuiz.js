import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Button, ScrollView } from 'react-native';
import { api } from '../services/api'; // Import API from services folder// Import the API utility

export default function CreateQuiz({ navigation }) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newChoices, setNewChoices] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');

  const handleAddQuestion = () => {
    if (newQuestion && correctAnswer && newChoices.every(choice => choice.trim())) {
      setQuestions([...questions, {
        question_text: newQuestion,
        choices: newChoices,
        correct_answer: correctAnswer,
      }]);
      setNewQuestion('');
      setNewChoices(['', '', '', '']);
      setCorrectAnswer('');
    } else {
      Alert.alert('Validation', 'Please fill in all question fields.');
    }
  };

  const handleSubmitQuiz = async () => {
    if (!title || !description || !category || !level || !topic || questions.length === 0) {
      Alert.alert('Validation', 'Please fill all fields!');
      return;
    }

    const quizData = { title, description, category, level, topic, questions };
    const { success, data, error } = await api.post('/quizzes', quizData);

    if (success) {
      Alert.alert('Success', 'Quiz created successfully!');
      navigation.navigate('Home');
    } else {
      Alert.alert('Error', data?.detail || error || 'Failed to create quiz');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {step === 1 && (
        <View style={styles.stepContainer}>
          <TextInput
            placeholder="Quiz Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />
          <Button title="Next" onPress={() => setStep(2)} />
        </View>
      )}

      {step === 2 && (
        <View style={styles.stepContainer}>
          <TextInput
            placeholder="Category (e.g. Math)"
            value={category}
            onChangeText={setCategory}
            style={styles.input}
          />
          <TextInput
            placeholder="Level (e.g. Beginner)"
            value={level}
            onChangeText={setLevel}
            style={styles.input}
          />
          <TextInput
            placeholder="Topic (e.g. Algebra)"
            value={topic}
            onChangeText={setTopic}
            style={styles.input}
          />
          <Button title="Next" onPress={() => setStep(3)} />
        </View>
      )}

      {step === 3 && (
        <View style={styles.stepContainer}>
          <TextInput
            placeholder="Enter Question"
            value={newQuestion}
            onChangeText={setNewQuestion}
            style={styles.input}
          />
          <TextInput
            placeholder="Choice A"
            value={newChoices[0]}
            onChangeText={(text) => setNewChoices([text, newChoices[1], newChoices[2], newChoices[3]])}
            style={styles.input}
          />
          <TextInput
            placeholder="Choice B"
            value={newChoices[1]}
            onChangeText={(text) => setNewChoices([newChoices[0], text, newChoices[2], newChoices[3]])}
            style={styles.input}
          />
          <TextInput
            placeholder="Choice C"
            value={newChoices[2]}
            onChangeText={(text) => setNewChoices([newChoices[0], newChoices[1], text, newChoices[3]])}
            style={styles.input}
          />
          <TextInput
            placeholder="Choice D"
            value={newChoices[3]}
            onChangeText={(text) => setNewChoices([newChoices[0], newChoices[1], newChoices[2], text])}
            style={styles.input}
          />
          <TextInput
            placeholder="Correct Answer (A, B, C, D)"
            value={correctAnswer}
            onChangeText={setCorrectAnswer}
            style={styles.input}
          />
          <Button title="Add Question" onPress={handleAddQuestion} />
          <Button title="Next" onPress={() => setStep(4)} />
        </View>
      )}

      {step === 4 && (
        <View style={styles.stepContainer}>
          <Button
            title="Save Quiz"
            onPress={handleSubmitQuiz}
            disabled={questions.length === 0}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  stepContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#000',
  },
});
