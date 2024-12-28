import { use } from 'react';
import { useState } from 'react';
import FlashMessage from './FlashMessage';

const STATES = ['login', 'forgotPassword', 'resetPassword'];
const BASEURL = "http://localhost:3000/api/v1";
const formInputs = {
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
        }
    ]
};

const formText = {
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

const Form = ({sharedStates}) => {

    const [state, setStates] = useState('login');
    const [oldState, setOldState] = useState('');
    const [errors, setErrors] = useState({});
    const [token , inProcess, setInProcess ] = sharedStates;
    const [flashMessage, setFlashMessage] = useState(null);
    const [messageType, setMessageType] = useState('');

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
                setErrors({});
            }else{
                setErrors(data.errors || data.error);
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

    return (
        <div className="max-w-md w-full space-y-8">
          {
            flashMessage ? <FlashMessage message={flashMessage} type={messageType}/> : '' 
          }
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              {formText[state]?.title}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {formText[state]?.subTitle}
            </p>
          </div>  
          <form className="mt-8 space-y-6" onSubmit={handleForm}>
            <div className="rounded-md shadow-sm space-y-4">
                {formInputs[state].map((f, index) => {
                    return (
                        <div key={index} className="relative">
                            <label htmlFor="email" className="sr-only">{f.label}</label>
                            <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type={f.type}
                                name={f.type}
                                id={index} 
                                className={Object.entries(errors).length > 0 ? inputClass.concat('border-2 border-rose-600') : inputClass}
                                placeholder={f.name}
                                disabled={inProcess}
                            />
                            {Object.entries(errors).length > 0 ? (
                                <div className="mt-2 text-sm text-red-500">
                                    {errors instanceof Object ? errors[f.name][0] : errors}
                                </div>
                            ) : ''}
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
                {state === 'login' ? 
                    <div className="text-sm" onClick={() => { 
                        setOldState(state)
                        setStates('forgotPassword')
                    }}>
                        <a href="#" className="font-medium text-[#111569] hover:text-opacity-80">
                            Forgot your password?
                        </a>
                    </div> 
                : ''}
            </div>
  
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#111569] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#111569]"
              >
                {formText[state]?.button}
                <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </form>
        </div>
    );
};
export default Form;