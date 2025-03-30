import React from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useJobContext } from '../context/JobContext';
import { useTheme } from '../context/ThemeContext';
import { Job } from '../types';

const SavedJobsScreen = ({ navigation }: any) => {
  const { savedJobs, removeJob } = useJobContext();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <SafeAreaView style={[styles.safeContainer, isDarkMode ? styles.darkBackground : styles.lightBackground]}>
      <View style={styles.container}>

        {/* 🔹 Theme Toggle Button */}
        <TouchableOpacity onPress={toggleTheme} style={styles.toggleButton}>
          <Text style={styles.buttonText}>Toggle Theme</Text>
        </TouchableOpacity>

        <FlatList
          data={savedJobs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.jobCard, isDarkMode ? styles.darkCard : styles.lightCard]}>
              <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>
                {item.title || "No Title Available"}
              </Text>
              <Text style={[styles.company, isDarkMode ? styles.darkText : styles.lightText]}>
                {item.company || "Unknown Company"}
              </Text>
              <Text style={[styles.salary, isDarkMode ? styles.darkText : styles.lightText]}>
                Salary: {item.salary !== "N/A" ? item.salary : "(N/A)"}
              </Text>

              <TouchableOpacity style={styles.removeButton} onPress={() => removeJob(item.id)}>
                <Text style={styles.buttonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No saved jobs</Text>}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  container: { flex: 1, padding: 10 },

  lightBackground: { backgroundColor: '#fff' },
  darkBackground: { backgroundColor: '#121212' },

  jobCard: { padding: 10, borderBottomWidth: 1, marginBottom: 10, borderRadius: 8 },
  lightCard: { backgroundColor: '#f9f9f9', borderColor: '#ccc' },
  darkCard: { backgroundColor: '#1e1e1e', borderColor: '#444' },

  title: { fontSize: 16, fontWeight: 'bold' },
  company: { fontSize: 14, color: '#555' },
  salary: { fontSize: 14, marginTop: 2 },

  lightText: { color: '#000' },
  darkText: { color: '#fff' },

  removeButton: { backgroundColor: 'red', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 5 },
  buttonText: { color: 'white', fontWeight: 'bold' },

  toggleButton: { backgroundColor: '#444', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
  emptyText: { textAlign: 'center', marginTop: 20, color: 'gray' },
});

export default SavedJobsScreen;