import { Link } from "react-router-dom";
import { Species } from "../../../models";

interface SpeciesCardProps {
  species: Species;
  className?: string;
}

const SpeciesCard = ({ species, className = "" }: SpeciesCardProps) => {
  // Conservation status badge color
  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-300/40";

    switch (status.toLowerCase()) {
      case "least concern":
        return "bg-green-500/40 text-green-800";
      case "near threatened":
        return "bg-yellow-500/40 text-yellow-800";
      case "vulnerable":
        return "bg-orange-500/40 text-orange-800";
      case "endangered":
        return "bg-red-500/40 text-red-800";
      case "critically endangered":
        return "bg-red-600/60 text-red-900";
      case "extinct in the wild":
      case "extinct":
        return "bg-black/60 text-white";
      default:
        return "bg-gray-300/40";
    }
  };

  return (
    <Link
      to={`/species/${species.compositeKey}`}
      className={`block ${className}`}
    >
      <div className="rounded-2xl w-full bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
        <img
          src={species.image || "/placeholder.jpg"}
          alt={species.scientificName}
          className="h-48 rounded-t-2xl w-full object-cover"
        />
        <div className="px-4 space-y-1 py-3">
          <h3 className="font-bold text-gray-800">
            {species.vernacularNames?.[0] || "Unknown"}
          </h3>
          <p className="italic text-gray-600">{species.scientificName}</p>
          {species.threat_status && (
            <span
              className={`${getStatusColor(
                species.threat_status
              )} rounded-md p-1 inline-block px-2 text-sm`}
            >
              {species.threat_status}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SpeciesCard;
