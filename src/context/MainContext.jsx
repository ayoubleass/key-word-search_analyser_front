import { createContext, useContext, useState, useRef } from 'react';
import { CgPassword } from 'react-icons/cg';

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
    const [results, setResults] = useState([]);
    const [save, setSave] = useState([]);
    const [project, setProject] = useState({
      name : '',
      description: '',
      url: ""
    });

    const [userData, setUserData] = useState({
        name : '',
        email: '',
        password : '',
        phoneNumber : '',
    });

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
        results ,
        setResults,
        save,
        setSave,
        setUserData,
        userData,
    };
    return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
}