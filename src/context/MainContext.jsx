import { createContext, useContext, useState, useRef } from 'react';

const MainContext = createContext();

export const useMainContext = () => {
  return useContext(MainContext);
};

export const MainContextProvider = ({ children }) => {
    const [showForm, setShowForm] = useState(false);
    const [token, setToken] = useState(null);
    const [inProcess, setInProcess] = useState(false);
    const [showProjectForm, setShowProjectForm] = useState(false);
     const [flashMessage, setFlashMessage] = useState(null);
    const [messageType, setMessageType] = useState('');
    const [project, setProject] = useState({});
    //const [results, setResults] = useState([]);
    const value = {
        showForm,
        setShowForm,
        token,
        setToken,
        inProcess,
        setInProcess,
        showProjectForm,
        setShowProjectForm,
        flashMessage,
        setFlashMessage,
        messageType,
        setMessageType,
        project,
        setProject,
    };
    return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
}