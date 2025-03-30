import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Keyboard, TouchableWithoutFeedback, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useJobContext } from "../context/JobContext";
import { useTheme } from "../context/ThemeContext";

type ApplicationFormScreenRouteProp = RouteProp<RootStackParamList, "ApplicationForm">;
type ApplicationFormScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "ApplicationForm">;

type Props = {
  route: ApplicationFormScreenRouteProp;
  navigation: ApplicationFormScreenNavigationProp;
};

const ApplicationFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { applyForJob } = useJobContext();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const { job } = route.params;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const styles = getStyles(isDarkMode);

  useEffect(() => {
    if (!job) {
      Alert.alert("Error", "No job details provided", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    }
  }, [job]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone);
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    setIsSubmitting(true);

    if (!name || !email || !contactNumber || !reason) {
      Alert.alert("Error", "All fields are required");
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    if (!validatePhone(contactNumber)) {
      Alert.alert("Error", "Please enter a valid phone number");
      setIsSubmitting(false);
      return;
    }

    const appliedJob = {
      ...job,
      applicant: { name, email, contactNumber, reason },
      appliedDate: new Date().toISOString()
    };

    applyForJob(appliedJob);

    Alert.alert(
      "Application Submitted",
      `Your application for ${job.title} at ${job.company} has been submitted successfully!`,
      [
        {
          text: "OK",
          onPress: () => {
            // Reset form
            setName("");
            setEmail("");
            setContactNumber("");
            setReason("");
            setIsSubmitting(false);
            
            // Always navigate to JobFinderScreen after submission
            navigation.reset({
              index: 0, 
              routes: [{ name: 'JobFinder' }] 
            });            
          }
        }
      ]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (!job) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.noJobContainer}>
          <Text style={styles.noJobText}>No job selected</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Apply for {job.title}</Text>
            <Text style={styles.company}>{job.company}</Text>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
              value={name}
              onChangeText={setName}
              returnKeyType="next"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />

            <Text style={styles.label}>Contact Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
              value={contactNumber}
              onChangeText={setContactNumber}
              keyboardType="phone-pad"
              returnKeyType="next"
            />

            <Text style={styles.label}>Why should we hire you?</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Explain your qualifications and why you're a good fit"
              placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              blurOnSubmit={true}
            />

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.backButton]} 
              onPress={handleBack}
            >
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  noJobContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noJobText: {
    fontSize: 18,
    color: isDarkMode ? '#fff' : '#000',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: isDarkMode ? '#fff' : '#000',
    textAlign: 'center',
  },
  company: {
    fontSize: 16,
    color: isDarkMode ? '#aaa' : '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    color: isDarkMode ? '#fff' : '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: isDarkMode ? '#333' : '#ddd',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: isDarkMode ? '#fff' : '#000',
    backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: isDarkMode ? '#333' : '#ddd',
    borderRadius: 5,
    padding: 12,
    height: 120,
    marginBottom: 20,
    fontSize: 16,
    color: isDarkMode ? '#fff' : '#000',
    backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    opacity: 1,
    marginBottom: 15,
  },
  backButton: {
    backgroundColor: 'gray',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ApplicationFormScreen;