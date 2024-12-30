import './assets/css/main.css';
import './assets/css/landingPage.css';
import Form from './components/Form';
import ProjectForm from './components/ProjectForm';
import NavBar from './components/NavBar';
import { useMainContext } from './context/MainContext';
import Aboutus from './components/Aboutus';
import Footer from './components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import FlashMessage from './components/FlashMessage';
import { useEffect, useState } from 'react';


export default function LandingPage()  {
    const {
        showForm,
        setShowForm,
        token,
        setToken,
        inProcess,
        setInProcess,
        showProjectForm,
        setShowProjectForm,
        flashMessage,
        messageType,
        setFlashMessage,
        
    } = useMainContext();

    const [state, setState] = useState('login');

    const queryParameters = new URLSearchParams(window.location.search);

    useEffect(() => {
        if(flashMessage){
            setTimeout(() => {
                setFlashMessage(null);  
            }, 2000);
        }
        if (queryParameters.get('id') && queryParameters.get('token')) {
            setState('resetPassword');
            setShowForm(true);
        }
    }, [flashMessage])

    const renderContent = () => {
        if (showForm) {
            return <Form myState={state} />;
        }
        else if (!showForm && !showProjectForm){
            return (
            <div className="flex flex-col p-10 justify-center items-center m-auto w-8/12 h-[30vh] mt-40 font-bold text-white">
                <p className="mb-10 text-3xl text-center">
                Start optimizing your SEO efforts today with KeywordSearcherAnalyser and take your rankings to the next level!
                </p>
                <button 
                className="w-[20%] py-3 px-6 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 sm:width[50%]"
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
    
    const headerCss= 'h-screen bg-[#111569] z-50 w-[100%] relative pb-10 opacity-0.5 transition-width duration-500 ease-in-out';
    return (<>
        {flashMessage ? <FlashMessage message={flashMessage} type={messageType}/> : ''}      
        <header className={headerCss}>
            <NavBar/>
            {renderContent()}
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
        <Aboutus/>
        <Footer/>
    </>)
} 
