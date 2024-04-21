import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet,  Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';


const AddTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const saveTask = async () => {
    const task = { id: Date.now(), title, priority, deadline: deadline.toISOString() };
    const storedTasks = await AsyncStorage.getItem('tasks');
    const tasks = storedTasks ? JSON.parse(storedTasks) : [];
    tasks.push(task);
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    navigation.goBack();
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || deadline;
    setShowDatePicker(Platform.OS === 'ios');
    setDeadline(currentDate);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter Task"
      />
      <Picker
        selectedValue={priority}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => setPriority(itemValue)}
      >
        <Picker.Item label="Low" value="Low" />
        <Picker.Item label="Normal" value="Normal" />
        <Picker.Item label="High" value="High" />
      </Picker>
      <Button title="Set Deadline" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={deadline}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
        />
      )}
      <Button title="Save Task" onPress={saveTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: '#7a42f4',
    borderWidth: 1,
    padding: 10,
  },
  picker: {
    margin: 15,
    height: 40,
  },
});

export default AddTaskScreen;