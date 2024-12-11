import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { api } from '../services/api';
import { MaterialIcons } from '@expo/vector-icons';

const ViewQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  // Function to fetch quizzes from the backend
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/quizzes');

      if (response.success) {
        setQuizzes(response.data);
      } else {
        Alert.alert('Error', 'Failed to fetch quizzes. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a quiz
  const deleteQuiz = async (id) => {
    try {
      const response = await api.delete(`/quizzes/${id}`);
      if (response.success) {
        setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== id));
        Alert.alert('Success', 'Quiz deleted successfully.');
      } else {
        Alert.alert('Error', 'Failed to delete quiz. Please try again later.');
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  // Function to open edit modal
  const editQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setEditedTitle(quiz.title);
    setEditedDescription(quiz.description);
    setModalVisible(true);
  };

  // Function to save edited quiz
  const saveEdit = async () => {
    try {
      const response = await api.put(`/quizzes/${selectedQuiz.id}`, {
        title: editedTitle,
        description: editedDescription,
      });
      if (response.success) {
        setQuizzes((prevQuizzes) =>
          prevQuizzes.map((quiz) =>
            quiz.id === selectedQuiz.id ? { ...quiz, title: editedTitle, description: editedDescription } : quiz
          )
        );
        setModalVisible(false);
        Alert.alert('Success', 'Quiz updated successfully.');
      } else {
        Alert.alert('Error', response.error || 'Failed to update quiz.');
      }
    } catch (error) {
      console.error('Error saving quiz edit:', error.message || error);
      Alert.alert('Error', error.message || 'An unexpected error occurred.');
    }
  };

  // UseEffect to call fetchQuizzes on component mount
  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Render item for FlatList
  const renderItem = ({ item }) => (
    <View style={styles.quizCard}>
      <View style={styles.quizContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.info}>Category: {item.category}</Text>
        <Text style={styles.info}>Level: {item.level}</Text>
        <Text style={styles.info}>Topic: {item.topic}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => editQuiz(item)}>
          <MaterialIcons name="edit" size={24} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteQuiz(item.id)}>
          <MaterialIcons name="delete" size={24} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={quizzes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyText}>No quizzes available</Text>}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Quiz</Text>
            <TextInput
              style={styles.input}
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="Title"
            />
            <TextInput
              style={styles.input}
              value={editedDescription}
              onChangeText={setEditedDescription}
              placeholder="Description"
              multiline
            />
            <View style={styles.modalActions}>
              <Button title="Save" onPress={saveEdit} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="#F44336" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  quizCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quizContent: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  info: {
    fontSize: 12,
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ViewQuiz;
