export interface Species {
  key: number;
  scientificName: string;
  vernacularNames: string[];
  rank: string;
  kingdom: string;
  phylum: string;
  family: string;
  image?: string;
}

export interface SpeciesDetails {}
