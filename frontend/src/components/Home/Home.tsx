import { useState, useEffect } from "react";
import { Species } from "../../types";
import Header from "./Header";
import HeroBanner from "./HeroBanner";
import SpeciesNearYou from "./SpeciesNearYou";
import KnowledgeTest from "./KnowledgeTest";
import Footer from "./Footer";

const Home = () => {
  const [species, setSpecies] = useState<Species[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState("");

  const fetchSpecies = async (query?: string) => {
    setIsLoading(true);
    setError("");
    try {
      const apiUrl = query
        ? `/api/species?q=${encodeURIComponent(query)}`
        : "/api/species";
      const response = await fetch(apiUrl);

      if (!response.ok) throw new Error("Failed to fetch species");

      const data = await response.json();
      setSpecies(data.results);
      setLocation(data.location);
    } catch (err: any) {
      setError(err.message || "Error fetching species data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecies();
  }, []);

  return (
    <div className="flex flex-col mx-auto my-0 w-full bg-white max-w-[1433px]">
      <Header />
      <HeroBanner onSearch={fetchSpecies} />
      <SpeciesNearYou 
        species={species} 
        isLoading={isLoading} 
        error={error} 
        location={location} 
      />
      <KnowledgeTest />
      <Footer />
    </div>
  );
};

export default Home;