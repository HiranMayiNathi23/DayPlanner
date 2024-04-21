import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadTasks();
    });
    return unsubscribe;
  }, [navigation]);

  const loadTasks = async () => {
    const taskData = await AsyncStorage.getItem('tasks');
    setTasks(taskData ? JSON.parse(taskData) : []);
  };

  const deleteTask = async (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
    Alert.alert("Task Deleted", "The task has been successfully deleted.");
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDetails}>Priority: {item.priority}</Text>
      <Text style={styles.taskDetails}>Deadline: {new Date(item.deadline).toLocaleDateString()}</Text>
      <Button title="Delete" onPress={() => deleteTask(item.id)} color="#ff6347" />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No tasks added yet.</Text>}
      />
      <Button title="Add Task" onPress={() => navigation.navigate('AddTask')} color="#1e90ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  taskItem: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskDetails: {
    fontSize: 16,
    color: '#666',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;