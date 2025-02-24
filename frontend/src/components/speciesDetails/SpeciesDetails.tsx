import React from "react";
import { FaRegThumbsUp, FaRegThumbsDown, FaLanguage } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { GiHabitatDome } from "react-icons/gi";
import { IoLocationSharp } from "react-icons/io5";
import { MdFactCheck } from "react-icons/md";

const speciesDetails = () => {
  return (
    <div className="space-y-6 mx-10 shadow-lg rounded-lg pb-10">
      <div className="bg-gray-800 h-100 relative rounded-t-2xl">
        <div className="bg-gray-300 py-6 absolute bottom-0 left-0 right-0">
          <p className="text-4xl font-bold px-6">Prunus africana</p>
          <span className="flex gap-10">
            <p className="px-6">Scientific Name: Prunus Africana</p>
            <p className="px-6">Local Name: Umwumba</p>
          </span>
        </div>
      </div>
      <div className="space-y-4 px-6">
        <h2 className="text-2xl font-bold">Description</h2>
        <p>
          A large evergreen tree native to the mountainous regions of Africa,
          reaching heights of up to 40 meters.
        </p>
      </div>
      <div className="flex justify-between items-center bg-gray-200 p-4 rounded-md mx-6">
        <div className="flex gap-3">
          <button className="text-white bg-green-600 px-4 py-2 rounded-md flex gap-2 cursor-pointer">
            <FaLanguage size={25} />
            Translate to Kinyarwanda
          </button>
          <button className="text-white bg-blue-600 px-4 py-2 rounded-md flex gap-2 cursor-pointer">
            <FaLanguage size={25} />
            Translate to Kiswahili
          </button>
        </div>

        <div className="flex gap-3">
          <FaRegThumbsUp
            size={20}
            className="text-gray-600 cursor-pointer items-center"
          />
          <FaRegThumbsDown
            size={20}
            className="text-gray-600 cursor-pointer items-center"
          />
        </div>
      </div>

      <div className="p-4 bg-gray-200 space-y-4 rounded-md mx-6 mb">
        <p className="text-xl font-bold">Myths and Legends</p>
        <p className="text-gray-700">Traditional myth content goes here</p>
      </div>
      <div className="p-4 bg-gray-200 space-y-4 rounded-md mx-6 mb">
        <p className="text-xl font-bold">Myths and Legends</p>
        <p className="text-gray-700">Traditional myth content goes here</p>
      </div>
      <hr className="mx-6 text-gray-300" />
      <div className="flex mx-6 justify-between gap-10">
        <div className="space-y-4 shadow-2xs px-4 py-6 rounded-md border border-gray-200 grow">
          <h3 className="mb-4 text-xl font-bold">Quick Facts</h3>
          <p className="flex gap-2 items-center">
            {" "}
            <IoLocationSharp color="green" />
            Found in the Volcanoes national park
          </p>
          <p className="flex gap-2 item-center">
            {" "}
            <GiHabitatDome color="green" />
            Thrives in high altitudes
          </p>
          <p className="flex gap-2 items-center">
            {" "}
            <MdFactCheck color="green" />
            Used in weaving
          </p>
        </div>
        <div className="space-y-4 shadow-2xs px-4 py-6 rounded-md border border-gray-200 grow self-start">
          <h3 className="text-xl font-bold">Add Information</h3>
          <button className="flex gap-2 bg-green-600 text-white px-4 py-2 rounded-md items-center w-full justify-center cursor-pointer">
            <FaPlus />
            Add New Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default speciesDetails;
