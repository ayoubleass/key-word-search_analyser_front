import React from 'react';
import { MapPin, Globe, Building2 } from 'lucide-react';
import languageData from '../../dataForSeo';

const LanguageSelector = ({ 
  selectedLanguage, 
  selectedCountry, 
  onLanguageChange, 
  onCountryChange, 
  onWebsiteChange ,
  project
}) => {
  // Get unique list of languages from languageData
  const languages = Object.keys(languageData).sort();

  // Get countries for selected language
  const countries = selectedLanguage 
    ? languageData[selectedLanguage].countries
    : [];

  return (
    <div className="space-y-6 w-full text-black">
      {/* Website URL input */}
      <div className="relative w-full group">
        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors z-10" />
        <input
          type="text"
          placeholder="website URL"
          value={project.url}
          onChange={(e) => {
            onWebsiteChange({
              ...project,
              url : e.target.value
            })
          }}
          className="w-full border text-gray-900 	border-gray-700 rounded-lg pl-12 pr-4 py-3 h-10
                    text-gray-100  focus:ring-2 focus:ring-blue-500 
                    focus:border-transparent outline-none transition-all duration-200
                    backdrop-blur-sm"
        />
      </div>

      {/* Language and Country selectors */}
      <div className="flex gap-6 w-full">
        {/* Language Select */}
        <div className="relative w-full group">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors z-10" />
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="w-full border text-gray-900 border-gray-700 rounded-lg pl-12 pr-4  h-10
                      text-gray-100 placeholder-gray-800 text-black  focus:ring-2 focus:ring-blue-500 
                      focus:border-transparent outline-none transition-all duration-200
                      backdrop-blur-sm appearance-none"
          >
            <option value="">Select Language</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Country Select */}
        <div className="relative w-full group">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors z-10" />
          <select
            value={selectedCountry ? JSON.stringify(selectedCountry) : ""}
            onChange={(e) => onCountryChange(JSON.parse(e.target.value))}
            disabled={!selectedLanguage}
            className="w-full border text-gray-500 border-gray-700 rounded-lg pl-12 pr-4 h-10
                      text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 
                      focus:border-transparent outline-none transition-all duration-200
                      backdrop-blur-sm appearance-none disabled:opacity-50"
          >
            <option value="">Select Country</option>
            {countries.map(country => (
              <option key={country.code} value={JSON.stringify(country)}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Display selected location code */}
      {selectedCountry && (
        <div className="text-sm text-gray-200">
          Location Code: {selectedCountry.code}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;