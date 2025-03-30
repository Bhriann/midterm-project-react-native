import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Define the navigation stack structure
export type RootStackParamList = {
  JobFinder: undefined;
  SavedJobs: undefined;
  AppliedJobs: undefined;
  JobDetails: { job: any }; 
  ApplicationForm: { job: any }; 
  Main: undefined;
};

// Define props for each screen
export type JobFinderScreenProps = NativeStackScreenProps<RootStackParamList, 'JobFinder'>;
export type JobDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'JobDetails'>;
export type SavedJobsScreenProps = NativeStackScreenProps<RootStackParamList, 'SavedJobs'>;
export type AppliedJobsScreenProps = NativeStackScreenProps<RootStackParamList, 'AppliedJobs'>;
  
