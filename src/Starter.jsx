import { useState, useContext, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import Input from "./components/Input";
import axios from "axios";
import { useMainContext } from './context/MainContext';


import { 
  Building2, 
  MapPin,
  Sparkles,
  Loader2,
  AlertTriangle,
  X,
  ArrowLeft
} from 'lucide-react';
/*import Input from "./components/Input";*/
import LanguageSelector from "./components/LanguageComponents";
import CircleChart from "./components/CircleChart";

export default function Starter() {
  const [keywords, setKeywords] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const {project ,setProject, results , setResults , setShowProjectForm} = useMainContext();
  const router = useNavigate();
  const resultsMap = new Map();

  
    
  useEffect(() => {
    if (!project.name.length) {
        setShowProjectForm(true);
        router('/')
    }
  }, []);
  
  const showError = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

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
    const username = ""; // api add
    const password = ""; // api key

    const post_array = [];
    post_array.push({
      keywords: keywords,
      language_name: selectedLanguage,
      location_code: parseInt(selectedCountry.code),
    });

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
    
    // Add keyword difficulty to the result map
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

    // Add keyword suggestions to the result map
    const getKeywordSuggestions = async () => {
      for (const combinationKeyword  of keywords) {
        const suggestionArray = [
          {
            keyword: combinationKeyword,
            location_code: 2250,
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
  // Fetch all data and merge into the results map
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
       <div className='cursor-pointer lg:ml-30 text-white font-bold text-black flex gap-2 items-center' onClick={() => router('/')}>
        <i className='fa-solid fa-arrow-left'></i> 
        Back
      </div>
        {/*logo */}   
        </div>
     <div className="relative flex flex-col items-center justify-center max-w-4xl mx-auto px-6 py-10  space-y-6">
        {/* input of country and location code */}
        <div className="flex gap-6 justify-between items-center w-full">
        <LanguageSelector
            selectedLanguage={selectedLanguage}
            selectedCountry={selectedCountry}
            onLanguageChange={setSelectedLanguage}
            onCountryChange={setSelectedCountry}
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