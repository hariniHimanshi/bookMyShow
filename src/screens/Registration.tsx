import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = ({ navigation }: any) => {
  // State for form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // State for password visibility toggle
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // State for form errors
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Function to validate form inputs
  const validateForm = () => {
    let valid = true;
    const newErrors = { username: '', email: '', password: '', confirmPassword: '' };

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
      valid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Function to handle user registration
  const handleRegister = async () => {
    try {
      if (validateForm()) {
        const storedUsers = await AsyncStorage.getItem('registeredUsers');
        const users = storedUsers ? JSON.parse(storedUsers) : [];
        if (users.some((user: { email: string }) => user.email === formData.email)) {
          Alert.alert('Error', 'Email is already registered');
          return;
        }
        // Add new user
        const updatedUsers = [...users, formData];
        await AsyncStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

        Alert.alert('Success', 'User registered successfully');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Create an Account</Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={[styles.input, errors.username ? styles.inputError : null]}
              placeholder="Enter username"
              value={formData.username}
              onChangeText={(text) => setFormData({ ...formData, username: text })}
            />
            {errors.username ? <Text style={styles.error}>{errors.username}</Text> : null}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              placeholder="Enter email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
            />
            {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.password ? styles.inputError : null]}
                placeholder="Enter password"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry={!passwordVisible}
              />
              <TouchableOpacity
                style={styles.togglePasswordButton}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <FontAwesome name={passwordVisible ? 'eye-slash' : 'eye'} size={20} color="#E31E72" />
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                secureTextEntry={!confirmPasswordVisible}
              />
              <TouchableOpacity
                style={styles.togglePasswordButton}
                onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              >
                <FontAwesome name={confirmPasswordVisible ? 'eye-slash' : 'eye'} size={20} color="#E31E72" />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? <Text style={styles.error}>{errors.confirmPassword}</Text> : null}
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginRedirect}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginRedirectText}>
              Already have an account? <Text style={styles.loginLink}>Login here</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  flexContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E31E72',
    marginBottom: 30,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  togglePasswordButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    width: '100%',
    paddingRight: 40, 
  },
  inputError: {
    borderColor: 'red',
  },
  error: {
    color: 'red',
    marginTop: 5,
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: '#E31E72',
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginRedirect: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginRedirectText: {
    fontSize: 16,
    color: '#333',
  },
  loginLink: {
    color: '#E31E72',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
