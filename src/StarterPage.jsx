import NavBar from './components/NavBar';
import './assets/css/main.css';
import './assets/css/landingPage.css';
import Form from './components/Form';
import ProjectForm from './components/ProjectForm';
import { useMainContext } from './context/MainContext';
import Starter from './components/Starter';


export default function StarterPage() {
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

    const renderContent = () => {
        if (showForm) {
            return <Form sharedStates={[setToken, inProcess, setInProcess]} />;
        }
        else if (!showForm && !showProjectForm){
            return (
                <Starter />
            );
        }
        else {
            return <ProjectForm sharedStates={[setToken, inProcess, setInProcess]} />
        }
    }

    return <section className='min-h-[100vh] bg-[#111569] z-50 w-[100%] relative pb-10 opacity-0.5 transition-width duration-500 ease-in-out'>
        <NavBar />
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
            </div>
    </section>
}