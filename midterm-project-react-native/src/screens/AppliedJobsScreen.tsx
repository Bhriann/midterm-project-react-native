import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useJobContext } from "../context/JobContext";
import { useTheme } from "../context/ThemeContext";

const AppliedJobsScreen = () => {
  const { appliedJobs } = useJobContext();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <View style={[styles.container, isDarkMode ? styles.darkBackground : styles.lightBackground]}>
      
      {/* Toggle Theme Button */}
      <TouchableOpacity onPress={toggleTheme} style={styles.toggleButton}>
        <Text style={styles.buttonText}>Toggle Theme</Text>
      </TouchableOpacity>

      <FlatList
        data={appliedJobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.jobCard, isDarkMode ? styles.darkCard : styles.lightCard]}>
            <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>{item.title}</Text>
            <Text style={[styles.company, isDarkMode ? styles.darkText : styles.lightText]}>{item.company}</Text>
            <Text style={[styles.salary, isDarkMode ? styles.darkText : styles.lightText]}>Salary: {item.salary || "N/A"}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No applied jobs</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  lightBackground: { backgroundColor: "#fff" },
  darkBackground: { backgroundColor: "#121212" },
  
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  
  jobCard: { padding: 10, borderBottomWidth: 1, marginBottom: 10, borderRadius: 8 },
  lightCard: { backgroundColor: "#f9f9f9", borderColor: "#ccc" },
  darkCard: { backgroundColor: "#1e1e1e", borderColor: "#444" },
  
  title: { fontSize: 16, fontWeight: "bold" },
  company: { fontSize: 14, color: "#555" },
  salary: { fontSize: 14, marginTop: 2 },
  
  lightText: { color: "#000" },
  darkText: { color: "#fff" },
  
  toggleButton: { backgroundColor: "#444", padding: 10, borderRadius: 5, alignItems: "center", marginBottom: 10 },
  buttonText: { color: "white", fontWeight: "bold" },
  emptyText: { textAlign: "center", marginTop: 20, color: "gray" },
});

export default AppliedJobsScreen;