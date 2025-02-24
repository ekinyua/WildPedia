import { IoChevronDownSharp } from "react-icons/io5";
import OrgCard from "./OrgCard";

const Organizations = () => {
  return (
    <div className="space-y-8 bg-blue-50 p-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Conservation Organizations</h1>
        <p>
          Discover organizations dedicated to protecting and preserving
          biodiversity in Kenya and Rwanda. These organizations work tirelessly
          to conserve wildlife, protect habitats, and promote sustainable
          practices.
        </p>
        <div className="space-x-4">
          <button className="rounded-4xl bg-green-600 text-white px-4 py-2 cursor-pointer">
            All Organizations
          </button>
          <button className="rounded-4xl bg-white text-black px-4 py-2 cursor-pointer">
            Kenya
          </button>
          <button className="rounded-4xl bg-white text-black px-4 py-2 cursor-pointer">
            Rwanda
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <OrgCard />
        <OrgCard />
        <OrgCard />
        <OrgCard />
      </div>
      <button className="flex text-green-600 bg-white px-4 py-2 rounded-lg cursor-pointer mx-auto items-center gap-2 border">
        Load More Organizations
        <span>
          <IoChevronDownSharp />
        </span>
      </button>
    </div>
  );
};

export default Organizations;
