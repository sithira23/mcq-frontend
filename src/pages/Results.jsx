import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getResultById, getQuestionsByExam } from "../services/api";

function Results() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/");
      return;
    }

    setUser(JSON.parse(userData));
    fetchResult();
  }, [resultId, navigate]);

  const fetchResult = async () => {
    try {
      const response = await getResultById(resultId);
      const resultData = response.data;
      setResult(resultData);

      // Fetch questions for this exam to show detailed answers
      if (resultData.examId) {
        const questionsResponse = await getQuestionsByExam(resultData.examId);
        setQuestions(questionsResponse.data || []);
      }
    } catch (error) {
      console.error("Error fetching result:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScorePercentage = () => {
    if (!result || questions.length === 0) return 0;
    return Math.round((result.score / questions.length) * 100);
  };

  const getScoreColor = () => {
    const percentage = getScorePercentage();
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = () => {
    const percentage = getScorePercentage();
    if (percentage >= 80) return "Excellent! 🎉";
    if (percentage >= 60) return "Good job! 👍";
    return "Keep practicing! 💪";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading results...</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Result not found.</p>
          <button
            onClick={() => navigate("/exams")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Exam Results
          </h1>
          <p className="text-gray-600">
            Completed on {new Date(result.timestamp).toLocaleDateString()}
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
          <div className="mb-4">
            <div className={`text-6xl font-bold ${getScoreColor()}`}>
              {result.score}/{questions.length}
            </div>
            <div className={`text-2xl font-semibold ${getScoreColor()}`}>
              {getScorePercentage()}%
            </div>
          </div>

          <div className="text-xl text-gray-700 mb-4">{getScoreMessage()}</div>

          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {result.score}
              </div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {questions.length - result.score}
              </div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {questions.length}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>

        {/* Questions Review */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Question Review
          </h2>

          <div className="space-y-6">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="border-b border-gray-200 pb-6 last:border-b-0"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Question {index + 1}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.score > index
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {result.score > index ? "Correct" : "Incorrect"}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{question.questionText}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {["A", "B", "C", "D"].map((option) => (
                    <div
                      key={option}
                      className={`p-3 rounded border ${
                        question.correctOption === option
                          ? "bg-green-100 border-green-300"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <span className="font-medium mr-2">{option}.</span>
                      <span>{question[`option${option}`]}</span>
                      {question.correctOption === option && (
                        <span className="ml-2 text-green-600 font-medium">
                          ✓ Correct Answer
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="text-center space-x-4">
          <button
            onClick={() => navigate("/exams")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
          >
            Take Another Exam
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md"
          >
            Print Results
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;
