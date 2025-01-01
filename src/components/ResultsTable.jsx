import { useState } from "react";
import SuggestionsList from "./suggestions";
import { AlertCircle, Eye } from 'lucide-react';
import VisChart from "./VisCharts";

const ResultsTable = ({ results, totalKeywords, level }) => {
  const [showStats, setShowStats] = useState(0); // Track which keyword's stats are shown
  const [item, setItem] = useState({});
  const competiton = ['Low' , 'Hard' , 'Medium'];
  if (!results?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <AlertCircle className="w-12 h-12 mb-4 text-gray-500" />
        <span className="text-lg">No results found</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th colSpan="6" className="bg-gray-800/60 border-b border-gray-700 px-6 py-4 w-full">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Total Keywords:</span>
                  <span className="text-white font-bold bg-gray-700/50 px-3 py-1 rounded-full">
                    {totalKeywords}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Classification:</span>
                  <span className={`font-bold px-3 py-1 rounded-full
                      ${level.name === "Level 1" ? "bg-emerald-500/20 text-emerald-400" :
                        level.name === "Level 2" ? "bg-blue-500/20 text-blue-400" :
                        level.name === "Level 3" ? "bg-purple-500/20 text-purple-400" :
                        "bg-amber-500/20 text-amber-400"}`}>
                    {level.name}
                  </span>
                </div>
              </div>
            </th>
          </tr>
          <tr className="bg-gray-800/40">
            <th className="relative flex justify-start gap-2 px-6 py-4 text-left text-gray-300 font-medium border-b border-gray-700">
              Keyword
            </th>
            <th className="relative px-6 py-4 text-center text-gray-300 font-medium border-b border-gray-700">
              Monthly Searches
            </th>
            <th className="relative px-6 py-4 text-center text-gray-300 font-medium border-b border-gray-700">
              Competition
            </th>
            <th className="relative px-6 py-4 text-left text-gray-300 font-medium border-b border-gray-700">
              Suggestions
            </th>
            <th className="relative px-6 py-4 text-left text-gray-300 font-medium border-b border-gray-700">
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {results?.map((result, index) => {
            const keyword = result?.keyword || "Unknown Keyword";
            const keywordDifficulty = result?.keyword_difficulty;
            const searchVolume = result?.search_volume;
            const suggestions = result?.suggestions;

            return (
              <>
                <tr
                  key={keyword + index}
                  className={`border-b border-gray-700/50 transition-colors duration-150
                            ${index % 2 === 0 ? 'bg-gray-800/20' : 'bg-gray-800/40'}
                            hover:bg-blue-600/10`}
                >
                  <td className="px-6 py-4 font-medium text-gray-200">
                    {keyword}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-300">
                      {searchVolume?.toLocaleString() || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full
                      ${keywordDifficulty >= 40 ? 'bg-red-500/20 text-red-400' : keywordDifficulty < 30 && keywordDifficulty > 15 ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}
                    >
                      {keywordDifficulty >= 40 ? competiton[1] : keywordDifficulty < 30 && keywordDifficulty > 15 ? competiton[2] : competiton[0]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <SuggestionsList
                      suggestions={suggestions}
                    />
                  </td>

                  <td className="px-6 py-4">
                    <Eye className="cursor-pointer" onClick={() => {
                      setShowStats(showStats === index ? null : index); // Toggle view for specific keyword
                      setItem(result);
                    }} />
                  </td>
                </tr>

                {/* Render the chart only for the clicked keyword */}
                {showStats === index && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      <VisChart percent={100 - result.keyword_difficulty} search={result.monthlySearch} />
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
