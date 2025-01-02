import { useState, useEffect } from "react";
import { useNavigate, useNavigation } from 'react-router-dom';
import { useMainContext } from './context/MainContext';

import { 
  Download,
  Save,
  Building2,
  Loader2,
  Link,
  Edit
} from 'lucide-react';
import ResultsTable from "./components/ResultsTable";
import Header from "./components/Header";
import BusinessInfo from "./components/BusinessInfo";
import Form from './components/Form';
import { handleCreateProject, handleCreateResults } from "./utils";
// Helper functions
const calculateTotalKeywords = (results) => results?.length || 0;

const determineLevel = (totalKeywords) => {
  if (totalKeywords < 30) return { name: "niveau 1", color: "text-emerald-400" };
  if (totalKeywords < 80) return { name: "niveau 2", color: "text-blue-400" };
  if (totalKeywords < 180) return { name: "niveau 3", color: "text-purple-400" };
  return { name: "niveau VIP", color: "text-amber-400" };
};
const seeResults = async( user,project) => {
  try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/projects/${project?.id || project?.data?.id}/results`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Accept" : "application/json",
        "Authorization" : `Bearer ${user.token}`
      }
    });
    if(response.ok){
      const data = await response.json();
      console.log('data from backend' , data);
      
      return data;
    }
    else{
      alert('see results somthing went wrong');
    }
    
  }catch(error){
    console.log(error);
  }
}

const convertToCSV = (project, results) => {
  const businessInfo = [
    `Business Name,${project.name || project?.data?.name  || 'N/A'}`,
    `Domaine name,${project.projectDomaineName || project?.data?.projectDomaineName || 'N/A'}`,
  ];

  const headers = ['Keyword', 'Search Volume', 'Keyword Difficulty', 'Related Keywords'];
  const rows = results?.map(result => {
  const keyword = result?.keyword || 'Unknown Keyword';
  const keywordDifficulty =  result?.keyword_difficulty >= 40 ? 'trés concurentiel' : result?.keyword_difficulty  < 30 && result?.keyword_difficulty > 15 ? 'concurentiel' : 'non concurentiel'  ;
  const competitionValue = keywordDifficulty || '-';
  const avgMonthlySearches = result?.search_volume || '-' ;

  const suggestions = Array.isArray(result?.suggestions) && result?.suggestions.length > 1 
      ? result?.suggestions
          .slice(1)
          .map(sugg => sugg.keyword || 'N/A')
          .join('\n')
      : '';
    return [
      keyword,
      avgMonthlySearches,
      competitionValue,
      suggestions
    ].map(cell => {
      const cellStr = String(cell).replace(/"/g, '""');
      return cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')
        ? `"${cellStr}"`
        : cellStr;
    }).join(',');
  });
  return [...businessInfo, headers.join(','), ...rows].join('\n');
};

const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Components



const ActionButtons = ({ handleUpadates , isLoading , onDownload, onSave, disabled, stopSave }) => (
  <div className="flex flex-wrap gap-3">
    {
      stopSave && (
        <button
        onClick={()=> {
          handleUpadates()
        }}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 rounded-lg
                  bg-gradient-to-r from-emerald-600 to-emerald-700
                  hover:from-emerald-500 hover:to-emerald-600
                  disabled:from-gray-600 disabled:to-gray-700
                  text-white transition-all duration-200 transform hover:scale-[1.02]
                  disabled:hover:scale-100 shadow-lg"
      >
        <Edit className="w-5 h-5" /> update
      </button>
      )
    }
    <button
      onClick={onDownload}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2 rounded-lg
                bg-gradient-to-r from-emerald-600 to-emerald-700
                hover:from-emerald-500 hover:to-emerald-600
                disabled:from-gray-600 disabled:to-gray-700
                text-white transition-all duration-200 transform hover:scale-[1.02]
                disabled:hover:scale-100 shadow-lg"
    >
      <Download className="w-5 h-5" /> Download CSV
    </button>
    <button
      onClick={onSave}
      disabled={isLoading || stopSave}
      className="flex items-center gap-2 px-4 py-2 rounded-lg
                bg-gradient-to-r from-purple-600 to-purple-700
                hover:from-purple-500 hover:to-purple-600
                disabled:from-gray-600 disabled:to-gray-700
                text-white transition-all duration-200 transform hover:scale-[1.02]
                disabled:hover:scale-100 shadow-lg"
    >
      {isLoading ? (<>
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>loading...</span>
      </>) : <div className="flex gap-2 items-center"><Save className="w-5 h-5" /> Save Results</div>}
    </button>
  </div>
);





export default function Results() {
  const {
    project,
    results,
    token,
    setToken,
    showForm,
    setShowForm,
    setStopsave,
    stopSave
  } = useMainContext(); 
  const [isLoading, setIsLoading] = useState(false);
  const router = useNavigate();
  const totalKeywords = calculateTotalKeywords(results);
  const level = determineLevel(totalKeywords);

  useEffect(() => {
      if(token && !showForm) {
        //handleSave();
      }
  }, [showForm]);
  

  const handleDownloadCSV = () => {
      try {
        if (!results?.length) {
          alert('No results to download');
          return;
        }

        const date = new Date().toISOString().split('T')[0];
        const filename = `keyword-research-${date}.csv`;
        const csvContent = convertToCSV(project,results);
        
        downloadCSV(csvContent, filename);
      } catch (error) {
        console.error('Error downloading CSV:', error);
        alert('Error creating CSV file. Please try again.');
      }
  };

  const handleSave = async () => {
    if(!token) {
        setShowForm(true);
        if (!project) {
          router('/');  
        }
    }else{
      setIsLoading(true);
      const newProject = await handleCreateProject(project, token, setToken);
      if (newProject) {
        const newResults = await handleCreateResults(results, newProject.id, token);
        //setOldResults(newResults);
      }
      setIsLoading(false)
      setStopsave(true)
    }

  };
  const handleUpadates = async () => {
     alert("dzdazdazdazda");

  }

  return(
  <>
  <div className="min-h-screen bg-gray-900 bg-gradient-to-l from-custom-blue to-custom-dark bg-[length:200%_100%] animate-gradient-x text-white relative overflow-hidden">
    <div className="relative max-w-7xl mx-auto p-6 space-y-6">

        <div className='flex items-center justify-between cursor-pointer lg:ml-6 sm:mb-5 text-white font-bold'>
          <div className=" hover:text-blue-400 transition-colors duration-200"
              onClick={() =>router('/starter')}>
              <i className='fa-solid fa-arrow-left'></i> Back
          </div>
          <div className="flex gap-2 items-center hover:text-blue-400 transition-colors duration-200"
              onClick={() =>router('/starter')}>
             <Edit/> Edit
          </div>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BusinessInfo name={project?.data?.name || project?.name } project={project}  />

        {results?.length > 0 && (
          <div className="flex justify-end items-center bg-gray-800/50 p-6 rounded-lg 
                      backdrop-blur-sm border border-gray-700 shadow-lg">
            <ActionButtons
             handleUpadates={handleUpadates}
              isLoading={isLoading}
              onDownload={handleDownloadCSV}
              onSave={handleSave}
              disabled={isLoading}
              stopSave={stopSave}
            />
          </div>
        )}
      </div>
      <div className="bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700 
                  shadow-lg overflow-hidden">
        <ResultsTable
          results={results}
          totalKeywords={totalKeywords}
          level={level}
        />
      </div>
      </div>
    </div>

    {showForm ?  <Form myState={'login'} /> : ''}
  </>
)
}