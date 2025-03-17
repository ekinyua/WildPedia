// src/services/speciesService.ts
import { Species, CulturalContent, SpeciesFact } from "../models";
import { api } from "./api/apiClient";
import {
  mockSpecies,
  mockCulturalContent,
  mockSpeciesFacts,
} from "../mock/mockData";

// Flag to switch between mock data and real API
const USE_MOCK_DATA = false;

// Helper to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Get species list with optional search
export async function getSpecies(
  search?: string,
  location?: string
): Promise<{ results: Species[]; location: string }> {
  if (USE_MOCK_DATA) {
    await delay(500); // Simulate network delay

    let results = [...mockSpecies];
    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(
        (species) =>
          species.scientificName.toLowerCase().includes(searchLower) ||
          species.vernacularNames.some((name) =>
            name.toLowerCase().includes(searchLower)
          )
      );
    }

    return {
      results,
      location: location || "Kigali, Rwanda",
    };
  }

  // Real API call
  return api.get<{ results: Species[]; location: string }>(
    `/api/species${search ? `?q=${search}` : ""}${
      location ? `&location=${location}` : ""
    }`
  );
}

// Get species details by ID
export async function getSpeciesDetails(
  compositeKey: string
): Promise<Species> {
  if (USE_MOCK_DATA) {
    await delay(300);
    const species = mockSpecies.find((s) => s.compositeKey === compositeKey);
    if (!species) {
      throw new Error("Species not found");
    }
    return species;
  }

  return api.get<Species>(`/api/species/${compositeKey}`);
}

export async function voteForContent(
  contentId: number,
  direction: "up" | "down"
): Promise<CulturalContent> {
  return api.post<CulturalContent>(`/api/cultural-content/${contentId}/vote`, {
    direction,
  });
}

// Get cultural content for a species
export async function getSpeciesCulturalContent(
  speciesId: string,
  language: string = "en"
): Promise<CulturalContent[]> {
  if (USE_MOCK_DATA) {
    await delay(400);
    return mockCulturalContent
      .filter(
        (content) =>
          content.speciesId === speciesId && content.language === language
      )
      .sort((a, b) => (b.votes || 0) - (a.votes || 0));
  }

  const response = await api.get<{ content: CulturalContent[] }>(
    `/api/cultural-content/species/${speciesId}?language=${language}`
  );
  return response.content.sort((a, b) => (b.votes || 0) - (a.votes || 0));
}

// Post cultural content for a species
export async function addCulturalContent(data: {
  speciesId: string;
  contentType: "myth" | "legend" | "proverb";
  title: string;
  content: string;
  language: string;
  source?: string;
}): Promise<CulturalContent> {
  console.log("Submitting cultural content with speciesId:", data.speciesId);

  if (!data.speciesId || data.speciesId.trim() === "") {
    throw new Error("Species ID cannot be empty");
  }

  return api.post<CulturalContent>("/api/cultural-content", data);
}

// Get scientific facts for a species
export async function getSpeciesFacts(
  speciesId: string,
  category?: string
): Promise<SpeciesFact[]> {
  if (USE_MOCK_DATA) {
    await delay(400);
    let facts = mockSpeciesFacts.filter((fact) => fact.speciesId === speciesId);
    if (category) {
      facts = facts.filter((fact) => fact.category === category);
    }
    return facts;
  }

  const response = await api.get<{ facts: SpeciesFact[] }>(
    `/api/species-facts/species/${speciesId}${
      category ? `?category=${category}` : ""
    }`
  );
  return response.facts;
}

// Upload an image for species identification
export async function identifySpeciesFromImage(imageFile: File): Promise<{
  species: string;
  confidence: number;
  allDetections: Array<{ name: string; score: number; type: string }>;
}> {
  //   if (USE_MOCK_DATA) {
  //     // Simulate network delay
  //     await delay(1500);

  //     // Return mock identification result
  //     return {
  //       species: "Macaw",
  //       confidence: 95,
  //       allDetections: [
  //         { name: "Macaw", score: 0.95, type: "label" },
  //         { name: "Parrot", score: 0.9, type: "object" },
  //         { name: "Bird", score: 0.85, type: "label" },
  //         { name: "Red", score: 0.75, type: "label" },
  //         { name: "Blue", score: 0.7, type: "label" },
  //       ],
  //     };
  //   }

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    // Use the proxy path to your backend
    const response = await fetch("/api/vision/identify", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        "Failed to identify species. Server responded with an error."
      );
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error identifying species:", error);
    throw error;
  }
}
