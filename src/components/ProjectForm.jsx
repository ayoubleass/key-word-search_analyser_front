import { useMainContext } from "../context/MainContext";
import FlashMessage from "./FlashMessage";
import { useState } from "react";

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
        {
            label : 'Project Domain',
            name : 'domain',
            type : 'text'
        }
]

export default function ProjectForm (){
    const {
      flashMessage,
      setFlashMessage,
      messageType,
      setMessageType,
      inProcess,
      setShowProjectForm
    } = useMainContext();
    const [errors, setErrors] = useState({});
    
    const inputClass = 'appearance-none rounded-lg relative block w-full \
        pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900\
        focus:outline-none focus:ring-2 focus:ring-[#111569] focus:border-[#111569] focus:z-10 sm:text-sm' 

    const handleCreateProject = async (e) => {
        e.preventDefault();
    }

    return (
      <div className="w-2/6 m-auto flex  items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 rounded-md relative">
        <div className="absolute text-xl p-5 hover:text-white cursor-pointer hover:bg-red-400 flex items-center justify-center top-0 right-0 h-5 w-5 border rounded-full"
          onClick={() => setShowProjectForm(false) }
        >
          <i class="fa-solid fa-xmark"></i>
        </div> 
        <div className="max-w-md w-full space-y-8">
          {
            flashMessage ? <FlashMessage message={flashMessage} type={messageType}/> : '' 
          }
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Create Project
            </h2>
           <p className="mt-2 text-center text-sm text-gray-600">
                Start by creating a new project to begin organizing and optimizing your SEO efforts. Define the key aspects of your project, add relevant details, and take the first step towards improving your website's search engine rankings. Whether you're working on a blog, e-commerce site, or business landing page, this tool will help you structure and analyze your project for better SEO performance.
            </p>
          </div>  
          <form className="mt-8 space-y-6" onSubmit={handleCreateProject}>
            <div className="rounded-md shadow-sm space-y-4">
                {formInputs.map((f, index) => {
                    return (
                        <div key={index} className="relative">
                            <label htmlFor="email" className="sr-only">{f.label}</label>
                            <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            {f.name === 'description' ?  
                                 <textarea
                                    className="w-full h-32 p-4 border-2 border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-gray-900"
                                    placeholder="Enter your text here..."
                                ></textarea>
                            :
                                <input
                                    type={f.type}
                                    name={f.name}
                                    id={index} 
                                    className={Object.entries(errors).length > 0 ? inputClass.concat('border-2 border-rose-600') : inputClass}
                                    placeholder={f.label}
                                    disabled={inProcess}
                                />
                            }
                            {Object.entries(errors).length > 0 ? (
                                <div className="mt-2 text-sm text-red-500">
                                    {errors instanceof Object ? errors[f.name][0] : errors}
                                </div>
                            ) : ''}
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
    );
}