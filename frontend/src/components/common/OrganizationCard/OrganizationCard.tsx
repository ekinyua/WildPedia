import { FaArrowRight } from "react-icons/fa6";
import { Organization } from "../../../models";

interface OrganizationCardProps {
  organization: Organization;
  className?: string;
}

const OrganizationCard = ({
  organization,
  className = "",
}: OrganizationCardProps) => {
  return (
    <div
      className={`shadow-sm hover:shadow-md transition-shadow duration-200 p-6 space-y-6 rounded-xl bg-white max-w-md ${className}`}
    >
      <div className="flex items-start gap-4">
        <span className="inline-block bg-gray-200 p-2 rounded-md">
          <img
            src={organization.logoUrl || "/placeholder.jpg"}
            alt={organization.name}
            className="w-14 h-14 object-cover"
          />
        </span>
        <div>
          <h3 className="text-xl font-bold">{organization.name}</h3>
          <p className="text-lg text-gray-600">{organization.location}</p>
        </div>
      </div>
      <p className="text-gray-700">{organization.description}</p>
      {organization.websiteUrl && (
        <a
          href={organization.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex gap-3 items-center text-green-600 text-lg group"
        >
          Visit Website
          <FaArrowRight className="text-green-600 group-hover:translate-x-1 transition-transform duration-200" />
        </a>
      )}
    </div>
  );
};

export default OrganizationCard;
