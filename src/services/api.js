import axios from "axios";

const API_BASE_URL = "http://localhost:8005/api";
export const api = axios.create({
  baseURL: API_BASE_URL,
});

//Auth APIs
export const loginUser = (credentials) => {
  return api.post("/users/login", credentials);
};

//Exam APIs
export const getAllExams = () => {
  api.get("/exams");
};

export const getQuestionsByExam = (examId) => {
  api.get(`/questions/exams/${examId}`);
};

//Result APIs
export const submitResult = (resultData) => {
  api.post("/results", resultData);
};

export const getResultsById = (resultId) => {
  api.get(`/results/${resultId}`);
};
