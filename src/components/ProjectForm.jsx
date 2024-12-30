import { useMainContext } from "../context/MainContext";
import FlashMessage from "./FlashMessage";
import { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

const formInputs = [
        {
            label: 'Project name',
            name: 'name',
            type : 'text',
        },
        {
            label : 'Description',
            name : 'description',
            type : 'text'
        },
  
]

export default function ProjectForm (){
    const navigate = useNavigate();
    const location = useLocation();
    const {
      flashMessage,
      setFlashMessage,
      messageType,
      setMessageType,
      inProcess,
      setShowProjectForm,
      project,
      setProject,
    } = useMainContext();
    const [errors, setErrors] = useState({});
    const inputClass = 'appearance-none rounded-lg relative block w-full \
        pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900\
        focus:outline-none focus:ring-2 focus:ring-[#111569] focus:border-[#111569] focus:z-10 sm:text-sm' 

    const handleProject = async (e) => {
        const errors = {};
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = {
          name : formData.get('name'),
          description: formData.get('description')
        };
        const fields  = ['url', 'name', 'descriptio'];
        /*const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        const isValidUrl = (str) => urlRegex.test(str);*/
        for(const[key, value] of Object.entries(data)) {
          if (fields.includes(key) && !value || value === '') {
            errors[key] = 'This field is required';
          }
        }
        if(Object.entries(errors).length > 0){
          setErrors(errors);
        }else {
          setProject(data);
          setShowProjectForm(false);
          navigate('/starter');
        }
    }
    const textAreaCss = 'w-full h-32 p-4 border-2 border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-gray-900';
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-5 py-10 min-h-[100vh]">
        <div className="lg:w-2/6 sm:w-1/5 md:w-1/5 m-auto bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 rounded-md relative min-h-[100%] overflow-auto">
          <div className="absolute text-xl p-5 hover:text-white cursor-pointer hover:bg-red-400 flex items-center justify-center top-0 right-0 h-5 w-5 border rounded-full"
            onClick={() => setShowProjectForm(false)}>
            <i className="fa-solid fa-xmark"></i>
          </div> 
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="text-center text-3xl font-bold text-gray-900">
                Create Project
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Start by creating a new project to begin organizing and optimizing your SEO efforts. 
              </p>
            </div>  
            <form className="mt-8 space-y-6 h-[100%]" onSubmit={handleProject}>
              <div className="rounded-md shadow-sm space-y-4">
                {formInputs.map((f, index) => {
                  return (
                    <div key={index} className="relative">            
                      {f.name === 'description' ?  
                        <textarea
                          className={Object.entries(errors).length > 0  &&  errors[f.name]   ? textAreaCss.concat('border-2 border-rose-600 placeholder-red-500') : textAreaCss}
                          placeholder={Object.entries(errors).length > 0  &&  errors[f.name]  ? errors[f.name] : "Enter your text here..."}
                          name={f.name}
                        ></textarea>
                        :
                        <input
                          type={f.type}
                          name={f.name}
                          id={index} 
                          className={Object.entries(errors).length > 0 ? inputClass.concat('border-2 border-rose-600 placeholder-red-500') : inputClass}
                          placeholder={Object.entries(errors).length > 0  &&  errors[f.name]  ? errors[f.name] :f.label}
                          disabled={inProcess}
                        />
                      }
                      {/* {Object.entries(errors).length > 0 ? (
                        <div className="text-sm text-red-500">
                          {errors[f.name]}
                        </div>
                      ) : ''} */}
                    </div>
                  )
                })}
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#111569] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#111569]"
                >
                  Create
                  <i className="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    );
}