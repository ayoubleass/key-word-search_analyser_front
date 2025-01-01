
import SearchVolumeChart from "./SearchVolumeChart"
import CircleChart from "./CircleChart"

export default function VisChart({percent = 0, search}) {
    return <div className="flex items-center justify-around text-gray-500">
        <SearchVolumeChart monthlySearches={search} />
        <CircleChart percent={percent}/>
  </div>
}