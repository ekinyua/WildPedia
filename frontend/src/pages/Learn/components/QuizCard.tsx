import React from "react";

const QuizCard = () => {
  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6 mt-10">
      <div className="flex justify-between items-center mb-4">
        <div className="w-1/4 bg-gray-200 h-1 rounded-full">
          <div className="w-1/4 bg-green-500 h-1 rounded-full"></div>
        </div>
        <span className="text-sm text-gray-400">1 of 5</span>
      </div>
      <h2 className="text-lg font-semibold mb-4">
        What is the primary goal of conserving East African mammals?
      </h2>
      <div className="space-y-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="answer"
            className="w-4 h-4 text-green-600 border-gray-300"
          />
          <span>To protect diverse species like elephants and gorillas</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="answer"
            className="w-4 h-4 text-green-600 border-gray-300"
          />
          <span>To reduce biodiversity in the region</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="answer"
            className="w-4 h-4 text-green-600 border-gray-300"
          />
          <span>To increase habitat destruction</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="answer"
            className="w-4 h-4 text-green-600 border-gray-300"
          />
          <span>To complicate conservation efforts</span>
        </label>
      </div>
      <button className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Next →
      </button>
    </div>
  );
};

export default QuizCard;
