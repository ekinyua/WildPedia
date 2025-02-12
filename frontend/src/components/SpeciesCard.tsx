const SpeciesCard = ({ species }: any) => {
  return (
    <div className="rounded-lg shadow-lg overflow-hidden bg-white">
      <div className="h-48 overflow-hidden">
        <img
          src={species.image ? species.image : "/placeholder.jpg"}
          alt={species.scientificName}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{species.scientificName}</h3>
        <p className="text-gray-600 text-sm">
          {species.rank} - {species.kingdom}
        </p>
      </div>
    </div>
  );
};

export default SpeciesCard;
