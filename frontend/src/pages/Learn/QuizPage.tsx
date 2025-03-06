// src/pages/Learn/QuizPage.tsx
import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaCheck, FaTimes } from "react-icons/fa";
import { QuizQuestion } from "../../models";
import {
  getQuizQuestions,
  submitQuizResults,
} from "../../services/learnService";
import { useAuth } from "../../store/AuthContext";

const QuizPage = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const region = searchParams.get("region");
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      if (!category) return;

      setIsLoading(true);
      setError(null);

      try {
        // Pass region as a parameter if it exists
        const fetchedQuestions = await getQuizQuestions(
          category,
          region || undefined
        );
        setQuestions(fetchedQuestions);
      } catch (err: any) {
        console.error("Error fetching quiz questions:", err);
        setError(err.message || "Failed to load quiz questions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizQuestions();
  }, [category, region]);

  const getCategoryTitle = () => {
    if (!category) return "Quiz";

    // Convert category ID to display name
    switch (category) {
      case "mammals":
        return "Mammals";
      case "birds":
        return "Birds";
      case "marine":
        return "Marine Life";
      case "plants":
        return "Plants";
      case "insects":
        return "Insects";
      case "reptiles":
        return "Reptiles";
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(answer);
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer || isAnswerSubmitted) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
    }

    setIsAnswerSubmitted(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = async () => {
    setQuizCompleted(true);

    // Submit results if user is logged in
    if (user && category) {
      try {
        await submitQuizResults(
          user.id,
          category,
          score,
          questions.length,
          region || undefined
        );
      } catch (err) {
        console.error("Error submitting quiz results:", err);
      }
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto bg-red-50 p-6 rounded-lg text-center">
        <p className="text-red-700 mb-4">{error}</p>
        <Link
          to="/learn"
          className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Back to Learning Center
        </Link>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Quiz Completed!</h1>

        <div className="text-center mb-8">
          <div className="inline-block bg-green-100 p-6 rounded-full mb-4">
            <FaCheck className="text-green-600 text-4xl" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Your Score: {score} out of {questions.length}
          </h2>
          <p className="text-gray-600">
            {score / questions.length >= 0.7
              ? "Great job! You have a good understanding of this topic."
              : "Keep learning! Try again to improve your score."}
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={restartQuiz}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Take Quiz Again
          </button>
          <Link
            to="/learn"
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto bg-yellow-50 p-6 rounded-lg text-center">
        <p className="text-yellow-700 mb-4">
          No questions available for this category.
        </p>
        <Link
          to="/learn"
          className="inline-block bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          Back to Learning Center
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link
          to="/learn"
          className="flex items-center space-x-2 text-green-600 hover:text-green-700"
        >
          <FaArrowLeft /> <span>Back to Categories</span>
        </Link>
        <h1 className="text-xl font-bold">
          {getCategoryTitle()} Quiz
          {region && (
            <span className="text-gray-500 text-sm ml-2">({region})</span>
          )}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Progress Indicator */}
        <div className="flex justify-between items-center mb-6">
          <div className="w-full bg-gray-200 h-2 rounded-full mr-4">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / questions.length) * 100
                }%`,
              }}
            ></div>
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Question */}
        <h2 className="text-lg font-semibold mb-6">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {Object.entries(currentQuestion.options).map(([key, value]) => (
            <button
              key={key}
              className={`w-full text-left p-3 cursor-pointer rounded-md border ${
                selectedAnswer === key
                  ? isAnswerSubmitted
                    ? key === currentQuestion.correctAnswer
                      ? "bg-green-100 border-green-500"
                      : "bg-red-100 border-red-500"
                    : "bg-blue-100 border-blue-500"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              } transition-colors`}
              onClick={() => handleAnswerSelect(key)}
              disabled={isAnswerSubmitted}
            >
              <div className="flex justify-between items-center">
                <span className="flex-1">{value}</span>
                {isAnswerSubmitted && key === currentQuestion.correctAnswer && (
                  <FaCheck className="text-green-600" />
                )}
                {isAnswerSubmitted &&
                  selectedAnswer === key &&
                  key !== currentQuestion.correctAnswer && (
                    <FaTimes className="text-red-600" />
                  )}
              </div>
            </button>
          ))}
        </div>

        {/* Explanation (shown after answering) */}
        {isAnswerSubmitted && (
          <div className="bg-gray-50 p-4 rounded-md shadow-md mb-6">
            <h3 className="font-semibold mb-2">Explanation:</h3>
            <p className="text-gray-700">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between">
          {!isAnswerSubmitted ? (
            <button
              onClick={handleAnswerSubmit}
              disabled={!selectedAnswer}
              className="bg-green-600 cursor-pointer text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              <span>
                {currentQuestionIndex < questions.length - 1
                  ? "Next Question"
                  : "Finish Quiz"}
              </span>
              <FaArrowRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
