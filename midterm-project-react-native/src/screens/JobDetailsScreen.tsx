import React, { useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { WebView } from 'react-native-webview';
import { useTheme } from '../context/ThemeContext';

type JobDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'JobDetails'>;

const JobDetailsScreen: React.FC<JobDetailsScreenProps> = ({ route, navigation }) => {
    const { job } = route.params;
    const [webViewHeight, setWebViewHeight] = useState(100);
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const styles = getStyles(isDarkMode);

    const handleApplyNow = () => {
        navigation.navigate('ApplicationForm', { job });
    };

    const handleSubmissionComplete = () => {

        // After successful application submission, navigate back to the JobFinderScreen
        navigation.navigate('JobFinder'); 
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={{ flex: 1 }}>
                <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
                    <Text style={styles.title}>{job.title || 'Untitled Job'}</Text>

                    {job.companyLogo && (
                        <Image source={{ uri: job.companyLogo }} style={styles.companyLogo} resizeMode="contain" />
                    )}

                    <Text style={styles.company}>{job.company || 'Unknown Company'}</Text>
                    <Text style={styles.details}>Salary: {job.salary || '(N/A)'}</Text>
                    <Text style={styles.details}>Category: {job.category || '(N/A)'}</Text>
                    <Text style={styles.details}>Job Type: {job.jobType || '(N/A)'}</Text>
                    <Text style={styles.details}>Work Model: {job.workModel || '(N/A)'}</Text>
                    <Text style={styles.details}>Location: {typeof job.location === 'string' ? job.location : '(N/A)'}</Text>

                    <Text style={styles.sectionTitle}>Job Description:</Text>
                    <View style={[styles.webviewContainer, { height: webViewHeight }]}>
                        <WebView
                            source={{
                                html: `
                                <html>
                                <head>
                                    <meta name="viewport" content="width=device-width, initial-scale=1">
                                    <style>
                                        body { 
                                            font-family: Arial, sans-serif; 
                                            font-size: 16px; 
                                            margin: 0; 
                                            padding: 10px; 
                                            text-align: justify; 
                                            background-color: ${isDarkMode ? '#121212' : '#ffffff'};
                                            color: ${isDarkMode ? '#ffffff' : '#000000'};
                                        }
                                        a { color: #007bff; text-decoration: underline; }
                                    </style>
                                </head>
                                <body>
                                    ${job.description ? job.description : '<p>No description available.</p>'}
                                    <script>
                                        function updateHeight() {
                                            const height = document.body.scrollHeight;
                                            window.ReactNativeWebView.postMessage(JSON.stringify({ height }));
                                        }
                                        window.onload = updateHeight;
                                        window.onresize = updateHeight;
                                    </script>
                                </body>
                                </html>
                                `,
                            }}
                            style={{ flex: 1 }}
                            originWhitelist={['*']}
                            scrollEnabled={false}
                            nestedScrollEnabled={false}
                            onMessage={(event) => {
                                try {
                                    const { height } = JSON.parse(event.nativeEvent.data);
                                    if (height && typeof height === 'number') {
                                        setWebViewHeight(height);
                                    }
                                } catch (error) {
                                    console.error('WebView message parsing error:', error);
                                }
                            }}
                            onShouldStartLoadWithRequest={(event) => {
                                if (event.url.startsWith('http')) {
                                    Linking.openURL(event.url);
                                    return false;
                                }
                                return true;
                            }}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={handleApplyNow}
                    >
                        <Text style={styles.buttonText}>Apply Now</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
        paddingBottom: 20,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
    },
    companyLogo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: isDarkMode ? '#fff' : '#000',
    },
    company: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
        textAlign: 'center',
        color: isDarkMode ? '#ccc' : '#000',
    },
    details: {
        fontSize: 14,
        marginBottom: 5,
        textAlign: 'justify',
        color: isDarkMode ? '#bbb' : '#000',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 5,
        textAlign: 'left',
        color: isDarkMode ? '#fff' : '#000',
    },
    webviewContainer: {
        width: '100%',
        marginBottom: 10,
    },
    button: {
        marginTop: 20,
        padding: 12,
        backgroundColor: 'grey',
        alignItems: 'center',
        borderRadius: 5,
    },
    applyButton: {
        marginTop: 30,
        marginBottom: 10,
        padding: 12,
        backgroundColor: 'green',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default JobDetailsScreen;
