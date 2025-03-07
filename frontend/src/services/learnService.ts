// src/services/learnService.ts
import {
  QuizQuestion,
  UserStats,
  LeaderboardEntry,
  QuizResult,
} from "../models";
import { learningApi } from "./api/learningApiClient";
import { mockQuizQuestions } from "../mock/mockData";
import { authApi } from "./api/authApiClient";

// Flag to switch between mock and real API for quiz questions
const USE_MOCK_DATA = false;

// Helper to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Get quiz questions by category
export async function getQuizQuestions(
  category: string,
  region?: string
): Promise<QuizQuestion[]> {
  if (USE_MOCK_DATA) {
    await delay(600);
    // In mock mode, just return the questions for this category
    return mockQuizQuestions[category] || [];
  }

  // Create a unique request with randomization factors
  const timestamp = new Date().getTime();
  const randomSeed = Math.floor(Math.random() * 10000);

  // Format content to prioritize category and region specificity while ensuring uniqueness
  let content = "";

  if (region) {
    // Format: "Generate 5 quiz questions about [category] specifically in [region]."
    content = `Generate 5 quiz questions about ${category} specifically in ${region}.`;
  } else {
    // Format: "Generate 5 quiz questions about [category] in general."
    content = `Generate 5 quiz questions about ${category} in general.`;
  }

  // Add randomization to prevent caching but put it at the end to not interfere with the main prompt
  content += ` Randomization code: ${randomSeed}-${timestamp}`;

  try {
    console.log("Requesting quiz with content:", content);

    // Use the learning API client instead of direct fetch
    const response = await learningApi.post<{ questions: QuizQuestion[] }>(
      "/quiz/fromText",
      {
        content: content,
        numQuestions: 5,
        subject: category, // Use the actual category as the subject
      }
    );

    console.log("Received quiz data:", response);

    if (!response.questions || response.questions.length === 0) {
      throw new Error("No questions received from the API");
    }

    console.log("First question:", response.questions[0].question);
    return response.questions;
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    // If the API call fails, fall back to mock data
    return mockQuizQuestions[category] || [];
  }
}

// Generate custom quiz based on content
export async function generateCustomQuiz(
  content: string,
  numQuestions: number = 5,
  subject: string = "biodiversity",
  region?: string
): Promise<QuizQuestion[]> {
  if (USE_MOCK_DATA) {
    await delay(1500); // Longer delay to simulate AI processing

    // Return a subset of mock questions
    const allQuestions = Object.values(mockQuizQuestions).flat();
    const randomQuestions = allQuestions
      .sort(() => 0.5 - Math.random())
      .slice(0, numQuestions);

    return randomQuestions;
  }

  // Add randomization to ensure uniqueness
  const timestamp = new Date().getTime();
  const randomSeed = Math.floor(Math.random() * 10000);
  const randomizedContent = `${content} (Request ID: ${randomSeed}-${timestamp})`;

  try {
    // Use the learning API client
    const response = await learningApi.post<{ questions: QuizQuestion[] }>(
      "/quiz/fromText",
      {
        content: randomizedContent,
        numQuestions,
        subject,
        region,
      }
    );

    if (!response.questions || response.questions.length === 0) {
      throw new Error("No questions received from the API");
    }

    return response.questions;
  } catch (error) {
    console.error("Error generating custom quiz:", error);
    // Fallback to mock data on error
    const allQuestions = Object.values(mockQuizQuestions).flat();
    return allQuestions.sort(() => 0.5 - Math.random()).slice(0, numQuestions);
  }
}

export async function getUserStats(): Promise<UserStats> {
  try {
    const response = await authApi.get<{ userId: number; stats: UserStats }>(
      "/stats/stats"
    );
    return response.stats;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
}

// Record quiz results for a user
export async function submitQuizResults(
  correctAnswers: number,
  totalQuestions: number
): Promise<QuizResult> {
  try {
    const response = await authApi.post<QuizResult>("/stats/quiz-results", {
      correctAnswers,
      totalQuestions,
    });
    return response;
  } catch (error) {
    console.error("Error submitting quiz results:", error);
    throw error;
  }
}

export async function getLeaderboard(
  limit: number = 10
): Promise<{ leaderboard: LeaderboardEntry[]; userRank: number | null }> {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });

    const response = await authApi.get<{
      leaderboard: LeaderboardEntry[];
      userRank: number | null;
    }>(`/stats/leaderboard?${params.toString()}`);

    return response;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
}

// Get available learning categories - ALWAYS use mock data for this
export async function getLearningCategories(
  region?: string
): Promise<{ id: string; name: string; description: string; icon: string }[]> {
  // Always use mock data for categories
  await delay(400);

  const allCategories = [
    {
      id: "mammals",
      name: "Mammals",
      description:
        "Learn about the diverse mammals of East Africa, from mighty elephants to gorillas.",
      icon: "GiElephant",
      regions: ["Kenya", "Rwanda", "Uganda", "Tanzania"],
    },
    {
      id: "birds",
      name: "Birds",
      description:
        "Discover the colorful world of East African birds, from flamingos to rare species.",
      icon: "GiEgyptianBird",
      regions: ["Kenya", "Rwanda", "Tanzania"],
    },
    {
      id: "marine",
      name: "Marine Life",
      description:
        "Explore the rich marine biodiversity ecosystem of East Africa's coastal waters.",
      icon: "FaFish",
      regions: ["Kenya", "Tanzania"],
    },
    {
      id: "plants",
      name: "Plants",
      description:
        "Study the unique flora of East Africa's diverse ecosystems and landscapes.",
      icon: "GiLindenLeaf",
      regions: ["Kenya", "Rwanda", "Uganda", "Tanzania"],
    },
    {
      id: "insects",
      name: "Insects",
      description:
        "Learn about the fascinating world of insects and their role in our ecosystems.",
      icon: "PiBugFill",
      regions: ["Kenya", "Rwanda", "Uganda"],
    },
    {
      id: "reptiles",
      name: "Reptiles",
      description:
        "Discover the diverse reptilian species found across East African territories.",
      icon: "VscSnake",
      regions: ["Kenya", "Rwanda", "Uganda", "Tanzania"],
    },
  ];

  // Filter by region if specified
  if (region && region !== "All Regions") {
    return allCategories
      .filter((category) => category.regions.includes(region))
      .map(({ regions, ...rest }) => rest); // Remove regions from result
  }

  // Return all categories without the regions array
  return allCategories.map(({ regions, ...rest }) => rest);
}
