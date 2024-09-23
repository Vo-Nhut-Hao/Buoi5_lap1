import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { db } from './firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const App = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  // Hàm lấy danh sách người dùng
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const userCollection = collection(db, 'users');
      const userSnapshot = await getDocs(userCollection);
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users: ', error);
      Alert.alert('Error', 'Failed to fetch users. Please check your connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm thêm người dùng
  const addUser = async () => {
    if (!name || !email || !age) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const newUser = { name, email, age };
      await addDoc(collection(db, 'users'), newUser);
      Alert.alert('Success', 'User added successfully!');
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error('Error adding user: ', error);
      Alert.alert('Error', 'Failed to add user. Please check your connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm cập nhật người dùng
  const updateUser = async () => {
    if (!editingUserId || !name || !email || !age) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', editingUserId);
      await updateDoc(userRef, { name, email, age });
      Alert.alert('Success', 'User updated successfully!');
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error('Error updating user: ', error);
      Alert.alert('Error', 'Failed to update user. Please check your connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa người dùng
  const deleteUser = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'users', id));
      Alert.alert('Success', 'User deleted successfully!');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user: ', error);
      Alert.alert('Error', 'Failed to delete user. Please check your connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  const editUser = (user) => {
    setEditingUserId(user.id);
    setName(user.name);
    setEmail(user.email);
    setAge(user.age);
  };

  const resetForm = () => {
    setEditingUserId(null);
    setName('');
    setEmail('');
    setAge('');
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Management</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Name" 
        value={name} 
        onChangeText={setName} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Age" 
        value={age} 
        onChangeText={setAge} 
        keyboardType="numeric" 
      />
      <TouchableOpacity style={styles.button} onPress={editingUserId ? updateUser : addUser}>
        <Text style={styles.buttonText}>{editingUserId ? 'Update User' : 'Add User'}</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" style={styles.loading} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
              <Text style={styles.userAge}>{item.age}</Text>
              <View style={styles.userButtons}>
                <TouchableOpacity onPress={() => editUser(item)} style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteUser(item.id)} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userItem: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    textAlign: 'center',
  },
  userAge: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  userButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#FFD700',
    borderRadius: 5,
    padding: 5,
  },
  editButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF4D4D',
    borderRadius: 5,
    padding: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loading: {
    marginTop: 20,
  },
});

export default App;
