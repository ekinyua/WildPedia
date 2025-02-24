import { FaArrowRight } from "react-icons/fa6";

const OrgCard = () => {
  return (
    <div>
      <div className="shadow-xs p-6 space-y-10 rounded-xl bg-white grow max-w-[400px] mx-auto">
        <div className="flex items-top gap-4">
          <span className="inline-block bg-gray-200 p-2 rounded-md">
            <img
              src="/placeholder.jpg"
              alt=""
              className="size-14 object-cover"
            />
          </span>
          <div>
            <p className="text-xl font-bold">Forest Protection Alliance</p>
            <p className="text-lg">Rwanda</p>
          </div>
        </div>
        <p>
          Focusing on forest conservation, reforestation efforts, and
          sustainable resource management in Rwanda's national parks.
        </p>
        <p className="flex gap-3 items-center text-green-600 text-lg">
          Visit Website <FaArrowRight className="text-green-600" />
        </p>
      </div>
    </div>
  );
};

export default OrgCard;
