import { Job } from '../types';
import uuid from 'react-native-uuid';
import { decode } from 'html-entities'; 

export const fetchJobs = async (): Promise<Job[]> => {
  try {
    const response = await fetch('https://empllo.com/api/v1');

    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Raw API Response:", JSON.stringify(data, null, 2));

    if (!data.jobs || !Array.isArray(data.jobs)) {
      console.error("Unexpected API response format:", data);
      return [];
    }

    return data.jobs.map((job: any) => {
      console.log("Job Data:", job);

      const salaryText = job.minSalary && job.maxSalary
        ? `$${job.minSalary} - $${job.maxSalary}`
        : "(N/A)";

      return {
        id: job.id ? job.id.toString() : uuid.v4() as string,
        title: job.title?.trim() || "Untitled Job",
        company: job.companyName || "(N/A)",
        companyLogo: job.companyLogo || null, 
        salary: salaryText,
        location: Array.isArray(job.locations) && job.locations.length > 0
          ? job.locations.join(', ')
          : (typeof job.locations === 'string' ? job.locations : "(N/A)"),
        jobType: job.jobType && typeof job.jobType === 'string'
          ? job.jobType
          : "(N/A)",
        workModel: job.workModel && typeof job.workModel === 'string'
          ? job.workModel
          : "(N/A)",
        category: job.mainCategory && typeof job.mainCategory === 'string'
          ? job.mainCategory
          : "(N/A)",
        description: job.description && typeof job.description === 'string'
          ? decode(job.description.trim())
          : "No description available.",
      };
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};