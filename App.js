import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './frontend/welcome';
import CreateQuiz from './frontend/createQuiz'; 
import TakeQuiz from './frontend/takeQuiz';
import quizList from './frontend/quizList';
import Home from './frontend/Home';
import viewquiz from './frontend/viewquiz';
import EditQuiz from './frontend/EditQuiz';

const Stack = createStackNavigator();

function Layout() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="CreateQuiz" component={CreateQuiz} />
      <Stack.Screen name="QuizList" component={quizList} />
      <Stack.Screen name="TakeQuiz" component={TakeQuiz} />
      <Stack.Screen name="viewquiz" component={viewquiz} />
      <Stack.Screen name="EditQuiz" component={EditQuiz} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Layout />
    </NavigationContainer>
  );
}
