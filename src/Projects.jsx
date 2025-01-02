import { useEffect, useState } from "react";
import { useMainContext } from "./context/MainContext";
import { Divide } from "lucide-react";
import { useNavigate } from "react-router-dom";



const Projects = () => {
    const {token, setResults, setProject, setStopSave} = useMainContext();
    const navigate = useNavigate();
    const [projects, setProjects 
    ] = useState([]);
    const fetchProjects = async() => {
        try {
            const res = await fetch('http://localhost:3000/api/v1/projects', {
                headers : {
                    'content-type': "application/json",
                    Accept : 'application/json',
                    'X-Token': token,
                },    
            })
            const data = await res.json();
            if (res.ok) {
               setProjects(data);
               console.log(data);
            }
        }catch (err) {
            console.log(err);
        }
    }
 
    useEffect(() => {
        if (!token) return; // Add this check
        fetchProjects();
    }, [token])


    
    const handleView = async (project) => {
        const res = await fetch(`http://localhost:3000/api/v1/projects/${project.id}/results`, {
            method : "GET",
             headers : {
                    'content-type': "application/json",
                    Accept : 'application/json',
                    'X-Token': token,
            }
        });
        const  data = await res.json();
        if (res.ok) {
            setProject(project);
            setResults(data);
            setStopSave(true)
            navigate('/results');
        }

    }
    return (
    <div className="min-h-screen bg-[#111569] z-50 w-[100%] relative pb-10 opacity-0.5 py-10 px-16 \
    transition-width duration-500 ease-in-out bg-gradient-to-l from-custom-blue \
    to-custom-dark bg-[length:200%_100%] animate-gradient-x">
     
        <div className='flex items-center justify-between cursor-pointer lg:ml-6 sm:mb-5 text-white font-bold'>
          <div className=" hover:text-blue-400 transition-colors duration-200"
              onClick={() => navigate('/') }>
              <i className='fa-solid fa-arrow-left'></i> Back
          </div>
        </div>

      <div className="grid gap-4 px-10">
        {projects.map((project) => (
          <div key={project.id} className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm 
              border border-gray-100 hover:shadow-md transition-all duration-200 h-[80px]">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
              </div>
              
              <div className="flex gap-2 ml-4 ">
                <button 
                  onClick={() => handleView(project)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <i className="fas fa-eye"></i>
                </button>
                <button 
                  onClick={() => handleDelete(project.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;