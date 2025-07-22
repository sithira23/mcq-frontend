import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllExams } from "../services/api";

function ExamList() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/");
      return;
    }

    setUser(JSON.parse(userData));
    fetchExams();
  }, [navigate]);

  const fetchExams = async () => {
    try {
      const response = await getAllExams();
      console.log("Full response:", response);
      console.log("Response data:", response.data);
      setExams(response.data || []);
    } catch (error) {
      console.error("Error fetching exams:", error);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const startExam = (examId) => {
    navigate(`/exam/${examId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading exams...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Available Exams
            </h1>
            <p className="text-gray-600">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            Logout
          </button>
        </div>

        {/* Exam Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {exam.title}
              </h3>
              <p className="text-gray-600 mb-4 text-sm">{exam.description}</p>
              <div className="mb-4">
                <span className="text-sm text-blue-600 font-medium">
                  5 Questions • Multiple Choice
                </span>
              </div>
              <button
                onClick={() => startExam(exam.id)}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
              >
                Start Exam
              </button>
            </div>
          ))}
        </div>

        {exams.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No exams available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamList;
