import { useState, useEffect } from 'react';
import SpeciesCard from './SpeciesCard';
import SearchBar from './SearchBar';

interface Species {
  key: number;
  scientificName: string;
  rank: string;
  kingdom: string;
  phylum: string;
  family: string;
}



const SpeciesList = () => {
  const [species, setSpecies] = useState<Species[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSpecies = async (query?: string) => {
    setIsLoading(true);
    setError('');
    try {
      // Use 'random' for default, otherwise use search query
      const apiUrl = query ? `/api/species?q=${query}` : `/api/species?q=random`;
      const response = await fetch(apiUrl);
  
      if (!response.ok) throw new Error('Failed to fetch species');
  
      const data = await response.json();
      
      if (query) {
        setSpecies(data.results.slice(0, 2)); // Only store first 2 search results
      } else {
        setSpecies(data.results); // Default species display
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching species data');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSpecies(); // Fetch diverse species on page load
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <SearchBar onSearch={fetchSpecies} />
      
      {isLoading && (
        <div className="text-center py-8">Loading...</div>
      )}
      
      {error && (
        <div className="text-red-500 text-center py-4">{error}</div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {species.map((sp) => (
          <SpeciesCard key={sp.key} species={sp} />
        ))}
      </div>
    </div>
  )
}

export default SpeciesList