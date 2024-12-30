import { useEffect, useState } from 'react';
import FlashMessage from './FlashMessage';
import { useMainContext } from '../context/MainContext';
import { useNavigate, useLocation } from 'react-router-dom';

const STATES = ['login', 'forgotPassword', 'signUp', 'resetPassword'];
const BASEURL = "http://localhost:3000/api/v1";
const formInputs = {
    'signUp' : [
        {
            label: 'Your name',
            name: 'name',
            type : 'text',
        },
         {
            label: 'Email address',
            name: 'email',
            type : 'email',
        },
        {
            label: 'Phone NUmber',
            name: 'phoneNumber',
            type : 'text',
        },
        {
            label: 'password',
            name : 'password',
            type : 'password',
        },

    ],
    'login' : [
        {
            label: 'Email address',
            name: 'email',
            type : 'email',
        },
        {
            label: 'password',
            name : 'password',
            type : 'password',
        }
    ],
    'forgotPassword' : [
        {
            label: 'Email address',
            name: 'email',
            type : 'email',
        },
    ],
    'resetPassword' : [
        {
            label: 'password',
            name : 'password',
            type : 'password',
        },
        {
            label: 'Confirmation',
            name : 'confirmation',
            type : 'password',
        }
    ]
};

const formText = {
    signUp : {
         title: 'Create your account',
        subTitle: '',
        button: 'Sign Up',
    },
    login: {
        title: 'Welcome back',
        subTitle: 'Sign in to your account',
        button: 'Sign in',
    },
    forgotPassword: {
        title: 'Forgot your password?',
        subTitle: 'Enter your email address to reset your password.',
        button: 'Send reset link',
    },
    resetPassword: {
        title: 'Reset your password',
        subTitle: 'Enter your new password below.',
        button: 'Reset Password',
    }
};

const Form = ({myState = 'login'}) => {
    const navigate = useNavigate();
    const {
      flashMessage,
      setFlashMessage,
      messageType,
      setMessageType,
      setShowForm,
      showForm,
      setInProcess,
      setToken,
      token,
      inProcess
    } = useMainContext();
    const [state, setStates] = useState(myState);
    const [oldState, setOldState] = useState('');
    const [errors, setErrors] = useState({});
    const [error, setError] = useState([]);


    const inputClass = 'appearance-none rounded-lg relative block w-full \
        pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900\
        focus:outline-none focus:ring-2 focus:ring-[#111569] focus:border-[#111569] focus:z-10 sm:text-sm' 

    const handleLogin = async (e) => {
        const form = e.target;
        const formData = new FormData(form);
        const encodedData = btoa(`${formData.get('email')}:${formData.get('password')}`);
        try {
            const res = await fetch("http://localhost:3000/api/v1/login", {
                method : 'POST',
                headers : {
                    Accept : 'application/json',
                    Authorization : `Basic ${encodedData}`
                },
            })
            const data = await res.json();
            if (res.ok) {
                setToken(data.token);
                setFlashMessage(`Welcome ${data?.userData?.name}`);
                setMessageType('success');
                setShowForm(false);
                setErrors({});
            }else{
                setErrors(data.errors || data.error || '');
            }
            setInProcess(false);
        }catch (err){
            console.log(err);
        }
    }
  

    const handleForm = async (e) => {
        e.preventDefault();
        setInProcess(true);
        switch (state) {
            case STATES[0]:
                    await handleLogin(e);
                break;
            case STATES[1]:
                    await handleForgotPassword(e);
                break;
            case STATES[2]:
                    await handleCreateAccount(e);
                break;
            case STATES[3]:
                    await handleResetPassword(e);
                break;
        }
    }

    const handleForgotPassword = async (e) => { 
        const form = e.target;
        const formData = new FormData(form);
        const email = formData.get('email');
        try {
            const res = await fetch(`${BASEURL}/forgotPassword`, {
                method : 'POST',
                headers : { 
                    Accept : "application/json",
                    "Content-Type": "application/json", 
                },
                body : JSON.stringify({email}),
            });
            const data = await res.json();
            if (res.ok) {
                setFlashMessage(data?.message);
                setMessageType('success')
                setErrors({});
            }else{
                setErrors(data.error);
            }
            setInProcess(false);
        }catch (err) {
            console.log(err);
        }
    }

    const handleCreateAccount =  async (e) => {
        setInProcess(true);
        const form = e.target;
        const formData = new FormData(form);
        const email = formData.get('email');
        const name = formData.get('name');
        const phoneNumber = formData.get('phoneNumber');
        const password = formData.get('password');

        try {
            const res = await fetch(`${BASEURL}/signUp`, {
                method : 'POST',
                headers : { 
                    Accept : "application/json",
                    "Content-Type": "application/json", 
                },
                body : JSON.stringify({email, password, name, phoneNumber}),
            });
            const data = await res.json();
            if (res.ok) {
                setFlashMessage('Your account has been created');
                setMessageType('success')
                setPassword('');
                setStates('login');
                setErrors({});
                setError('');
            }else{
                if(Object.entries(data.errors).length === 1) {
                    const key  = Object.keys(data.errors);
                    setError(data.errors[key][0]);
                    setErrors(data.errors);
                }else {
                    setErrors(data.errors);
                }
            }
            setInProcess(false);
        }catch (err) {
            console.log(err);
        }
    } 


    const handleResetPassword = async (e) => {
        const queryParameters = new URLSearchParams(window.location.search);
        const form = e.target;
        const formData = new FormData(form);
        const resetToken = queryParameters.get('token');
        const id = queryParameters.get('id');
        const password = formData.get('confirmation');
        const confirmation = formData.get('password');
    
        if(password !== confirmation) {
            setError('password must match the confirmation');
            setInProcess(false);
        }else{
            try {
                setInProcess(true);
                const res = await fetch(`${BASEURL}/resetPassword`, {
                    method : 'PUT',
                    headers : { 
                        Accept : "application/json",
                        "Content-Type": "application/json", 
                    },
                    body : JSON.stringify({password, id, resetToken}),
                })

                const data = await res.json();
                if (res.ok) {
                    setFlashMessage(data.message);
                    setMessageType('succes');
                    setShowForm(false);
                    navigate('/');
                }else{
                    setErrors(data.errors);
                }
                setInProcess(false);
            }catch (err) {
                console.log(err);
            }
        }

    }
    useEffect(() => {
        if(state == STATES[3] && !queryParameters.get('id') && state == STATES[3] && !queryParameters.get('token')) {
            setStates('login');
        }
    })

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-50  mb-3 min-h-screen py-10">
            <span className='cursor-pointer ml-20 text-white font-bold ' onClick={() => setShowForm(false)}><i className='fa-solid fa-arrow-left'></i> Back</span>
           <div className="lg:w-2/6  sm:w-1/5  md:w-1/5 m-auto bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 rounded-md relative h-[100%]">
           {error ? <div className='text-center text-red-500'>
                {error}
            </div> : ''}
            <div className="max-w-md w-full space-y-8">
                <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                {formText[state]?.title}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                {formText[state]?.subTitle}
                </p>
            </div>  
            <form className="mt-8 space-y-6 mb-5 h-[100%] " onSubmit={handleForm}>
                <div className="rounded-md shadow-sm space-y-4">
                    {formInputs[state].map((f, index) => {
                        return (
                            <div key={index} className="relative">
                                <label htmlFor="email" className="sr-only">{f.label}</label>
                                <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type={f.type}
                                    name={f.name}
                                    id={index} 
                                    className={Object.entries(errors || {}).length > 0  && errors[f.name]?.length > 0 ? inputClass.concat('border-2 border-rose-600 placeholder-red-500 relative  text-red-500') : inputClass}
                                    placeholder={Object.entries(errors).length > 0  &&  errors[f.name]?.length > 0  ? errors[f.name][0] : f.label}
                                    disabled={inProcess}
                                    onClick={() => setErrors({})}
                                />
                            </div>
                        )
                    })}
                </div>
    
                <div className="flex items-center justify-between">
                {state === 'login' ? <div className="flex items-center">
                    <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#111569] focus:ring-[#111569] border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                    </label>
                </div> : ''}
                    <div className="text-sm" onClick={() => { 
                            setOldState(state)
                            setErrors({})
                            setStates('forgotPassword')
                    }}>
                        <a href="#" className="font-medium text-[#111569] hover:text-opacity-80">
                            {state !== STATES[1] && state !== STATES[3] ? 'Forgot your password?' : ''}
                        </a>
                    </div> 
                </div>
                    
                <div>
                <button
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#111569] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#111569]"
                >
                    {formText[state]?.button}
                    <i className="fas fa-arrow-right ml-2"></i>
                </button>

                 { state !== STATES[3] ? <div className="text-sm mt-2" onClick={() => { 
                            setOldState(state);
                            setErrors({});
                            setStates( state === 'login' ? 'signUp' : 'login');
                    }}>
                        <a href="#" className="font-medium text-[#111569] hover:text-opacity-80">
                            {state !== 'signUp' ? 'signUp' : 'SignIn'}
                        </a>
                    </div> : ''}
                </div>
            </form>
            </div>
        </div>
    );
};
export default Form;