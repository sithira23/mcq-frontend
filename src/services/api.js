import axios from "axios";

const API_BASE_URL = "http://localhost:8005/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth APIs - keep as is since login works
export const loginUser = (credentials) => api.post("/users/login", credentials);

// Exam APIs - return the full response
export const getAllExams = () => api.get("/exams");

export const getQuestionsByExam = (examId) =>
  api.get(`/questions/exam/${examId}`);

// Result APIs
export const submitResult = (resultData) => api.post("/results", resultData);

export const getResultById = (resultId) => api.get(`/results/${resultId}`);
