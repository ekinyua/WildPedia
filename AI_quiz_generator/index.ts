import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

// Load environment variables
dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { BaseMessage } from "@langchain/core/messages";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Define request body interfaces
interface FileQuizRequest {
  filePath: string;
  numQuestions?: number;
  subject?: string;
}

interface TextQuizRequest {
  content: string;
  numQuestions?: number;
  subject?: string;
}

// Define response interfaces
interface QuizQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
  explanation: string;
}

interface QuizResponse {
  questions: QuizQuestion[];
}

interface ErrorResponse {
  raw?: string;
  error: string;
}

// Swagger
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Quiz Generator API",
    version: "1.0.0",
    description:
      "API for generating multiple-choice quiz questions from text content",
    contact: {
      name: "API Support",
      email: "support@quizgenerator.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  tags: [
    {
      name: "Health",
      description: "API health check endpoints",
    },
    {
      name: "Quiz",
      description: "Quiz generation endpoints",
    },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Check if the API is running",
        responses: {
          "200": {
            description: "API is running properly",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HealthResponse",
                },
              },
            },
          },
        },
      },
    },
    "/quiz/fromFile": {
      post: {
        tags: ["Quiz"],
        summary: "Generate quiz questions from a file",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/FileQuizRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Quiz questions generated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/QuizResponse",
                },
              },
            },
          },
          "400": {
            description: "Missing required parameters",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "404": {
            description: "File not found or empty",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/quiz/fromText": {
      post: {
        tags: ["Quiz"],
        summary: "Generate quiz questions from provided text content",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TextQuizRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Quiz questions generated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/QuizResponse",
                },
              },
            },
          },
          "400": {
            description: "Missing required parameters",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      FileQuizRequest: {
        type: "object",
        required: ["filePath"],
        properties: {
          filePath: {
            type: "string",
            description:
              "Path to the file containing content for quiz generation",
          },
          numQuestions: {
            type: "integer",
            description: "Number of questions to generate (default: 5)",
          },
          subject: {
            type: "string",
            description: "Subject area of the quiz (default: physics)",
          },
        },
      },
      TextQuizRequest: {
        type: "object",
        required: ["content"],
        properties: {
          content: {
            type: "string",
            description: "Text content for quiz generation",
          },
          numQuestions: {
            type: "integer",
            description: "Number of questions to generate (default: 5)",
          },
          subject: {
            type: "string",
            description: "Subject area of the quiz (default: physics)",
          },
        },
      },
      QuizQuestion: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "The quiz question text",
          },
          options: {
            type: "object",
            properties: {
              A: { type: "string" },
              B: { type: "string" },
              C: { type: "string" },
              D: { type: "string" },
            },
            description: "Multiple choice options",
          },
          correctAnswer: {
            type: "string",
            enum: ["A", "B", "C", "D"],
            description: "The correct answer option",
          },
          explanation: {
            type: "string",
            description: "Explanation of why the correct answer is correct",
          },
        },
      },
      QuizResponse: {
        type: "object",
        properties: {
          questions: {
            type: "array",
            items: {
              $ref: "#/components/schemas/QuizQuestion",
            },
            description: "Array of quiz questions",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: {
            type: "string",
            description: "Error message",
          },
          raw: {
            type: "string",
            description: "Raw response when JSON parsing fails",
          },
        },
      },
      HealthResponse: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "UP",
          },
          message: {
            type: "string",
            example: "Quiz API is running",
          },
        },
      },
    },
  },
};

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Function to read a file
function readFile(filePath: string): string {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return data;
  } catch (error: any) {
    console.error(`Got an error trying to read the file: ${error.message}`);
    return "";
  }
}

// Tools for the agent to use
const agentTools = [new TavilySearchResults({ maxResults: 3 })];
const agentModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-pro-exp-02-05",
  apiKey: GOOGLE_API_KEY || "", // Provide empty string fallback
  temperature: 0.2, // Lower temperature for more deterministic output
});

// Initialize memory to persist state between graph runs
const agentCheckpointer = new MemorySaver();
const agent = createReactAgent({
  llm: agentModel,
  tools: agentTools,
  checkpointSaver: agentCheckpointer,
});

// Function to generate quiz questions
async function generateQuizQuestions(
  topic: string,
  numQuestions: number = 5,
  subject: string = "conservation"
): Promise<QuizResponse | ErrorResponse> {
  if (!topic) {
    throw new Error("No topic provided");
  }

  // Generate a random seed for question variety
  const randomSeed = Math.floor(Math.random() * 1000);

  const prompt = `You are a quiz generator with expertise in ${subject}.
  
  Generate ${numQuestions} multiple-choice quiz questions about the topic: "${topic}".
  
  Use your knowledge to create informative and educational questions. Each question should:
  1. Test understanding of key concepts from the content.
  2. Have 4 options (A, B, C, D) with only one correct answer.
  3. Include the correct answer and a brief explanation.
  4. Use randomization seed: ${randomSeed} to ensure variety.

  Return the quiz questions in JSON format. The JSON should have a
"questions" array. Each object in the array should have "question",
"options", "correctAnswer", and "explanation" fields. The "options" field
should be an object with keys "A", "B", "C", and "D". The "correctAnswer"
field should be one of "A", "B", "C", or "D".

  Here is the JSON format:
  \`\`\`json
  {
    "questions": [
      {
        "question": "Question text here",
        "options": {
          "A": "Option A text",
          "B": "Option B text",
          "C": "Option C text",
          "D": "Option D text"
        },
        "correctAnswer": "A",
        "explanation": "Explanation of the correct answer"
      }
    ]
  }
  \`\`\`

  Topic:
  ${topic}`;

  try {
    // Create a unique thread_id each time for different context
    const threadId = `quiz_generator_${Date.now()}`;

    const quizState = await agent.invoke(
      { messages: [new HumanMessage(prompt)] },
      { configurable: { thread_id: threadId } }
    );

    // Get the last message and handle potential undefined
    const lastMessage = quizState.messages[
      quizState.messages.length - 1
    ] as BaseMessage;

    // Check if content exists and is a string
    if (!lastMessage || typeof lastMessage.content !== "string") {
      throw new Error("Failed to get valid response from AI model");
    }

    const quizContent = lastMessage.content;

    // Try to parse the response as JSON
    try {
      // Find JSON content if it's wrapped in markdown code blocks
      let jsonContent = quizContent;
      const jsonMatch = quizContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1];
      }

      const parsedQuiz = JSON.parse(jsonContent) as QuizResponse;

      // Validate the parsed JSON
      if (!parsedQuiz.questions || !Array.isArray(parsedQuiz.questions)) {
        throw new Error("Invalid JSON format: Missing 'questions' array.");
      }

      parsedQuiz.questions.forEach((question, index) => {
        if (
          !question.question ||
          !question.options ||
          !question.correctAnswer ||
          !question.explanation
        ) {
          throw new Error(
            `Invalid JSON format: Missing fields in question ${index + 1}.`
          );
        }
      });

      return parsedQuiz;
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", parseError);
      // Return the raw content if parsing fails
      return {
        raw: quizContent,
        error: "Failed to parse as JSON. Format may not be as expected.",
      };
    }
  } catch (error: any) {
    console.error("Error generating quiz:", error);
    throw error;
  }
}

// ----- API ENDPOINTS -----

// Health check endpoint
app.get("/health", function (req: Request, res: Response) {
  res.status(200).json({ status: "UP", message: "Quiz API is running" });
});

// Generate quiz from file
app.post("/quiz/fromFile", function (req: Request, res: Response) {
  (async function () {
    try {
      const { filePath, numQuestions, subject } = req.body as FileQuizRequest;

      if (!filePath) {
        return res.status(400).json({ error: "File path is required" });
      }

      const absolutePath = path.resolve(filePath);
      const content = readFile(absolutePath);

      if (!content) {
        return res.status(404).json({ error: "File not found or empty" });
      }

      const quiz = await generateQuizQuestions(
        content,
        numQuestions || 5,
        subject || "physics"
      );

      res.status(200).json(quiz);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  })();
});

// Generate quiz from text content
app.post("/quiz/fromText", function (req: Request, res: Response) {
  (async function () {
    try {
      const { content, numQuestions, subject } = req.body as TextQuizRequest;

      if (!content) {
        return res.status(400).json({ error: "Content is required" });
      }

      const quiz = await generateQuizQuestions(
        content,
        numQuestions || 5,
        subject || "physics"
      );

      res.status(200).json(quiz);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  })();
});

// Start server
app.listen(PORT, () => {
  console.log(`Quiz API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});
