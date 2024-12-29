import './assets/css/main.css';
import './assets/css/LandingPage.css';
import Form from './components/Form';
import { useState } from 'react';
import ProjectForm from './components/ProjectForm';
import NavBar from './components/NavBar';
import { useMainContext } from './context/MainContext';
import Circle from './components/Circle';


export default function LandingPage()  {
    const {
        showForm,
        setShowForm,
        setToken,
        inProcess,
        setInProcess,
        showProjectForm,
        setShowProjectForm
    } = useMainContext();

    const navBarLinks = [
        {
            name : showForm ? '' :'Connexion',
            icon : '',
            action : () =>  setShowForm(true),
            cssClasses : showForm ?  'opacity-0' : 'font-bold opacity-1'  
        },
    ];
    const renderContent = () => {
        if (showForm) {
            return <div className="w-2/6 m-auto flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 rounded-md">
                <Form sharedStates={[setToken, inProcess, setInProcess]} />;
            </div>
        }
        else if (!showForm && !showProjectForm){
            return (
            <div className="flex flex-col p-10 justify-center items-center m-auto w-8/12 h-[30vh] mt-40 font-bold text-white">
                <p className="mb-10 text-3xl text-center">
                Start optimizing your SEO efforts today with KeywordSearcherAnalyser and take your rankings to the next level!
                </p>
                <button 
                className="w-[20%] py-3 px-6 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
                onClick={() => setShowProjectForm(true)}
                >
                Start now
                </button>
            </div>
            );
        }
        else {
            return <ProjectForm sharedStates={[setToken, inProcess, setInProcess]} />
        }
    }

    return (<>       
        <header className='bg-[#111569] z-50 w-[100%] relative pb-10 opacity-0.5 transition-width duration-500 ease-in-out'>
            <NavBar links={navBarLinks}/>
            {renderContent()}
            <Circle/>

            <div className="area w-screen z-[-1] h-screen opacity-0.5" >
                <ul className="circles z-0">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                </ul>
            </div >
        </header>
    </>)
} 
