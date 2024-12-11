import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Picker } from 'react-native';
import Button from '../../components/Button';

export default function CreateQuiz({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [topic, setTopic] = useState('');

  const handleSaveQuiz = () => {
    // Logic to save the quiz
    console.log('Quiz Saved:', { title, description, category, level, topic });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Quiz</Text>
      <TextInput
        style={styles.input}
        placeholder="Quiz Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Picker
        selectedValue={category}
        style={styles.input}
        onValueChange={(itemValue) => setCategory(itemValue)}
      >
        <Picker.Item label="Select Category" value="" />
        <Picker.Item label="Math" value="math" />
        <Picker.Item label="Science" value="science" />
        <Picker.Item label="History" value="history" />
      </Picker>
      <Picker
        selectedValue={level}
        style={styles.input}
        onValueChange={(itemValue) => setLevel(itemValue)}
      >
        <Picker.Item label="Select Level" value="" />
        <Picker.Item label="Beginner" value="beginner" />
        <Picker.Item label="Intermediate" value="intermediate" />
        <Picker.Item label="Advanced" value="advanced" />
      </Picker>
      <Picker
        selectedValue={topic}
        style={styles.input}
        onValueChange={(itemValue) => setTopic(itemValue)}
      >
        <Picker.Item label="Select Topic" value="" />
        <Picker.Item label="Algebra" value="algebra" />
        <Picker.Item label="Physics" value="physics" />
        <Picker.Item label="World History" value="world-history" />
      </Picker>
      <Button title="Save Quiz" onPress={handleSaveQuiz} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});
