import { useEffect, useState } from "react"

export default function Starter ()  {
    const [country, setcountry] = useState(null);
    const [countries, setcountries] = useState([]);
    const [cities, setCities] = useState([]);
    const fetchCountries = async () => {
        try {
            const res = await fetch('https://restcountries.com/v3.1/all');
            const data = await res.json();
            if (res.ok) {
                setcountries(data);
            }
        }catch (err) {
            console.log(err);
        }
    }   

    

    useEffect(() => {
        fetchCountries();
    }, []);

    return <div className="lg:w-1/2  sm:w-1/5  md:w-1/5 m-auto bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 rounded-md  min-h-[100%] bg-white">
        <form className="mt-8 space-y-6 mb-5 h-[100%] " onSubmit={console.log('yes')}>

        </form>
    </div>
}