import SearchVolumeChart from "./SearchVolumeChart"
import CircleChart from "./CircleChart"
import { useMainContext } from "../context/MainContext"
import languageData from '../../dataForSeo'


export default function VisChart({percent = 0, search}) {
  const {project} = useMainContext();
  const countries = project.selectedLanguage
    ? languageData[project.selectedLanguage].countries
    : [];
  const country = countries.find((c) =>  project?.locationCode?.toString() ===  c.code);

  return ( search ? <>
    
    <div className="flex items-center justify-around text-gray-500 relative">
      <div className="absolute left-20 top-0 font-bold ">
        <h3>{country.name} </h3>
      </div>
      <SearchVolumeChart monthlySearches={search} />
      <CircleChart percent={percent} />
    </div>
    </> : 
    
    ""
  )
  
}