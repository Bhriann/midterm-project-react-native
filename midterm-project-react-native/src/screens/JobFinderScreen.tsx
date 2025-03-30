import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchJobs } from '../api/jobs';
import { useJobContext } from '../context/JobContext';
import { useTheme } from '../context/ThemeContext';
import { Job } from '../types';

const JobFinderScreen = ({ navigation }: any) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const { saveJob, removeJob, savedJobs } = useJobContext();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const fetchedJobs = await fetchJobs();
        setJobs(Array.isArray(fetchedJobs) ? fetchedJobs : []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      }
    };
    loadJobs();
  }, []);

  const filteredJobs = useCallback(() => {
    return jobs.filter(job => job.title?.toLowerCase().includes(search.toLowerCase()));
  }, [jobs, search]);

  return (
    <SafeAreaView style={[styles.safeContainer, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
      <View style={styles.container}>
        <TouchableOpacity onPress={toggleTheme} style={styles.toggleButton}>
          <Text style={styles.buttonText}>Toggle Theme</Text>
        </TouchableOpacity>

        <TextInput
          style={[styles.searchBar, theme === 'dark' ? styles.darkInput : styles.lightInput]}
          placeholder="Search jobs..."
          placeholderTextColor={theme === 'dark' ? '#ccc' : '#333'}
          value={search}
          onChangeText={setSearch}
        />

        <FlatList
          data={filteredJobs()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isSaved = savedJobs.some(j => j.id === item.id);
            return (
              <View style={[styles.jobCard, theme === 'dark' ? styles.darkCard : styles.lightCard]}>
                <Text style={[styles.title, theme === 'dark' ? styles.darkText : styles.lightText]}>
                  {item.title || "No Title Available"}
                </Text>
                <Text style={[styles.company, theme === 'dark' ? styles.darkText : styles.lightText]}>
                  {item.company || "Unknown Company"}
                </Text>
                <Text style={[styles.salary, theme === 'dark' ? styles.darkText : styles.lightText]}>
                  Salary: {item.salary !== "N/A" ? item.salary : "(N/A)"}
                </Text>

                <TouchableOpacity onPress={() => navigation.navigate('Search', { screen: 'JobDetails', params: { job: item }})}>
                  <Text style={styles.viewMoreText}>More</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={isSaved ? styles.unsaveButton : styles.button}
                  onPress={() => isSaved ? removeJob(item.id) : saveJob(item)}
                >
                  <Text style={styles.buttonText}>{isSaved ? "Unsave" : "Save Job"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.applyButton} onPress={() => navigation.navigate('ApplicationForm', { job: item })}>
                  <Text style={styles.buttonText}>Apply</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          ListEmptyComponent={<Text style={styles.emptyText}>No jobs found</Text>}
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

  searchBar: { padding: 8, borderBottomWidth: 1, marginBottom: 10 },
  lightInput: { backgroundColor: '#fff', color: '#000' },
  darkInput: { backgroundColor: '#333', color: '#fff' },

  jobCard: { padding: 10, borderBottomWidth: 1, marginBottom: 10, borderRadius: 8 },
  lightCard: { backgroundColor: '#f9f9f9', borderColor: '#ccc' },
  darkCard: { backgroundColor: '#1e1e1e', borderColor: '#444' },

  title: { fontSize: 16, fontWeight: 'bold' },
  company: { fontSize: 14, color: '#555' },
  salary: { fontSize: 14, marginTop: 2 },

  lightText: { color: '#000' },
  darkText: { color: '#fff' },

  button: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 5 },
  unsaveButton: { backgroundColor: 'red', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 5 },
  applyButton: { backgroundColor: 'green', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 5 },

  buttonText: { color: 'white', fontWeight: 'bold' },
  viewMoreText: { color: 'blue', fontSize: 16, alignSelf: 'flex-start', marginBottom: 8 },
  emptyText: { textAlign: 'center', marginTop: 20, color: 'gray' },

  toggleButton: { backgroundColor: '#444', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 10 }
});

export default JobFinderScreen;