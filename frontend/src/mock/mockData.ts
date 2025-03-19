import {
  Species,
  CulturalContent,
  SpeciesFact,
  Organization,
  QuizQuestion,
} from "../models";

// Mock Species Data
export const mockSpecies: Species[] = [
  {
    key: 1030866,
    scientificName: "Panthera leo",
    vernacularNames: ["Lion", "African Lion"],
    rank: "SPECIES",
    kingdom: "Animalia",
    phylum: "Chordata",
    family: "Felidae",
    class: "Mammalia",
    order: "Carnivora",
    genus: "Panthera",
    specificEpithet: "leo",
    habitat: "Savanna, grassland, dense scrub, and open woodland",
    description:
      "The lion is a large cat of the genus Panthera native to Africa and India. It has a muscular, broad-chested body; short, rounded head; round ears; and a hairy tuft at the end of its tail.",
    image: "/lion.jpg",
    compositeKey: "1030866_1_216",
    threat_status: "Vulnerable",
  },
  {
    key: 5231190,
    scientificName: "Loxodonta africana",
    vernacularNames: ["African Elephant", "Savanna Elephant"],
    rank: "SPECIES",
    kingdom: "Animalia",
    phylum: "Chordata",
    family: "Elephantidae",
    class: "Mammalia",
    order: "Proboscidea",
    genus: "Loxodonta",
    specificEpithet: "africana",
    habitat: "Savanna, grassland, forest, desert, marshes",
    description:
      "The African bush elephant, also known as the African savanna elephant, is the largest living terrestrial animal, with bulls reaching a shoulder height of up to 3.96 m.",
    image: "/elephant.jpg",
    compositeKey: "5231190_1_216",
    threat_status: "Endangered",
  },
  {
    key: 2480498,
    scientificName: "Prunus africana",
    vernacularNames: ["African Cherry", "Red Stinkwood", "Umwumba"],
    rank: "SPECIES",
    kingdom: "Plantae",
    phylum: "Tracheophyta",
    family: "Rosaceae",
    class: "Magnoliopsida",
    order: "Rosales",
    genus: "Prunus",
    specificEpithet: "africana",
    habitat: "Montane forest regions in Africa",
    description:
      "A large evergreen tree native to the mountainous regions of Africa, reaching heights of up to 40 meters. The bark has medicinal properties and is used in traditional medicine.",
    image: "/prunus-africana.jpg",
    compositeKey: "2480498_1_null",
    threat_status: "Vulnerable",
  },
];

// Mock Cultural Content
export const mockCulturalContent: CulturalContent[] = [
  {
    id: 1,
    speciesId: "1030866_1_216",
    contentType: "legend",
    title: "The Lion and the Shepherd",
    content:
      "Long ago in the plains of East Africa, there lived a shepherd who saved a lion cub from a hunter's trap. The lion grew to protect the shepherd's flock from predators, becoming a symbol of gratitude and loyalty.",
    language: "en",
    source: "East African Folklore",
    authorId: 1,
    authorName: "John Doe",
    status: "approved",
    createdAt: "2025-02-15T10:30:00Z",
    updatedAt: "2025-02-15T10:30:00Z",
  },
  {
    id: 2,
    speciesId: "2480498_1_null",
    contentType: "myth",
    title: "The Sacred Tree",
    content:
      "The Umwumba tree is considered sacred among many communities in Rwanda. It is believed that the spirits of ancestors reside in these trees, and cutting one down without proper rituals can bring misfortune to the family.",
    language: "en",
    source: "Rwandan Traditional Knowledge",
    authorId: 2,
    authorName: "Jane Smith",
    status: "approved",
    createdAt: "2025-02-10T14:20:00Z",
    updatedAt: "2025-02-10T14:20:00Z",
  },
];

// Mock Species Facts
export const mockSpeciesFacts: SpeciesFact[] = [
  {
    id: 1,
    speciesId: "1030866_1_216",
    category: "behavior",
    fact: "Lions are the only cats that live in groups, called prides. A pride consists of multiple related females, their cubs, and a small number of adult males.",
    sourceReference: "National Geographic Wildlife Encyclopedia, 2023",
    createdBy: 3,
    creatorName: "Dr. Wildlife Expert",
    createdAt: "2025-01-20T09:15:00Z",
    updatedAt: "2025-01-20T09:15:00Z",
  },
  {
    id: 2,
    speciesId: "5231190_1_216",
    category: "physical_characteristics",
    fact: "African elephants have larger ears that allow them to radiate excess heat. These ears can be up to 6 feet long and 5 feet wide.",
    sourceReference: "Journal of African Ecology, Vol. 45, 2024",
    createdBy: 3,
    creatorName: "Dr. Wildlife Expert",
    createdAt: "2025-01-25T11:30:00Z",
    updatedAt: "2025-01-25T11:30:00Z",
  },
];

// Mock Organizations
export const mockOrganizations: Organization[] = [
  {
    id: 1,
    name: "Forest Protection Alliance",
    location: "Kigali",
    description:
      "Focusing on forest conservation, reforestation efforts, and sustainable resource management in Rwanda's national parks.",
    websiteUrl: "https://forestprotectionalliance.org",
    logoUrl: "https://placehold.co/200x200/E9F7EF/16a34a?text=FPA",
    country: "Rwanda",
  },
  {
    id: 2,
    name: "Wildlife Conservation Kenya",
    location: "Nairobi",
    description:
      "Working to protect endangered species and their habitats across Kenya through research, education, and community engagement.",
    websiteUrl: "https://wildlifeconservationkenya.org",
    logoUrl: "https://placehold.co/200x200/E9F7EF/16a34a?text=WCK",
    country: "Kenya",
  },
  {
    id: 3,
    name: "African Wildlife Foundation",
    location: "Nairobi",
    description:
      "Africa's oldest and largest conservation organization, focusing on species protection, land conservation, and community empowerment.",
    websiteUrl: "https://www.awf.org",
    logoUrl: "https://placehold.co/200x200/E9F7EF/16a34a?text=AWF",
    country: "Kenya",
  },
  {
    id: 4,
    name: "Rwanda Wildlife Conservation Association",
    location: "Kigali",
    description:
      "Dedicated to protecting Rwanda's rich natural heritage by focusing on Grey Crowned Cranes and their wetland habitats.",
    websiteUrl: "https://rwandawildlife.org",
    logoUrl: "https://placehold.co/200x200/E9F7EF/16a34a?text=RWCA",
    country: "Rwanda",
  },
  {
    id: 5,
    name: "Tanzania Conservation Foundation",
    location: "Dar es Salaam",
    description:
      "Pioneering community-led conservation approaches to protect Tanzania's unique wildlife and natural resources.",
    websiteUrl: "https://tanzaniaconservation.org",
    logoUrl: "https://placehold.co/200x200/E9F7EF/16a34a?text=TCF",
    country: "Tanzania",
  },
  {
    id: 6,
    name: "Serengeti Watch",
    location: "Arusha",
    description:
      "Monitoring and advocating for the protection of the Serengeti ecosystem, one of Africa's most important wildlife areas.",
    websiteUrl: "https://serengetiwatch.org",
    logoUrl: "https://placehold.co/200x200/E9F7EF/16a34a?text=SW",
    country: "Tanzania",
  },
  {
    id: 7,
    name: "Uganda Conservation Foundation",
    location: "Kampala",
    description:
      "Focused on rebuilding Uganda's wildlife populations through anti-poaching efforts, habitat restoration, and community engagement.",
    websiteUrl: "https://ugandacf.org",
    logoUrl: "https://placehold.co/200x200/E9F7EF/16a34a?text=UCF",
    country: "Uganda",
  },
  {
    id: 8,
    name: "Dian Fossey Gorilla Fund",
    location: "Musanze",
    description:
      "Dedicated to the conservation and protection of gorillas and their habitats in Rwanda and the Democratic Republic of Congo.",
    websiteUrl: "https://gorillafund.org",
    logoUrl: "https://placehold.co/200x200/E9F7EF/16a34a?text=DFGF",
    country: "Rwanda",
  },
];

// Mock Quiz Questions
export const mockQuizQuestions: Record<string, QuizQuestion[]> = {
  mammals: [
    {
      question: "What is the primary goal of conserving East African mammals?",
      options: {
        A: "To protect diverse species like elephants and gorillas",
        B: "To reduce biodiversity in the region",
        C: "To increase habitat destruction",
        D: "To complicate conservation efforts",
      },
      correctAnswer: "A",
      explanation:
        "Conservation efforts aim to protect the rich diversity of species in East Africa, including elephants, gorillas, and many others, preserving them for future generations.",
    },
    {
      question: "Which of these is NOT a major threat to African elephants?",
      options: {
        A: "Poaching for ivory",
        B: "Habitat loss due to human expansion",
        C: "Climate change affecting migration patterns",
        D: "Competition with domestic cats",
      },
      correctAnswer: "D",
      explanation:
        "Domestic cats are not competitors or threats to African elephants. The main threats include poaching, habitat loss, and climate change impacts.",
    },
  ],
  plants: [
    {
      question: "What medicinal properties is Prunus africana known for?",
      options: {
        A: "Treating malaria",
        B: "Treating prostate disorders",
        C: "Pain relief for headaches",
        D: "Curing common colds",
      },
      correctAnswer: "B",
      explanation:
        "Prunus africana bark is known for its use in treating benign prostatic hyperplasia (BPH) and other prostate-related conditions in traditional and modern medicine.",
    },
  ],
};
