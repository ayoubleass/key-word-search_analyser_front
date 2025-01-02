import { useState, useContext, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import Input from "./components/Input";
import axios from "axios";
import { useMainContext } from './context/MainContext';

import { 
  Sparkles,
  Loader2,
  User,
  KeyRound
} from 'lucide-react';


import LanguageSelector from "./components/LanguageComponents";
import { PiPassword, PiPasswordBold } from "react-icons/pi";

export default function Starter() {
  const [apiCredentials , setApiCredentials] = useState({
    user : "",
    password : ""
  });
  const [keywords, setKeywords] = useState([""]);
  const [loading, setLoading] = useState(false);
  const {project ,results , setProject, setResults , setShowProjectForm, stopeSave} = useMainContext();
  const [error, setError] = useState('');
  const router = useNavigate();
  const resultsMap = new Map();


  console.log(results.filter((r) => {
    if(!Object.keys(r).includes('updatedAt')) {
      return r.keyword;
    }
  }));
  
  console.log('------------------------------------', results);
  console.log('------------------------------------', project);
    
  useEffect(() => {
    if (!project.name.length) {
        setShowProjectForm(true);
        router('/')
    }
    if(results.length > 0 ){
      setKeywords(results.map((r) => r.keyword))
    }
  }, []);
  
  

  const handleChange = (index) => (e) => {
    const newKeywords = [...keywords];
    newKeywords[index] = e.target.value.toLowerCase();
    setKeywords(newKeywords);
  };

  const handleAddInput = (index) => {
    const newKeywords = [...keywords];
    newKeywords.splice(index + 1, 0, "");
    setKeywords(newKeywords);
  };

  const handleRemoveInput = (index) => {
    if (keywords.length > 1) {
      const newKeywords = keywords.filter((_, i) => i !== index);
      setKeywords(newKeywords);
    }
  };


  const fetchKeywordsInput = async () => {
    setLoading(true);
    const username = apiCredentials.user;
    const password = apiCredentials.password ;
    const post_array = [];
    if (keywords.length === 0 || (keywords.length === 1 && keywords[0] === '')) {
      setError("Keywords list cannot be empty. Please provide at least one valid keyword.");
      setLoading(false);
      return;
    }

    if (!project.selectedLanguage || !project.selectedCountry.code) {
      setError("Please ensure both language and country are selected.");
      setLoading(false);
      return;
    }


    post_array.push({
      keywords: keywords,
      language_name: project.selectedLanguage,
      location_code: parseInt(project.selectedCountry.code),
    });

    if(stopeSave) {
      
    }

    // Add search volume to the result map
    const searchVolume = async () => {
      try {
        const response = await axios({
          method: 'post',
          url: 'https://api.dataforseo.com/v3/keywords_data/clickstream_data/dataforseo_search_volume/live',
          auth: { username, password },
          data: post_array,
          headers: { 'content-type': 'application/json' },
        });

        if (response.status === 200) {
          const datas = response.data.tasks[0].result[0].items;
          for (const data of datas) {
            const { keyword, search_volume, monthly_searches } = data;
            const existingData = resultsMap.get(keyword) || {};
            resultsMap.set(keyword, { ...existingData, keyword, search_volume , monthly_searches });
          }
          //console.log("After search volume:", Array.from(results.entries())); 
        }
        else{
          console.log("Somthing went wrong in API");
          
        }
      } catch (error) {
        console.error('Error fetching search volume:', error.response?.data || error.message);
      }
    };
    

    const getKeywordDifficulty = async () => {
      try {
        const response = await axios({
          method: 'post',
          url: 'https://api.dataforseo.com/v3/dataforseo_labs/bulk_keyword_difficulty/live',
          auth: { username, password },
          data: post_array,
          headers: { 'content-type': 'application/json' },
        });

        if (response.status === 200) {
          const datas = response.data.tasks[0].result[0].items;
          for (const data of datas) {
            const { keyword, keyword_difficulty } = data;
            const existingData = resultsMap.get(keyword) || {};
            resultsMap.set(keyword, { ...existingData, keyword, keyword_difficulty });
          }
        }
      } catch (error) {
        console.error('Error fetching keyword difficulty:', error.response?.data || error.message);
      }
    };


    const getKeywordSuggestions = async () => {
      for (const combinationKeyword  of keywords) {
        const suggestionArray = [
          {
            keyword: combinationKeyword,
            location_code: parseInt(project.selectedCountry.code),
            limit : 20,
          },
        ];

        try {
          const response = await axios({
            method: 'post',
            url: 'https://api.dataforseo.com/v3/dataforseo_labs/keyword_suggestions/live',
            auth: { username, password },
            data: suggestionArray,
            headers: { 'Content-Type': 'application/json' },
          });
          if (response.status === 200) {
            const suggestions = response.data.tasks[0].result[0].items.map(item =>  ({
              keyword: item.keyword,
              search_volume: item.keyword_info.search_volume || 0,
              keyword_difficulty: item.keyword_properties.keyword_difficulty || 0,
            })
          );
            const existingData = resultsMap.get(combinationKeyword) || {};
            
            resultsMap.set(combinationKeyword, { ...existingData, combinationKeyword, suggestions });
          }
        } catch (error) {
          console.error('Error fetching keyword suggestions:', error.response?.data || error.message);
        }
      }
    };

    const getAllKeywordData = async () => {
      await searchVolume();
      await getKeywordDifficulty();
      await getKeywordSuggestions();
      // Log final results with suggestions
      const formattedResults = Array.from(resultsMap.entries()).map(([keyword, data]) => ({
          keyword,
          search_volume: data.search_volume || 0,
          monthlySearch : data.monthly_searches  || 0,
          keyword_difficulty: data.keyword_difficulty || 0,
          suggestions: data.suggestions || [], // Log suggestions if present
        }));
        setResults(formattedResults);
      };
      await getAllKeywordData();
      setLoading(false);
      router('/results')
      
  };

  
  return (
    <>
      <div className="min-h-screen bg-gradient-to-l from-custom-blue to-custom-dark bg-[length:200%_100%] animate-gradient-x">
        <div className="relative max-screen mx-auto px-6 py-5 space-y-6">
          <div className="flex items-center justify-between space-y-2 mb-12 ">
        <div className='cursor-pointer lg:ml-40 sm:ml-5 text-white font-bold text-black flex gap-2 items-center' onClick={() => router('/')}>
          <i className='fa-solid fa-arrow-left'></i> 
          Back
        </div>
          {/*logo */}   
          </div>
      <div className="relative flex flex-col items-center justify-center max-w-4xl mx-auto px-6 py-10  space-y-6">
         

          {/* input of country and location code error */}
         {error && (
            <div className="bg-[size:200%_100%] animate-gradient-x">
              <p className="text-red-500 text-xl mt-1 ml-1 transition-all duration-300">
                {error}
              </p>
            </div>
          )}

          {/* Api credentials collect */} 
          <div className="flex gap-2 w-full group ">
          <div className="relative w-full group mb-5">
                 <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors z-10" />
                 <input
                   type="text"
                   placeholder="DARAFORSEO Api user"
                   value={apiCredentials.user}
                   onChange={(e) => {
                    setApiCredentials({
                      ...apiCredentials,
                      user : e.target.value
                    })
               }}
                   className="w-full border text-gray-900 	border-gray-700 rounded-lg pl-12 pr-4 py-3 h-10
                             text-gray-100  focus:ring-2 focus:ring-blue-500 
                             focus:border-transparent outline-none transition-all duration-200
                             backdrop-blur-sm"
                 />
          </div>

          <div className="relative w-full group mb-5">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors z-10" />
                
                 <input
                   type="password"
                   placeholder="DATAFROSEO Api password"
                   value={apiCredentials.password}
                   onChange={(e) => {
                        setApiCredentials({
                          ...apiCredentials,
                          password : e.target.value
                        })
                   }}
                   className="w-full border text-gray-900 	border-gray-700 rounded-lg pl-12 pr-4 py-3 h-10
                             text-gray-100  focus:ring-2 focus:ring-blue-500 
                             focus:border-transparent outline-none transition-all duration-200
                             backdrop-blur-sm"
                 />
          </div>
          </div>

          <div className="flex gap-6 justify-between items-center w-full">
          
          <LanguageSelector
              onWebsiteChange={setProject}
              project={project}
          />
          </div>
          {/* Input section */}
          <div className="space-y-4 w-full">
                {keywords.map((keyword, index) => (
                  <Input
                  key={index}
                  index={index + 1}
                  value={keyword}
                  handleChange={handleChange(index)}
                  onAdd={() => handleAddInput(index)}
                  onRemove={() => handleRemoveInput(index)}
                  isLast={index === keywords.length - 1}
                  disabled={loading}
                  />
                ))}
              </div>
      
          {/* Action button */}
          <button
            onClick={fetchKeywordsInput}
            desabled={loading}
            className="w-full bg-blue-600 hover:from-blue-500 
                    hover:to-purple-500 text-white font-medium py-4 px-8 rounded-lg
                    transition-all duration-200 transform hover:scale-[1.02] 
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                    flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Analyse</span>
              </>
            )}
          </button>
      </div>
        </div>
      </div>

    </>
  );
}