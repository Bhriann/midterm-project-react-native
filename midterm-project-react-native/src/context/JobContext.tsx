import React, { createContext, useContext, useState } from "react";
import { Job } from "../types";

type JobContextType = {
  savedJobs: Job[];
  appliedJobs: Job[];  // ✅ Store applied jobs
  saveJob: (job: Job) => void;
  removeJob: (id: string) => void;
  applyForJob: (job: Job) => void; // ✅ Function to apply for a job
};

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]); // ✅ Track applied jobs

  const saveJob = (job: Job) => {
    if (!savedJobs.some((j) => j.id === job.id)) {
      setSavedJobs([...savedJobs, job]);
    }
  };

  const removeJob = (id: string) => {
    setSavedJobs(savedJobs.filter((job) => job.id !== id));
  };

  const applyForJob = (job: Job) => {
    if (!appliedJobs.some((j) => j.id === job.id)) {
      setAppliedJobs([...appliedJobs, job]); // ✅ Add to applied jobs
    }
  };

  return (
    <JobContext.Provider value={{ savedJobs, appliedJobs, saveJob, removeJob, applyForJob }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error("useJobContext must be used within a JobProvider");
  }
  return context;
};