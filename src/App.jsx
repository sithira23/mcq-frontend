import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ExamList from "./pages/ExamList";
import ExamTaking from "./pages/ExamTaking";
import Results from "./pages/Results";
import "./App.css"; // Assuming you have some global styles

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/exams" element={<ExamList />} />
          <Route path="/exam/:examId" element={<ExamTaking />} />
          <Route path="/results/:resultId" element={<Results />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
