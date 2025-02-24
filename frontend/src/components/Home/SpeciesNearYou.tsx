import { Species } from "../../types";

interface SpeciesNearYouProps {
  species: Species[];
  isLoading: boolean;
  error: string;
  location: string;
}

const SpeciesNearYou = ({
  species,
  isLoading,
  error,
  location,
}: SpeciesNearYouProps) => {
  const getLocationTitle = () => {
    if (!location) return "Species Near You";
    return `Species in ${location}`;
  };
  return (
    <section className="px-24 py-16 bg-white max-md:px-10 max-md:py-16">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-black"> {getLocationTitle()}</h2>
      </div>
      {isLoading && <div className="text-center py-8">Loading...</div>}
      {error && <div className="text-red-500 text-center py-4">{error}</div>}
      <div className="grid gap-5 grid-cols-[repeat(3,1fr)] max-sm:grid-cols-[1fr]">
        {species.map((sp) => (
          <div
            key={sp.key}
            className="overflow-hidden bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          >
            <img
              src={sp.image}
              alt={sp.scientificName}
              className="object-cover w-full aspect-[2.08/1]"
            />
            <div className="px-4 py-4">
              <h3 className="mb-3 text-base font-bold text-black">
                {sp.scientificName}
              </h3>
              {sp.vernacularNames.length > 0 && (
                <p className="text-sm text-black">
                  Common Name: {sp.vernacularNames[0]}
                </p>
              )}
              <p className="mb-5 text-sm text-black">{sp.family}</p>
              <div className="flex justify-between items-center">
                <span className="px-2 py-1.5 text-xs bg-green-100 rounded">
                  {sp.rank}
                </span>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/166682bef19284b1a94b5c9a7c7d01c5a3f5a3f5e5b5d8d/_/_/img/octicons-16.svg"
                  alt="Info"
                  className="w-5 h-5"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpeciesNearYou;
