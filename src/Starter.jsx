import { useState, useContext, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { useMainContext } from './context/MainContext';
import Input from "./components/Input";
import LocationsInput from "./components/Locations";
import FlashMessage from "./components/FlashMessage";
import axios from "axios";
import { 
  Sparkles,
  Loader2,
  User,
  KeyRound
} from 'lucide-react';
import LanguageSelector from "./components/LanguageComponents";
import { getCites, removeCityFromKeyword } from "./utils";


export default function Starter() {
  const [keywords, setKeywords] = useState([""]);
  const [loading, setLoading] = useState(false);
  const {project, results, setProject, setResults, setShowProjectForm, stopeSave, locations ,
    setLocations, apiCredentials,
    setApiCredentials, setMessageType,
    setFlashMessage, flashMessage, messageType
  } = useMainContext();
  const [error, setError] = useState('');
  const [cities, setCities] = useState([]);  
  const router = useNavigate();
  const resultsMap = new Map();


  useEffect(() => {
    if (!project.name.length) {
        setShowProjectForm(true);
        router('/')
    }
    if(results.length > 0 ){
      setKeywords(results.map((r) => r.keyword))
    }
    const getContryCities = async ()=> {
      if (project?.selectedCountry?.name) {
        const countryCites = await getCites(project.selectedCountry.name) ;
        setCities(countryCites);       
      }
    }
    getContryCities();
  }, [project?.selectedCountry?.name]);

  const updateResultsMap = (results, keyFields) => {
    results.forEach((data) => {
      const keyword = data.keyword;
      const updatedData = keyFields.reduce((acc, field) => {
        acc[field] = data[field] || (field === 'search_volume' ? 0 : []);
        console.log(acc);
        return acc;
      }, { keyword });
      const existingData = resultsMap.get(keyword) || {};
      resultsMap.set(keyword, { ...existingData, ...updatedData });
    });
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
    if(!apiCredentials.api_user || !apiCredentials.api_password) {
      setError('API credentials are required to perform this action.');
      setLoading(false);
      return;
    }
    if (keywords.length === 0 || (keywords.length === 1 && keywords[0] === '')) {
      setError("Keywords list cannot be empty. Please provide at least one valid keyword.");
      setLoading(false);
      return;
    }
    if (!project.selectedLanguage && !project.locationCode) {
      setError("Please ensure both language and country are selected.");
      setLoading(false);
      return;
    }
    const username = apiCredentials.api_user;
    const password = apiCredentials.api_password ;
    const post_array = [];
    const newKeyword = keywords.filter((key) => key.length > 0);
    post_array.push({
      keywords: newKeyword,
      language_name: project.selectedLanguage,
      location_code: parseInt(project.locationCode),
    });
    


    const searchVolume = async () => {
      /*'https://api.dataforseo.com/v3/keywords_data/clickstream_data/dataforseo_search_volume/live'*/
      try {
        const response = await axios({
          method: 'post',
          url: 'https://api.dataforseo.com/v3/keywords_data/clickstream_data/bulk_search_volume/live',
          auth: { username, password },
          data: post_array,
          headers: { 'content-type': 'application/json' },
        });

        if (response.status === 200) {
          const results = response.data.tasks[0].result[0].items;
          updateResultsMap(results, ['search_volume', 'monthly_searches']);
        }
        else{
          console.log("Somthing went wrong"); 
        }
      } catch (error) {
        setFlashMessage('Oups somthing went wrong please try again!!');
        setMessageType('error');
        console.error('Error fetching search volume:', error?.message);
      }
    };
    

    /* get KEYWORD DIF  */

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
          const results = response.data.tasks[0].result[0].items;
          updateResultsMap(results, ['keyword_difficulty']);
        }
      } catch (error) {
        console.error('Error fetching keyword difficulty:', error.response?.data || error.message);
      }
    };
    
    /* get SUGGESTIONS FOR EACH KEYWORD  */
    const getKeywordSuggestions = async () => {
      const keys = post_array[0].keywords;
      for (const combinationKeyword  of keys ) {
        const suggestionArray = [
          {
            keyword: combinationKeyword,
            location_code: parseInt(project.locationCode),
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
          setLoading(false);
        }
      }
    };



    const getAllKeywordData = async () => {
      await searchVolume();
      await getKeywordDifficulty();
      await getKeywordSuggestions();
      // Log final results with suggestions
      const selectedLocations = [];
      const formattedResults = Array.from(resultsMap.entries()).map(([keyword, data]) => {
          return {
            keyword,
            location : location ? locations[0] : '' ,
            search_volume: data.search_volume || 0,
            monthlySearch : data.monthly_searches  || 0,
            keyword_difficulty: data.keyword_difficulty || 0,
            suggestions: data.suggestions || [],
          }
        });
        setResults(formattedResults); 
      };
      await getAllKeywordData();
      setLoading(false);
      router('/results')
  };


  const inputUserCss = "w-full border  decoration-sky-500 border-gray-700 rounded-lg pl-12 pr-4 py-3 h-10\
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none\
                  transition-all duration-200 backdrop-blur-sm"
  
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
        {flashMessage ? <FlashMessage message={flashMessage} type={messageType}/> : ''}
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
                   type={apiCredentials.api_user?.length > 0 ? 'password': 'text'}
                   placeholder="DATAFORSEO Api user"
                   value={apiCredentials.api_user}
                   onChange={(e) => {
                    setApiCredentials({
                      ...apiCredentials,
                      api_user : e.target.value
                    })
                  }}
                  
                  className={inputUserCss}

                 />
          </div>

          <div className="relative w-full group mb-5">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors z-10" />
                
                 <input
                   type="password"
                   placeholder="DATAFROSEO Api password"
                   value={apiCredentials.api_password}
                   onChange={(e) => {
                        setApiCredentials({
                          ...apiCredentials,
                          api_password : e.target.value
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
           
          
          {/*  bacth unput method      */ }
          

           <LocationsInput suggestions={cities} />

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