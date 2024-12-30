import { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Function to handle login
  const handleLogin = async () => {
    try {
      // Retrieve users from AsyncStorage
      const storedUsers = await AsyncStorage.getItem("registeredUsers");
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Check if user exists
      const user = users.find((user: { email: string; password: string }) => user.email === email && user.password === password);
      if (user) {
        Alert.alert("Success", "Login successful");
        navigation.navigate("Home", { username: user.username });
      } else {
        Alert.alert("Error", "Invalid email or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

 // Function to handle navigation to the Sign-Up screen
  const handleSignUp = () => {
    // Navigate to the sign-up page
    navigation.navigate("Register");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.title}>BookMyShow</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.signUpContainer} onPress={handleSignUp}>
          <Text style={styles.signUpText}>
            Don't have an account? <Text style={styles.signUpLink}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loginContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#E31E72",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#E31E72",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpContainer: {
    marginTop: 10,
  },
  signUpText: {
    fontSize: 14,
    color: "#555",
  },
  signUpLink: {
    color: "#E31E72",
    fontWeight: "bold",
  },
});
